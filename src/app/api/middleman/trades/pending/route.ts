import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { authenticateMiddleman } from '@/lib/middleware'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateMiddleman(request)
    if (!authResult.success) {
      return authResult.response
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const status = searchParams.get('status') || 'UNDER_REVIEW'

    // Get trades that are pending middleman review
    const trades = await prisma.trade.findMany({
      where: {
        status: status as any,
        // Only trades that have payments should be in middleman queue
        payments: {
          some: {
            status: {
              in: ['COMPLETED', 'PROCESSING']
            }
          }
        }
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            avatarUrl: true
          }
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatarUrl: true
              }
            }
          }
        },
        payments: {
          select: {
            id: true,
            amount: true,
            status: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                username: true
              }
            }
          }
        },
        _count: {
          select: {
            messages: true
          }
        }
      },
      orderBy: [
        {
          // Prioritize trades with completed payments
          payments: {
            _count: 'desc'
          }
        },
        {
          createdAt: 'asc' // Oldest first for fairness
        }
      ],
      take: limit,
      skip: offset
    })

    const totalCount = await prisma.trade.count({
      where: {
        status: status as any,
        payments: {
          some: {
            status: {
              in: ['COMPLETED', 'PROCESSING']
            }
          }
        }
      }
    })

    return NextResponse.json({
      trades: trades.map(trade => ({
        id: trade.id,
        itemName: trade.itemName,
        itemImage: trade.itemImage,
        description: trade.description,
        price: trade.price,
        status: trade.status,
        createdAt: trade.createdAt,
        creator: trade.creator,
        participants: trade.participants.map(p => p.user),
        payments: trade.payments,
        messageCount: trade._count.messages,
        timeInQueue: new Date().getTime() - new Date(trade.createdAt).getTime()
      })),
      totalCount,
      hasMore: offset + limit < totalCount
    })
  } catch (error) {
    console.error('Error fetching pending trades:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}