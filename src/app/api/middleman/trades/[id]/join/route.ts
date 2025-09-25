import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { authenticateMiddleman } from '@/lib/middleware'

const prisma = new PrismaClient()

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await authenticateMiddleman(request)
    if (!authResult.success || !authResult.middleman) {
      return authResult.response
    }

    const trade = await prisma.trade.findUnique({
      where: { id: params.id },
      include: {
        middleman: true,
        payments: {
          where: {
            status: {
              in: ['COMPLETED', 'PROCESSING']
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

    // Trade must be in a state that requires middleman intervention
    if (!['UNDER_REVIEW', 'ACTIVE'].includes(trade.status)) {
      return NextResponse.json(
        { error: 'Trade is not available for middleman assignment' },
        { status: 400 }
      )
    }

    // Trade must have payments to require middleman
    if (trade.payments.length === 0) {
      return NextResponse.json(
        { error: 'Trade does not require middleman intervention (no payments)' },
        { status: 400 }
      )
    }

    // Check if trade already has a middleman assigned
    if (trade.middlemanId && trade.middlemanId !== authResult.middleman.id) {
      return NextResponse.json(
        { error: 'Trade is already assigned to another middleman' },
        { status: 409 }
      )
    }

    // Check if the middleman is already assigned
    if (trade.middlemanId === authResult.middleman.id) {
      return NextResponse.json(
        { error: 'You are already assigned to this trade' },
        { status: 400 }
      )
    }

    // Assign the middleman to the trade
    const updatedTrade = await prisma.trade.update({
      where: { id: params.id },
      data: {
        middlemanId: authResult.middleman.id,
        status: 'UNDER_REVIEW'
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true
          }
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true
              }
            }
          }
        },
        middleman: {
          select: {
            id: true,
            userId: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Successfully assigned to trade',
      tradeId: params.id,
      middleman: {
        id: authResult.middleman.id,
        userId: authResult.middleman.userId,
        name: authResult.middleman.name
      },
      assignedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error assigning middleman to trade:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}