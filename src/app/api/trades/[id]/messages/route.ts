import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { authenticateUser } from '@/lib/middleware'
import { notificationService } from '@/lib/notifications'

const prisma = new PrismaClient()

export async function GET(
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
        participants: true
      }
    })

    if (!trade) {
      return NextResponse.json(
        { error: 'Trade not found' },
        { status: 404 }
      )
    }

    // Check if user is the creator or a participant
    const isCreator = trade.creatorId === authResult.user.id
    const isParticipant = trade.participants.some(p => p.userId === authResult.user.id)

    if (!isCreator && !isParticipant) {
      return NextResponse.json(
        { error: 'Forbidden: You are not a participant in this trade' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const before = searchParams.get('before')

    const where: any = {
      tradeId: params.id
    }

    if (before) {
      where.timestamp = {
        lt: new Date(before)
      }
    }

    const messages = await prisma.chatMessage.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true
          }
        }
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: limit
    })

    // Reverse to get chronological order
    const chronologicalMessages = messages.reverse()

    return NextResponse.json({
      messages: chronologicalMessages.map(message => ({
        id: message.id,
        tradeId: message.tradeId,
        userId: message.userId,
        content: message.content,
        timestamp: message.timestamp,
        user: message.user
      }))
    })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

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
        participants: true
      }
    })

    if (!trade) {
      return NextResponse.json(
        { error: 'Trade not found' },
        { status: 404 }
      )
    }

    // Check if user is the creator or a participant
    const isCreator = trade.creatorId === authResult.user.id
    const isParticipant = trade.participants.some(p => p.userId === authResult.user.id)

    if (!isCreator && !isParticipant) {
      return NextResponse.json(
        { error: 'Forbidden: You are not a participant in this trade' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { content } = body

    // Validation
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message content is required and cannot be empty' },
        { status: 400 }
      )
    }

    if (content.length > 500) {
      return NextResponse.json(
        { error: 'Message content cannot exceed 500 characters' },
        { status: 400 }
      )
    }

    const message = await prisma.chatMessage.create({
      data: {
        tradeId: params.id,
        userId: authResult.user.id,
        content: content.trim()
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true
          }
        }
      }
    })

    // Send real-time notification
    await notificationService.notifyNewMessage(
      params.id,
      authResult.user.id,
      message.user.username || 'User',
      message.content,
      message.id
    )

    return NextResponse.json({
      id: message.id,
      tradeId: message.tradeId,
      userId: message.userId,
      content: message.content,
      timestamp: message.timestamp,
      user: message.user
    }, { status: 201 })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}