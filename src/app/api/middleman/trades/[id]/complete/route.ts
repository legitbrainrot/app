import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { authenticateMiddleman } from '@/lib/middleware'
import { notificationService } from '@/lib/notifications'

const prisma = new PrismaClient()

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await authenticateMiddleman(request)
    if (!authResult.success) {
      return authResult.response
    }

    const trade = await prisma.trade.findUnique({
      where: { id: params.id },
      include: {
        participants: true,
        payments: true
      }
    })

    if (!trade) {
      return NextResponse.json(
        { error: 'Trade not found' },
        { status: 404 }
      )
    }

    // Trade should be in a state that allows completion
    if (!['ACTIVE', 'PAYMENT_PENDING', 'UNDER_REVIEW'].includes(trade.status)) {
      return NextResponse.json(
        { error: 'Trade cannot be completed in current status' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { approved, notes } = body

    // Validation
    if (typeof approved !== 'boolean') {
      return NextResponse.json(
        { error: 'approved field is required and must be a boolean' },
        { status: 400 }
      )
    }

    if (notes && (typeof notes !== 'string' || notes.length > 1000)) {
      return NextResponse.json(
        { error: 'notes must be a string and cannot exceed 1000 characters' },
        { status: 400 }
      )
    }

    // Update trade status based on approval
    const newStatus = approved ? 'COMPLETED' : 'CANCELLED'
    const completedAt = new Date()

    const updatedTrade = await prisma.trade.update({
      where: { id: params.id },
      data: {
        status: newStatus,
        completedAt,
        middlemanNotes: notes?.trim() || null,
        middlemanId: authResult.middleman?.id
      }
    })

    // If approved, update any pending payments to completed
    if (approved) {
      await prisma.payment.updateMany({
        where: {
          tradeId: params.id,
          status: {
            in: ['PENDING', 'PROCESSING']
          }
        },
        data: {
          status: 'COMPLETED'
        }
      })
    } else {
      // If rejected, update payments to failed/refunded
      await prisma.payment.updateMany({
        where: {
          tradeId: params.id,
          status: {
            in: ['PENDING', 'PROCESSING']
          }
        },
        data: {
          status: 'FAILED'
        }
      })
    }

    // Send real-time notifications
    await notificationService.notifyTradeCompleted(
      params.id,
      approved,
      notes?.trim()
    )

    return NextResponse.json({
      message: `Trade ${approved ? 'approved' : 'rejected'} successfully`,
      tradeId: params.id,
      status: newStatus,
      completedAt,
      notes: notes?.trim() || null
    })
  } catch (error) {
    console.error('Error completing trade:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}