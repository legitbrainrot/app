import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-09-30.acacia',
})

export interface EscrowContext {
  tradeId: string
  creatorUserId: string
  participantUserId: string
  amount: number
  creatorPaymentIntentId?: string
  participantPaymentIntentId?: string
}

export interface EscrowHoldResult {
  success: boolean
  paymentIntentId?: string
  clientSecret?: string
  error?: string
}

export interface EscrowReleaseResult {
  success: boolean
  transferIds?: string[]
  error?: string
}

export class EscrowService {
  private static readonly PLATFORM_FEE_PERCENTAGE = 0.03 // 3% platform fee
  private static readonly STRIPE_FEE_PERCENTAGE = 0.029 // 2.9% + $0.30
  private static readonly STRIPE_FIXED_FEE = 30 // $0.30 in cents

  /**
   * Calculate fees for escrow transaction
   */
  static calculateFees(amount: number): {
    subtotal: number
    platformFee: number
    stripeFee: number
    total: number
  } {
    const subtotal = Math.round(amount * 100) // Convert to cents
    const platformFee = Math.round(subtotal * this.PLATFORM_FEE_PERCENTAGE)
    const stripeFee = Math.round(subtotal * this.STRIPE_FEE_PERCENTAGE) + this.STRIPE_FIXED_FEE
    const total = subtotal + platformFee + stripeFee

    return {
      subtotal,
      platformFee,
      stripeFee,
      total
    }
  }

  /**
   * Create payment intent for escrow hold
   */
  static async createEscrowPaymentIntent(
    context: EscrowContext,
    userType: 'creator' | 'participant'
  ): Promise<EscrowHoldResult> {
    try {
      const fees = this.calculateFees(context.amount)
      const description = `Escrow payment for trade ${context.tradeId} - ${userType}`

      const paymentIntent = await stripe.paymentIntents.create({
        amount: fees.total,
        currency: 'usd',
        capture_method: 'automatic',
        description,
        metadata: {
          tradeId: context.tradeId,
          userType,
          userId: userType === 'creator' ? context.creatorUserId : context.participantUserId,
          originalAmount: context.amount.toString(),
          platformFee: fees.platformFee.toString(),
          stripeFee: fees.stripeFee.toString()
        },
        // Hold funds for manual release
        transfer_group: `trade_${context.tradeId}`,
      })

      return {
        success: true,
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret!
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Verify both payments are completed
   */
  static async verifyEscrowPayments(context: EscrowContext): Promise<{
    bothPaid: boolean
    creatorPaid: boolean
    participantPaid: boolean
    totalHeld: number
    error?: string
  }> {
    try {
      const results = await Promise.allSettled([
        context.creatorPaymentIntentId
          ? stripe.paymentIntents.retrieve(context.creatorPaymentIntentId)
          : Promise.resolve(null),
        context.participantPaymentIntentId
          ? stripe.paymentIntents.retrieve(context.participantPaymentIntentId)
          : Promise.resolve(null)
      ])

      const creatorPayment = results[0].status === 'fulfilled' ? results[0].value : null
      const participantPayment = results[1].status === 'fulfilled' ? results[1].value : null

      const creatorPaid = creatorPayment?.status === 'succeeded'
      const participantPaid = participantPayment?.status === 'succeeded'
      const bothPaid = creatorPaid && participantPaid

      const totalHeld = (creatorPaid ? (creatorPayment?.amount || 0) : 0) +
                       (participantPaid ? (participantPayment?.amount || 0) : 0)

      return {
        bothPaid,
        creatorPaid,
        participantPaid,
        totalHeld
      }
    } catch (error: any) {
      return {
        bothPaid: false,
        creatorPaid: false,
        participantPaid: false,
        totalHeld: 0,
        error: error.message
      }
    }
  }

  /**
   * Release escrow funds to seller (creator)
   */
  static async releaseEscrowToSeller(context: EscrowContext): Promise<EscrowReleaseResult> {
    try {
      if (!context.creatorPaymentIntentId || !context.participantPaymentIntentId) {
        return {
          success: false,
          error: 'Missing payment intent IDs'
        }
      }

      // Verify payments are completed
      const verification = await this.verifyEscrowPayments(context)
      if (!verification.bothPaid) {
        return {
          success: false,
          error: 'Both payments must be completed before release'
        }
      }

      // In a production environment, you would:
      // 1. Transfer participant's payment to creator's connected account
      // 2. Refund creator's payment (they keep their item)
      // 3. Take platform fees

      // For now, we'll simulate the process
      const fees = this.calculateFees(context.amount)
      const netAmount = fees.subtotal - fees.platformFee // Amount creator receives

      // This would be actual transfers in production:
      // const transfer = await stripe.transfers.create({
      //   amount: netAmount,
      //   currency: 'usd',
      //   destination: creatorStripeAccountId,
      //   transfer_group: `trade_${context.tradeId}`,
      // })

      // Refund creator's payment (they keep their item)
      await stripe.refunds.create({
        payment_intent: context.creatorPaymentIntentId,
        reason: 'requested_by_customer',
        metadata: {
          reason: 'escrow_release_seller_refund',
          tradeId: context.tradeId
        }
      })

      return {
        success: true,
        transferIds: [`simulated_transfer_${Date.now()}`]
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Refund escrow payments (trade cancelled/failed)
   */
  static async refundEscrowPayments(context: EscrowContext): Promise<EscrowReleaseResult> {
    try {
      const refundPromises = []

      if (context.creatorPaymentIntentId) {
        refundPromises.push(
          stripe.refunds.create({
            payment_intent: context.creatorPaymentIntentId,
            reason: 'requested_by_customer',
            metadata: {
              reason: 'trade_cancelled',
              tradeId: context.tradeId
            }
          })
        )
      }

      if (context.participantPaymentIntentId) {
        refundPromises.push(
          stripe.refunds.create({
            payment_intent: context.participantPaymentIntentId,
            reason: 'requested_by_customer',
            metadata: {
              reason: 'trade_cancelled',
              tradeId: context.tradeId
            }
          })
        )
      }

      const refundResults = await Promise.allSettled(refundPromises)
      const successfulRefunds = refundResults
        .filter(result => result.status === 'fulfilled')
        .map(result => (result as any).value.id)

      return {
        success: successfulRefunds.length > 0,
        transferIds: successfulRefunds
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Get escrow status summary
   */
  static async getEscrowStatus(context: EscrowContext): Promise<{
    status: 'pending' | 'partial' | 'held' | 'released' | 'refunded'
    totalHeld: number
    creatorStatus: 'unpaid' | 'paid' | 'refunded'
    participantStatus: 'unpaid' | 'paid' | 'refunded'
    canRelease: boolean
    error?: string
  }> {
    try {
      const verification = await this.verifyEscrowPayments(context)

      let status: 'pending' | 'partial' | 'held' | 'released' | 'refunded' = 'pending'
      if (verification.bothPaid) {
        status = 'held'
      } else if (verification.creatorPaid || verification.participantPaid) {
        status = 'partial'
      }

      return {
        status,
        totalHeld: verification.totalHeld,
        creatorStatus: verification.creatorPaid ? 'paid' : 'unpaid',
        participantStatus: verification.participantPaid ? 'paid' : 'unpaid',
        canRelease: verification.bothPaid,
        error: verification.error
      }
    } catch (error: any) {
      return {
        status: 'pending',
        totalHeld: 0,
        creatorStatus: 'unpaid',
        participantStatus: 'unpaid',
        canRelease: false,
        error: error.message
      }
    }
  }

  /**
   * Handle Stripe webhook events for escrow
   */
  static async handleWebhookEvent(event: Stripe.Event): Promise<{
    processed: boolean
    tradeId?: string
    action?: string
    error?: string
  }> {
    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object as Stripe.PaymentIntent
          const tradeId = paymentIntent.metadata?.tradeId

          if (tradeId) {
            // Update database with successful payment
            // This would trigger trade status updates
            return {
              processed: true,
              tradeId,
              action: 'payment_succeeded'
            }
          }
          break

        case 'payment_intent.payment_failed':
          const failedPayment = event.data.object as Stripe.PaymentIntent
          const failedTradeId = failedPayment.metadata?.tradeId

          if (failedTradeId) {
            return {
              processed: true,
              tradeId: failedTradeId,
              action: 'payment_failed'
            }
          }
          break

        case 'refund.created':
          const refund = event.data.object as Stripe.Refund
          const refundTradeId = refund.metadata?.tradeId

          if (refundTradeId) {
            return {
              processed: true,
              tradeId: refundTradeId,
              action: 'refund_processed'
            }
          }
          break
      }

      return { processed: false }
    } catch (error: any) {
      return {
        processed: false,
        error: error.message
      }
    }
  }

  /**
   * Simulate escrow for development/testing
   */
  static async simulateEscrowFlow(context: EscrowContext): Promise<{
    success: boolean
    steps: string[]
    mockData: any
  }> {
    const steps = [
      'Created payment intents for both users',
      'Both users completed payments',
      'Funds held in escrow',
      'Trade supervision completed',
      'Funds released to seller',
      'Creator refunded (kept item)'
    ]

    const fees = this.calculateFees(context.amount)

    return {
      success: true,
      steps,
      mockData: {
        fees,
        totalHeld: fees.total * 2, // Both users pay
        netToSeller: fees.subtotal - fees.platformFee,
        platformEarnings: fees.platformFee * 2 // From both payments
      }
    }
  }
}

// Type exports
export type EscrowStatus = 'pending' | 'partial' | 'held' | 'released' | 'refunded'
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded'
export type WebhookAction = 'payment_succeeded' | 'payment_failed' | 'refund_processed'