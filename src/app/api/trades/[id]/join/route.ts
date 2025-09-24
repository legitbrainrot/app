import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { authenticateUser } from '@/lib/middleware'
import { notificationService } from '@/lib/notifications'

const prisma = new PrismaClient()

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await authenticateUser(request)
    if (!authResult.success || !authResult.user) {
      return authResult.response
    }

    const trade = await prisma.trade.findUnique({
      where: { id: params.id },
      include: {
        participants: true
      }
    })

    if (!trade) {
      return NextResponse.json(
        { error: 'Trade not found' },
        { status: 404 }
      )
    }

    // Cannot join your own trade
    if (trade.creatorId === authResult.user.id) {
      return NextResponse.json(
        { error: 'Cannot join your own trade' },
        { status: 400 }
      )
    }

    // Trade must be ACTIVE to join
    if (trade.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Trade is not available for joining' },
        { status: 400 }
      )
    }

    // Check if user already joined
    const existingParticipant = trade.participants.find(
      p => p.userId === authResult.user.id
    )

    if (existingParticipant) {
      return NextResponse.json(
        { error: 'You have already joined this trade' },
        { status: 400 }
      )
    }

    // Add user as participant
    await prisma.tradeParticipant.create({
      data: {
        tradeId: params.id,
        userId: authResult.user.id
      }
    })

    // Get user details for notification
    const user = await prisma.user.findUnique({
      where: { id: authResult.user.id },
      select: { username: true }
    })

    // Send real-time notification
    await notificationService.notifyTradeJoined(
      params.id,
      authResult.user.id,
      user?.username || 'User'
    )

    return NextResponse.json({
      message: 'Successfully joined the trade',
      tradeId: params.id
    })
  } catch (error) {
    console.error('Error joining trade:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}