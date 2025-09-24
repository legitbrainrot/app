import { Server as SocketIOServer } from 'socket.io'
import { Server as HTTPServer } from 'http'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { auth } from './auth'

const prisma = new PrismaClient()

export interface SocketUser {
  id: string
  role: 'user' | 'middleman'
  robloxId?: string
  middlemanId?: string
}

export interface AuthenticatedSocket {
  id: string
  user: SocketUser
  join: (room: string) => void
  leave: (room: string) => void
  emit: (event: string, data: any) => void
  to: (room: string) => any
}

export class SocketManager {
  private io: SocketIOServer
  private connectedUsers = new Map<string, SocketUser>()

  constructor(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.NODE_ENV === 'production'
          ? [process.env.NEXT_PUBLIC_APP_URL!]
          : ['http://localhost:3000', 'http://127.0.0.1:3000'],
        credentials: true
      },
      transports: ['websocket', 'polling']
    })

    this.setupMiddleware()
    this.setupEventHandlers()
  }

  private setupMiddleware() {
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token
        const sessionCookie = socket.handshake.headers.cookie

        let user: SocketUser | null = null

        // Try to authenticate as regular user first (Better Auth)
        if (sessionCookie) {
          try {
            // Extract session from cookie - this is a simplified approach
            // In production, you'd want to properly parse the session cookie
            const mockRequest = {
              headers: {
                cookie: sessionCookie
              }
            } as any

            const session = await auth.api.getSession({
              headers: mockRequest.headers
            })

            if (session?.user) {
              user = {
                id: session.user.id,
                role: 'user',
                robloxId: session.user.id
              }
            }
          } catch (error) {
            console.log('User session authentication failed, trying middleman token')
          }
        }

        // If user auth failed, try middleman JWT
        if (!user && token) {
          try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any

            if (decoded.role === 'middleman') {
              const middleman = await prisma.middleman.findUnique({
                where: { id: decoded.middlemanId }
              })

              if (middleman) {
                user = {
                  id: middleman.id,
                  role: 'middleman',
                  middlemanId: middleman.id
                }
              }
            }
          } catch (error) {
            console.log('Middleman token authentication failed')
          }
        }

        if (!user) {
          return next(new Error('Authentication failed'))
        }

        ;(socket as any).user = user
        this.connectedUsers.set(socket.id, user)

        next()
      } catch (error) {
        console.error('Socket authentication error:', error)
        next(new Error('Authentication failed'))
      }
    })
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      const user = (socket as any).user as SocketUser
      console.log(`User connected: ${user.id} (${user.role})`)

      // Join user to their personal room
      socket.join(`user:${user.id}`)

      // If middleman, join middleman room
      if (user.role === 'middleman') {
        socket.join('middleman')
      }

      // Handle trade room joining
      socket.on('join-trade', async (tradeId: string) => {
        try {
          const canJoinTrade = await this.canUserJoinTrade(user, tradeId)
          if (canJoinTrade) {
            socket.join(`trade:${tradeId}`)
            socket.emit('trade-joined', { tradeId })
            console.log(`User ${user.id} joined trade room: ${tradeId}`)
          } else {
            socket.emit('error', { message: 'Cannot join this trade room' })
          }
        } catch (error) {
          console.error('Error joining trade room:', error)
          socket.emit('error', { message: 'Failed to join trade room' })
        }
      })

      // Handle leaving trade room
      socket.on('leave-trade', (tradeId: string) => {
        socket.leave(`trade:${tradeId}`)
        socket.emit('trade-left', { tradeId })
        console.log(`User ${user.id} left trade room: ${tradeId}`)
      })

      // Handle typing indicators
      socket.on('typing-start', (data: { tradeId: string }) => {
        socket.to(`trade:${data.tradeId}`).emit('user-typing', {
          userId: user.id,
          tradeId: data.tradeId
        })
      })

      socket.on('typing-stop', (data: { tradeId: string }) => {
        socket.to(`trade:${data.tradeId}`).emit('user-stopped-typing', {
          userId: user.id,
          tradeId: data.tradeId
        })
      })

      // Handle disconnect
      socket.on('disconnect', () => {
        this.connectedUsers.delete(socket.id)
        console.log(`User disconnected: ${user.id}`)
      })
    })
  }

  private async canUserJoinTrade(user: SocketUser, tradeId: string): Promise<boolean> {
    try {
      // Middlemen can join any trade room
      if (user.role === 'middleman') {
        return true
      }

      // Check if user is creator or participant
      const trade = await prisma.trade.findUnique({
        where: { id: tradeId },
        include: { participants: true }
      })

      if (!trade) {
        return false
      }

      // Check if user is creator
      if (trade.creatorId === user.id) {
        return true
      }

      // Check if user is participant
      const isParticipant = trade.participants.some(p => p.userId === user.id)
      return isParticipant
    } catch (error) {
      console.error('Error checking trade access:', error)
      return false
    }
  }

  // Public methods for emitting events
  public emitToTrade(tradeId: string, event: string, data: any) {
    this.io.to(`trade:${tradeId}`).emit(event, data)
  }

  public emitToUser(userId: string, event: string, data: any) {
    this.io.to(`user:${userId}`).emit(event, data)
  }

  public emitToMiddlemen(event: string, data: any) {
    this.io.to('middleman').emit(event, data)
  }

  public emitToAll(event: string, data: any) {
    this.io.emit(event, data)
  }

  // Get connected users count
  public getConnectedUsersCount(): number {
    return this.connectedUsers.size
  }

  // Get users in a specific trade
  public async getUsersInTrade(tradeId: string): Promise<string[]> {
    try {
      const sockets = await this.io.in(`trade:${tradeId}`).fetchSockets()
      return sockets.map(socket => (socket as any).user.id)
    } catch (error) {
      console.error('Error fetching users in trade:', error)
      return []
    }
  }
}

// Singleton instance
let socketManager: SocketManager | null = null

export function initializeSocketManager(server: HTTPServer): SocketManager {
  if (!socketManager) {
    socketManager = new SocketManager(server)
  }
  return socketManager
}

export function getSocketManager(): SocketManager | null {
  return socketManager
}