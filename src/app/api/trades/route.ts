import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { authenticateUser } from '@/lib/middleware'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateUser(request)
    if (!authResult.success) {
      return authResult.response
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'ACTIVE'
    const minPrice = searchParams.get('min_price')
    const maxPrice = searchParams.get('max_price')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: any = {
      status: status as any
    }

    if (search) {
      where.OR = [
        { itemName: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    const trades = await prisma.trade.findMany({
      where,
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            avatarUrl: true
          }
        },
        participants: {
          select: {
            userId: true
          }
        },
        _count: {
          select: {
            participants: true,
            messages: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    })

    const totalCount = await prisma.trade.count({ where })

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
        participantCount: trade._count.participants,
        messageCount: trade._count.messages
      })),
      totalCount,
      hasMore: offset + limit < totalCount
    })
  } catch (error) {
    console.error('Error fetching trades:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await authenticateUser(request)
    if (!authResult.success || !authResult.user) {
      return authResult.response
    }

    const body = await request.json()
    const { itemName, itemImage, description, price } = body

    // Validation
    if (!itemName || typeof itemName !== 'string' || itemName.trim().length === 0) {
      return NextResponse.json(
        { error: 'Item name is required and cannot be empty' },
        { status: 400 }
      )
    }

    if (!itemImage || typeof itemImage !== 'string') {
      return NextResponse.json(
        { error: 'Item image is required' },
        { status: 400 }
      )
    }

    if (typeof price !== 'number' || price <= 0) {
      return NextResponse.json(
        { error: 'Price must be a positive number' },
        { status: 400 }
      )
    }

    if (itemName.length > 100) {
      return NextResponse.json(
        { error: 'Item name cannot exceed 100 characters' },
        { status: 400 }
      )
    }

    if (description && description.length > 1000) {
      return NextResponse.json(
        { error: 'Description cannot exceed 1000 characters' },
        { status: 400 }
      )
    }

    const trade = await prisma.trade.create({
      data: {
        itemName: itemName.trim(),
        itemImage,
        description: description?.trim() || null,
        price,
        status: 'ACTIVE',
        creatorId: authResult.user.id
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            avatarUrl: true
          }
        }
      }
    })

    return NextResponse.json(trade, { status: 201 })
  } catch (error) {
    console.error('Error creating trade:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}