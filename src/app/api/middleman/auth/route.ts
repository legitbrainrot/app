import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

const prisma = new PrismaClient()

const middlemanAuthSchema = z.object({
  userId: z.string(),
  password: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, password } = middlemanAuthSchema.parse(body)

    // Find middleman by userId
    const middleman = await prisma.middleman.findUnique({
      where: { userId },
      include: {
        supervisedTrades: true
      }
    })

    if (!middleman) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, middleman.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        middlemanId: middleman.id,
        userId: middleman.userId,
        role: 'middleman'
      },
      process.env.NEXTAUTH_SECRET!,
      { expiresIn: '24h' }
    )

    return NextResponse.json({
      token,
      middlemanId: middleman.id,
      isAvailable: middleman.isAvailable
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Middleman auth error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}