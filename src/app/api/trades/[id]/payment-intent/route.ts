import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { authenticateUser } from '@/lib/middleware'
import Stripe from 'stripe'

const prisma = new PrismaClient()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia'
})

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await authenticateUser(request)
    if (!authResult.success || !authResult.user) {
      return authResult.response
    }

    // Check if trade exists and user is a participant
    const trade = await prisma.trade.findUnique({
      where: { id: params.id },
      include: {
        participants: true,
        payments: {
          where: {
            userId: authResult.user.id,
            status: {
              in: ['PENDING', 'PROCESSING']
            }
          }
        }
      }
    })

    if (!trade) {
      return NextResponse.json(
        { error: 'Trade not found' },
        { status: 404 }
      )
    }

    // Check if user is a participant (not the creator)
    const isParticipant = trade.participants.some(p => p.userId === authResult.user.id)
    const isCreator = trade.creatorId === authResult.user.id

    if (isCreator) {
      return NextResponse.json(
        { error: 'Trade creators cannot create payment intents for their own trades' },
        { status: 403 }
      )
    }

    if (!isParticipant) {
      return NextResponse.json(
        { error: 'Forbidden: You must be a participant to create a payment intent' },
        { status: 403 }
      )
    }

    // Trade must be ACTIVE
    if (trade.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Trade is not available for payment' },
        { status: 400 }
      )
    }

    // Check if user already has a pending payment
    if (trade.payments.length > 0) {
      return NextResponse.json(
        { error: 'You already have a pending payment for this trade' },
        { status: 400 }
      )
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(trade.price * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        tradeId: trade.id,
        userId: authResult.user.id,
        itemName: trade.itemName
      },
      automatic_payment_methods: {
        enabled: true
      }
    })

    // Create payment record in database
    const payment = await prisma.payment.create({
      data: {
        id: paymentIntent.id,
        tradeId: trade.id,
        userId: authResult.user.id,
        amount: trade.price,
        status: 'PENDING',
        stripePaymentIntentId: paymentIntent.id,
        // Payment deadline: 30 minutes from now
        expiresAt: new Date(Date.now() + 30 * 60 * 1000)
      }
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment.id,
      amount: trade.price,
      expiresAt: payment.expiresAt
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating payment intent:', error)

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: `Payment error: ${error.message}` },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}