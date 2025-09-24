import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from '@/lib/auth-client'

export interface SocketUser {
  id: string
  role: 'user' | 'middleman'
  robloxId?: string
  middlemanId?: string
}

export interface NotificationData {
  type: 'trade_joined' | 'new_message' | 'payment_received' | 'trade_completed' | 'trade_cancelled' | 'payment_expired'
  title: string
  message: string
  tradeId?: string
  userId?: string
  timestamp: string
  metadata?: Record<string, any>
}

export interface UseSocketReturn {
  socket: Socket | null
  isConnected: boolean
  joinTrade: (tradeId: string) => void
  leaveTrade: (tradeId: string) => void
  sendTypingStart: (tradeId: string) => void
  sendTypingStop: (tradeId: string) => void
  error: string | null
}

export function useSocket(): UseSocketReturn {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { data: session } = useAuth()
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (!session?.user) {
      return
    }

    const initializeSocket = () => {
      const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || window.location.origin, {
        auth: {
          // For regular users, we rely on session cookies
          // For middleman, we would need to pass the JWT token
        },
        transports: ['websocket', 'polling'],
        timeout: 10000,
        retries: 3
      })

      // Connection events
      newSocket.on('connect', () => {
        console.log('Socket connected:', newSocket.id)
        setIsConnected(true)
        setError(null)

        // Clear any existing reconnect timeout
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current)
          reconnectTimeoutRef.current = undefined
        }
      })

      newSocket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason)
        setIsConnected(false)

        // Only show error for unexpected disconnections
        if (reason === 'io server disconnect' || reason === 'transport close') {
          setError('Connection lost. Attempting to reconnect...')
        }
      })

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error)
        setError('Failed to connect to real-time services')
        setIsConnected(false)

        // Schedule reconnect attempt
        if (!reconnectTimeoutRef.current) {
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log('Attempting to reconnect...')
            newSocket.connect()
            reconnectTimeoutRef.current = undefined
          }, 5000)
        }
      })

      // Authentication error
      newSocket.on('error', (error: string) => {
        console.error('Socket error:', error)
        setError(error)
      })

      // Trade-specific events
      newSocket.on('trade-joined', (data: { tradeId: string }) => {
        console.log('Successfully joined trade room:', data.tradeId)
      })

      newSocket.on('trade-left', (data: { tradeId: string }) => {
        console.log('Left trade room:', data.tradeId)
      })

      setSocket(newSocket)

      return newSocket
    }

    const socketInstance = initializeSocket()

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      socketInstance.disconnect()
      setSocket(null)
      setIsConnected(false)
      setError(null)
    }
  }, [session?.user])

  const joinTrade = (tradeId: string) => {
    if (socket && isConnected) {
      socket.emit('join-trade', tradeId)
    }
  }

  const leaveTrade = (tradeId: string) => {
    if (socket && isConnected) {
      socket.emit('leave-trade', tradeId)
    }
  }

  const sendTypingStart = (tradeId: string) => {
    if (socket && isConnected) {
      socket.emit('typing-start', { tradeId })
    }
  }

  const sendTypingStop = (tradeId: string) => {
    if (socket && isConnected) {
      socket.emit('typing-stop', { tradeId })
    }
  }

  return {
    socket,
    isConnected,
    joinTrade,
    leaveTrade,
    sendTypingStart,
    sendTypingStop,
    error
  }
}

// Hook for listening to notifications
export function useSocketNotifications() {
  const { socket, isConnected } = useSocket()
  const [notifications, setNotifications] = useState<NotificationData[]>([])

  useEffect(() => {
    if (!socket || !isConnected) return

    const handleNotification = (notification: NotificationData) => {
      setNotifications(prev => [notification, ...prev].slice(0, 50)) // Keep last 50 notifications
    }

    const handleAnnouncement = (announcement: NotificationData) => {
      setNotifications(prev => [announcement, ...prev].slice(0, 50))
    }

    socket.on('notification', handleNotification)
    socket.on('announcement', handleAnnouncement)

    return () => {
      socket.off('notification', handleNotification)
      socket.off('announcement', handleAnnouncement)
    }
  }, [socket, isConnected])

  const clearNotification = (index: number) => {
    setNotifications(prev => prev.filter((_, i) => i !== index))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  return {
    notifications,
    clearNotification,
    clearAllNotifications,
    unreadCount: notifications.length
  }
}

// Hook for trade-specific real-time events
export function useTradeSocket(tradeId: string | null) {
  const { socket, isConnected, joinTrade, leaveTrade } = useSocket()
  const [messages, setMessages] = useState<any[]>([])
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const [tradeStatus, setTradeStatus] = useState<string | null>(null)

  // Join/leave trade room when tradeId changes
  useEffect(() => {
    if (!tradeId || !isConnected) return

    joinTrade(tradeId)

    return () => {
      leaveTrade(tradeId)
    }
  }, [tradeId, isConnected, joinTrade, leaveTrade])

  // Listen for trade events
  useEffect(() => {
    if (!socket || !isConnected || !tradeId) return

    const handleNewMessage = (message: any) => {
      if (message.tradeId === tradeId) {
        setMessages(prev => [...prev, message])
      }
    }

    const handleUserTyping = (data: { userId: string, tradeId: string }) => {
      if (data.tradeId === tradeId) {
        setTypingUsers(prev => [...prev.filter(id => id !== data.userId), data.userId])
      }
    }

    const handleUserStoppedTyping = (data: { userId: string, tradeId: string }) => {
      if (data.tradeId === tradeId) {
        setTypingUsers(prev => prev.filter(id => id !== data.userId))
      }
    }

    const handleTradeStatusUpdate = (data: { tradeId: string, status: string }) => {
      if (data.tradeId === tradeId) {
        setTradeStatus(data.status)
      }
    }

    const handleTradeParticipantJoined = (data: { tradeId: string, userId: string, username: string }) => {
      if (data.tradeId === tradeId) {
        // Could add a system message or update participant list
        console.log(`${data.username} joined the trade`)
      }
    }

    socket.on('new-message', handleNewMessage)
    socket.on('user-typing', handleUserTyping)
    socket.on('user-stopped-typing', handleUserStoppedTyping)
    socket.on('trade-status-updated', handleTradeStatusUpdate)
    socket.on('trade-participant-joined', handleTradeParticipantJoined)

    return () => {
      socket.off('new-message', handleNewMessage)
      socket.off('user-typing', handleUserTyping)
      socket.off('user-stopped-typing', handleUserStoppedTyping)
      socket.off('trade-status-updated', handleTradeStatusUpdate)
      socket.off('trade-participant-joined', handleTradeParticipantJoined)
    }
  }, [socket, isConnected, tradeId])

  return {
    messages,
    typingUsers,
    tradeStatus,
    isConnected
  }
}