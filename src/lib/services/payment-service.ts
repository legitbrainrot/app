import { addMinutes, isAfter } from 'date-fns'

export interface PaymentDeadlineContext {
  tradeId: string
  paymentDeadline: Date
  creatorPaid: boolean
  participantPaid: boolean
  bothPaid: boolean
}

export interface DeadlineCheckResult {
  isExpired: boolean
  timeRemaining?: number // in milliseconds
  shouldRefund: boolean
  reason?: string
}

export class PaymentService {
  // Standard payment deadline duration (30 minutes)
  private static readonly PAYMENT_DEADLINE_MINUTES = 30

  // Grace period after deadline before auto-refund (5 minutes)
  private static readonly GRACE_PERIOD_MINUTES = 5

  /**
   * Create payment deadline from agreement time
   */
  static createPaymentDeadline(agreementTime: Date = new Date()): Date {
    return addMinutes(agreementTime, this.PAYMENT_DEADLINE_MINUTES)
  }

  /**
   * Check if payment deadline has expired
   */
  static checkDeadlineStatus(context: PaymentDeadlineContext): DeadlineCheckResult {
    const now = new Date()
    const deadline = context.paymentDeadline
    const graceEnd = addMinutes(deadline, this.GRACE_PERIOD_MINUTES)

    const isExpired = isAfter(now, deadline)
    const isGraceExpired = isAfter(now, graceEnd)
    const timeRemaining = deadline.getTime() - now.getTime()

    // Both users paid - no refund needed
    if (context.bothPaid) {
      return {
        isExpired,
        timeRemaining: Math.max(0, timeRemaining),
        shouldRefund: false
      }
    }

    // Within deadline - no action needed
    if (!isExpired) {
      return {
        isExpired: false,
        timeRemaining,
        shouldRefund: false
      }
    }

    // Past deadline but within grace period
    if (isExpired && !isGraceExpired) {
      const partialPayment = context.creatorPaid || context.participantPaid
      return {
        isExpired: true,
        timeRemaining: 0,
        shouldRefund: partialPayment,
        reason: partialPayment ? 'Grace period - preparing refund' : 'Deadline expired - no payments'
      }
    }

    // Past grace period - determine refund action
    const hasPartialPayment = (context.creatorPaid && !context.participantPaid) ||
                              (!context.creatorPaid && context.participantPaid)
    const hasNoPayment = !context.creatorPaid && !context.participantPaid

    return {
      isExpired: true,
      timeRemaining: 0,
      shouldRefund: hasPartialPayment,
      reason: hasNoPayment ? 'No payments received' : 'Partial payment - refunding'
    }
  }

  /**
   * Get deadline enforcement actions
   */
  static getEnforcementActions(context: PaymentDeadlineContext): {
    action: 'none' | 'warning' | 'refund' | 'cancel'
    message: string
    urgency: 'low' | 'medium' | 'high' | 'critical'
  } {
    const deadlineCheck = this.checkDeadlineStatus(context)
    const timeRemaining = deadlineCheck.timeRemaining || 0
    const minutesRemaining = Math.floor(timeRemaining / (1000 * 60))

    // Both paid - success
    if (context.bothPaid) {
      return {
        action: 'none',
        message: 'Payment completed successfully',
        urgency: 'low'
      }
    }

    // Not expired - check for warnings
    if (!deadlineCheck.isExpired) {
      if (minutesRemaining <= 5) {
        return {
          action: 'warning',
          message: `⚠️ Payment deadline in ${minutesRemaining} minutes`,
          urgency: 'critical'
        }
      }
      if (minutesRemaining <= 15) {
        return {
          action: 'warning',
          message: `Payment deadline in ${minutesRemaining} minutes`,
          urgency: 'high'
        }
      }
      return {
        action: 'none',
        message: `Payment deadline in ${minutesRemaining} minutes`,
        urgency: 'medium'
      }
    }

    // Expired - determine action
    if (deadlineCheck.shouldRefund) {
      return {
        action: 'refund',
        message: 'Payment deadline expired. Processing refund...',
        urgency: 'critical'
      }
    }

    return {
      action: 'cancel',
      message: 'Payment deadline expired. Trade cancelled.',
      urgency: 'high'
    }
  }

  /**
   * Format time remaining for display
   */
  static formatTimeRemaining(timeRemaining: number): string {
    if (timeRemaining <= 0) return 'Expired'

    const minutes = Math.floor(timeRemaining / (1000 * 60))
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000)

    if (minutes > 0) {
      return `${minutes}m ${seconds}s`
    }
    return `${seconds}s`
  }

  /**
   * Calculate payment deadline urgency level
   */
  static getUrgencyLevel(timeRemaining: number): 'low' | 'medium' | 'high' | 'critical' {
    const minutes = timeRemaining / (1000 * 60)

    if (minutes <= 0) return 'critical'
    if (minutes <= 5) return 'critical'
    if (minutes <= 15) return 'high'
    if (minutes <= 20) return 'medium'
    return 'low'
  }

  /**
   * Get progress percentage for payment deadline
   */
  static getDeadlineProgress(context: PaymentDeadlineContext): number {
    const totalTime = this.PAYMENT_DEADLINE_MINUTES * 60 * 1000 // 30 minutes in ms
    const deadlineCheck = this.checkDeadlineStatus(context)
    const timeRemaining = deadlineCheck.timeRemaining || 0

    if (context.bothPaid) return 100
    if (timeRemaining <= 0) return 0

    const progress = ((totalTime - timeRemaining) / totalTime) * 100
    return Math.min(100, Math.max(0, progress))
  }

  /**
   * Determine notification strategy for deadline
   */
  static getNotificationStrategy(timeRemaining: number): {
    shouldNotify: boolean
    channels: ('websocket' | 'email' | 'push')[]
    priority: 'low' | 'normal' | 'high'
  } {
    const minutes = timeRemaining / (1000 * 60)

    // Critical - all channels, high priority
    if (minutes <= 5) {
      return {
        shouldNotify: true,
        channels: ['websocket', 'email', 'push'],
        priority: 'high'
      }
    }

    // Important milestones - websocket + email
    if (minutes <= 15 || minutes <= 10) {
      return {
        shouldNotify: true,
        channels: ['websocket', 'email'],
        priority: 'normal'
      }
    }

    // Regular updates - websocket only
    return {
      shouldNotify: true,
      channels: ['websocket'],
      priority: 'low'
    }
  }

  /**
   * Create payment reminder messages
   */
  static createReminderMessage(
    context: PaymentDeadlineContext,
    userRole: 'creator' | 'participant'
  ): string {
    const deadlineCheck = this.checkDeadlineStatus(context)
    const timeRemaining = this.formatTimeRemaining(deadlineCheck.timeRemaining || 0)

    const userPaid = userRole === 'creator' ? context.creatorPaid : context.participantPaid
    const otherUserPaid = userRole === 'creator' ? context.participantPaid : context.creatorPaid

    if (userPaid && !otherUserPaid) {
      return `You've paid! Waiting for the other user. Time remaining: ${timeRemaining}`
    }

    if (!userPaid && otherUserPaid) {
      return `⚠️ The other user has paid. Complete your payment! Time remaining: ${timeRemaining}`
    }

    if (!userPaid && !otherUserPaid) {
      return `⚠️ Payment required from both users. Time remaining: ${timeRemaining}`
    }

    return `Payment completed! ✅`
  }

  /**
   * Validate payment amount against trade price
   */
  static validatePaymentAmount(
    paymentAmount: number,
    tradePrice: number,
    tolerance: number = 0.01
  ): { isValid: boolean; reason?: string } {
    const difference = Math.abs(paymentAmount - tradePrice)

    if (difference > tolerance) {
      return {
        isValid: false,
        reason: `Payment amount ($${paymentAmount}) doesn't match trade price ($${tradePrice})`
      }
    }

    return { isValid: true }
  }

  /**
   * Calculate refund amount based on payment status
   */
  static calculateRefundAmount(context: PaymentDeadlineContext, tradePrice: number): {
    creatorRefund: number
    participantRefund: number
    totalRefund: number
  } {
    const creatorRefund = context.creatorPaid ? tradePrice : 0
    const participantRefund = context.participantPaid ? tradePrice : 0

    return {
      creatorRefund,
      participantRefund,
      totalRefund: creatorRefund + participantRefund
    }
  }
}

// Type exports
export type PaymentEnforcementAction = {
  action: 'none' | 'warning' | 'refund' | 'cancel'
  message: string
  urgency: 'low' | 'medium' | 'high' | 'critical'
}

export type NotificationStrategy = {
  shouldNotify: boolean
  channels: ('websocket' | 'email' | 'push')[]
  priority: 'low' | 'normal' | 'high'
}