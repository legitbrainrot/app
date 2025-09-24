import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { auth } from './auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Types for different user roles
export interface AuthenticatedUser {
  id: string
  role: 'user' | 'middleman'
  robloxId?: string
  middlemanId?: string
}

export interface AuthenticatedMiddleman {
  id: string
  userId: string
  name: string
}

export interface AuthResult {
  success: boolean
  user?: AuthenticatedUser
  middleman?: AuthenticatedMiddleman
  response: NextResponse
}

// Middleware to verify user authentication (Better Auth)
export async function requireAuth(request: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    })

    if (!session?.user) {
      return null
    }

    return {
      id: session.user.id,
      role: 'user',
      robloxId: session.user.id
    }
  } catch (error) {
    console.error('Auth verification failed:', error)
    return null
  }
}

// Middleware to verify middleman authentication (JWT)
export async function requireMiddlemanAuth(request: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as any

    if (decoded.role !== 'middleman') {
      return null
    }

    return {
      id: decoded.userId,
      role: 'middleman',
      middlemanId: decoded.middlemanId
    }
  } catch (error) {
    console.error('Middleman auth verification failed:', error)
    return null
  }
}

// Combined authentication middleware that checks both user types
export async function requireAnyAuth(request: NextRequest): Promise<AuthenticatedUser | null> {
  // Try user auth first
  const userAuth = await requireAuth(request)
  if (userAuth) {
    return userAuth
  }

  // Try middleman auth
  const middlemanAuth = await requireMiddlemanAuth(request)
  if (middlemanAuth) {
    return middlemanAuth
  }

  return null
}

// Helper function to create unauthorized response
export function createUnauthorizedResponse(message = 'Unauthorized') {
  return NextResponse.json(
    { error: message },
    { status: 401 }
  )
}

// Helper function to create forbidden response
export function createForbiddenResponse(message = 'Forbidden') {
  return NextResponse.json(
    { error: message },
    { status: 403 }
  )
}

// New authentication helper for user endpoints
export async function authenticateUser(request: NextRequest): Promise<AuthResult> {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    })

    if (!session?.user) {
      return {
        success: false,
        response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    const user: AuthenticatedUser = {
      id: session.user.id,
      role: 'user',
      robloxId: session.user.id
    }

    return {
      success: true,
      user,
      response: NextResponse.json({ success: true })
    }
  } catch (error) {
    console.error('User auth verification failed:', error)
    return {
      success: false,
      response: NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
    }
  }
}

// New authentication helper for middleman endpoints
export async function authenticateMiddleman(request: NextRequest): Promise<AuthResult> {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        success: false,
        response: NextResponse.json({ error: 'Missing or invalid authorization header' }, { status: 401 })
      }
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any

    if (decoded.role !== 'middleman') {
      return {
        success: false,
        response: NextResponse.json({ error: 'Invalid token type' }, { status: 403 })
      }
    }

    // Fetch middleman details from database
    const middleman = await prisma.middleman.findUnique({
      where: { id: decoded.middlemanId }
    })

    if (!middleman) {
      return {
        success: false,
        response: NextResponse.json({ error: 'Middleman not found' }, { status: 401 })
      }
    }

    const authenticatedMiddleman: AuthenticatedMiddleman = {
      id: middleman.id,
      userId: middleman.userId,
      name: middleman.name
    }

    return {
      success: true,
      middleman: authenticatedMiddleman,
      response: NextResponse.json({ success: true })
    }
  } catch (error) {
    console.error('Middleman auth verification failed:', error)
    return {
      success: false,
      response: NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
    }
  }
}