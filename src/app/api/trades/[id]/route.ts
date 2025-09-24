import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { authenticateUser } from '@/lib/middleware'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await authenticateUser(request)
    if (!authResult.success) {
      return authResult.response
    }

    const trade = await prisma.trade.findUnique({
      where: { id: params.id },
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
            status: true,
            amount: true,
            createdAt: true
          }
        },
        _count: {
          select: {
            messages: true
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

    return NextResponse.json({
      id: trade.id,
      itemName: trade.itemName,
      itemImage: trade.itemImage,
      description: trade.description,
      price: trade.price,
      status: trade.status,
      createdAt: trade.createdAt,
      updatedAt: trade.updatedAt,
      completedAt: trade.completedAt,
      creator: trade.creator,
      participants: trade.participants.map(p => p.user),
      payments: trade.payments,
      messageCount: trade._count.messages
    })
  } catch (error) {
    console.error('Error fetching trade:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await authenticateUser(request)
    if (!authResult.success || !authResult.user) {
      return authResult.response
    }

    const trade = await prisma.trade.findUnique({
      where: { id: params.id }
    })

    if (!trade) {
      return NextResponse.json(
        { error: 'Trade not found' },
        { status: 404 }
      )
    }

    // Only the creator can update their trade
    if (trade.creatorId !== authResult.user.id) {
      return NextResponse.json(
        { error: 'Forbidden: You can only update your own trades' },
        { status: 403 }
      )
    }

    // Only allow updates if trade is still ACTIVE
    if (trade.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Cannot update trade that is not active' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { itemName, itemImage, description, price } = body

    // Validation (same as POST)
    const updateData: any = {}

    if (itemName !== undefined) {
      if (!itemName || typeof itemName !== 'string' || itemName.trim().length === 0) {
        return NextResponse.json(
          { error: 'Item name cannot be empty' },
          { status: 400 }
        )
      }
      if (itemName.length > 100) {
        return NextResponse.json(
          { error: 'Item name cannot exceed 100 characters' },
          { status: 400 }
        )
      }
      updateData.itemName = itemName.trim()
    }

    if (itemImage !== undefined) {
      if (!itemImage || typeof itemImage !== 'string') {
        return NextResponse.json(
          { error: 'Item image is required' },
          { status: 400 }
        )
      }
      updateData.itemImage = itemImage
    }

    if (description !== undefined) {
      if (description && description.length > 1000) {
        return NextResponse.json(
          { error: 'Description cannot exceed 1000 characters' },
          { status: 400 }
        )
      }
      updateData.description = description?.trim() || null
    }

    if (price !== undefined) {
      if (typeof price !== 'number' || price <= 0) {
        return NextResponse.json(
          { error: 'Price must be a positive number' },
          { status: 400 }
        )
      }
      updateData.price = price
    }

    const updatedTrade = await prisma.trade.update({
      where: { id: params.id },
      data: updateData,
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

    return NextResponse.json(updatedTrade)
  } catch (error) {
    console.error('Error updating trade:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
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

    // Only the creator can delete their trade
    if (trade.creatorId !== authResult.user.id) {
      return NextResponse.json(
        { error: 'Forbidden: You can only delete your own trades' },
        { status: 403 }
      )
    }

    // Cannot delete if there are participants or payments
    if (trade.participants.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete trade with participants' },
        { status: 400 }
      )
    }

    if (trade.payments.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete trade with payments' },
        { status: 400 }
      )
    }

    await prisma.trade.delete({
      where: { id: params.id }
    })

    return NextResponse.json(
      { message: 'Trade deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting trade:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}