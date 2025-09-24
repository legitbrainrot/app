import { getSocketManager } from './socket'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface NotificationData {
  type: 'trade_joined' | 'new_message' | 'payment_received' | 'trade_completed' | 'trade_cancelled' | 'payment_expired'
  title: string
  message: string
  tradeId?: string
  userId?: string
  timestamp: string
  metadata?: Record<string, any>
}

export class NotificationService {
  private static instance: NotificationService

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  // Notify when someone joins a trade
  async notifyTradeJoined(tradeId: string, joinedUserId: string, joinedUsername: string) {
    try {
      const trade = await prisma.trade.findUnique({
        where: { id: tradeId },
        include: { creator: true }
      })

      if (!trade) return

      const socketManager = getSocketManager()
      if (!socketManager) return

      const notification: NotificationData = {
        type: 'trade_joined',
        title: 'New Trade Participant',
        message: `${joinedUsername} has joined your trade for "${trade.itemName}"`,
        tradeId,
        userId: joinedUserId,
        timestamp: new Date().toISOString(),
        metadata: {
          itemName: trade.itemName,
          joinedUsername
        }
      }

      // Notify the trade creator
      socketManager.emitToUser(trade.creatorId, 'notification', notification)

      // Broadcast to trade room
      socketManager.emitToTrade(tradeId, 'trade-participant-joined', {
        userId: joinedUserId,
        username: joinedUsername,
        tradeId
      })

      console.log(`Notified trade joined: ${tradeId} by ${joinedUsername}`)
    } catch (error) {
      console.error('Error notifying trade joined:', error)
    }
  }

  // Notify when a new message is sent
  async notifyNewMessage(tradeId: string, senderId: string, senderUsername: string, messageContent: string, messageId: string) {
    try {
      const trade = await prisma.trade.findUnique({
        where: { id: tradeId },
        include: {
          creator: true,
          participants: {
            include: { user: true }
          }
        }
      })

      if (!trade) return

      const socketManager = getSocketManager()
      if (!socketManager) return

      const messageData = {
        id: messageId,
        tradeId,
        userId: senderId,
        content: messageContent,
        timestamp: new Date().toISOString(),
        user: {
          id: senderId,
          username: senderUsername
        }
      }

      // Broadcast message to all trade participants
      socketManager.emitToTrade(tradeId, 'new-message', messageData)

      // Create notification for participants (except sender)
      const notification: NotificationData = {
        type: 'new_message',
        title: 'New Message',
        message: `${senderUsername}: ${messageContent.substring(0, 50)}${messageContent.length > 50 ? '...' : ''}`,
        tradeId,
        userId: senderId,
        timestamp: new Date().toISOString(),
        metadata: {
          itemName: trade.itemName,
          senderUsername,
          messagePreview: messageContent.substring(0, 100)
        }
      }

      // Notify trade creator (if not sender)
      if (trade.creatorId !== senderId) {
        socketManager.emitToUser(trade.creatorId, 'notification', notification)
      }

      // Notify participants (except sender)
      trade.participants.forEach(participant => {
        if (participant.userId !== senderId) {
          socketManager.emitToUser(participant.userId, 'notification', notification)
        }
      })

      console.log(`Notified new message in trade: ${tradeId}`)
    } catch (error) {
      console.error('Error notifying new message:', error)
    }
  }

  // Notify when payment is received
  async notifyPaymentReceived(tradeId: string, payerId: string, payerUsername: string, amount: number) {
    try {
      const trade = await prisma.trade.findUnique({
        where: { id: tradeId },
        include: { creator: true }
      })

      if (!trade) return

      const socketManager = getSocketManager()
      if (!socketManager) return

      const notification: NotificationData = {
        type: 'payment_received',
        title: 'Payment Received',
        message: `${payerUsername} has sent $${amount.toFixed(2)} for "${trade.itemName}"`,
        tradeId,
        userId: payerId,
        timestamp: new Date().toISOString(),
        metadata: {
          amount,
          itemName: trade.itemName,
          payerUsername
        }
      }

      // Notify the trade creator
      socketManager.emitToUser(trade.creatorId, 'notification', notification)

      // Broadcast to trade room
      socketManager.emitToTrade(tradeId, 'payment-received', {
        tradeId,
        payerId,
        payerUsername,
        amount
      })

      // Notify middlemen
      socketManager.emitToMiddlemen('trade-payment-received', {
        tradeId,
        itemName: trade.itemName,
        amount,
        payerUsername
      })

      console.log(`Notified payment received for trade: ${tradeId}`)
    } catch (error) {
      console.error('Error notifying payment received:', error)
    }
  }

  // Notify when trade is completed
  async notifyTradeCompleted(tradeId: string, approved: boolean, middlemanNotes?: string) {
    try {
      const trade = await prisma.trade.findUnique({
        where: { id: tradeId },
        include: {
          creator: true,
          participants: {
            include: { user: true }
          }
        }
      })

      if (!trade) return

      const socketManager = getSocketManager()
      if (!socketManager) return

      const status = approved ? 'completed' : 'cancelled'
      const title = approved ? 'Trade Completed' : 'Trade Cancelled'
      const message = approved
        ? `Your trade for "${trade.itemName}" has been completed successfully`
        : `Your trade for "${trade.itemName}" has been cancelled`

      const notification: NotificationData = {
        type: approved ? 'trade_completed' : 'trade_cancelled',
        title,
        message,
        tradeId,
        timestamp: new Date().toISOString(),
        metadata: {
          approved,
          itemName: trade.itemName,
          middlemanNotes
        }
      }

      // Notify trade creator
      socketManager.emitToUser(trade.creatorId, 'notification', notification)

      // Notify all participants
      trade.participants.forEach(participant => {
        socketManager.emitToUser(participant.userId, 'notification', notification)
      })

      // Broadcast to trade room
      socketManager.emitToTrade(tradeId, 'trade-status-updated', {
        tradeId,
        status,
        approved,
        middlemanNotes,
        completedAt: new Date().toISOString()
      })

      console.log(`Notified trade ${status}: ${tradeId}`)
    } catch (error) {
      console.error('Error notifying trade completion:', error)
    }
  }

  // Notify when payment expires
  async notifyPaymentExpired(tradeId: string, paymentId: string) {
    try {
      const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: {
          user: true,
          trade: {
            include: { creator: true }
          }
        }
      })

      if (!payment) return

      const socketManager = getSocketManager()
      if (!socketManager) return

      const notification: NotificationData = {
        type: 'payment_expired',
        title: 'Payment Expired',
        message: `Payment for "${payment.trade.itemName}" has expired`,
        tradeId,
        timestamp: new Date().toISOString(),
        metadata: {
          paymentId,
          amount: payment.amount,
          itemName: payment.trade.itemName
        }
      }

      // Notify the payer
      socketManager.emitToUser(payment.userId, 'notification', notification)

      // Notify the trade creator
      socketManager.emitToUser(payment.trade.creatorId, 'notification', notification)

      // Broadcast to trade room
      socketManager.emitToTrade(tradeId, 'payment-expired', {
        tradeId,
        paymentId,
        amount: payment.amount
      })

      console.log(`Notified payment expired: ${paymentId} for trade: ${tradeId}`)
    } catch (error) {
      console.error('Error notifying payment expired:', error)
    }
  }

  // Notify about system-wide announcements
  async broadcastAnnouncement(title: string, message: string, type: 'info' | 'warning' | 'success' | 'error' = 'info') {
    try {
      const socketManager = getSocketManager()
      if (!socketManager) return

      const notification: NotificationData = {
        type: 'trade_completed', // Reusing type for announcements
        title,
        message,
        timestamp: new Date().toISOString(),
        metadata: {
          type,
          isAnnouncement: true
        }
      }

      socketManager.emitToAll('announcement', notification)

      console.log(`Broadcasted announcement: ${title}`)
    } catch (error) {
      console.error('Error broadcasting announcement:', error)
    }
  }

  // Get active users count
  getActiveUsersCount(): number {
    const socketManager = getSocketManager()
    return socketManager?.getConnectedUsersCount() || 0
  }

  // Check if user is online
  async isUserOnline(userId: string): Promise<boolean> {
    try {
      const socketManager = getSocketManager()
      if (!socketManager) return false

      // This would require tracking user sessions, for now return false
      // In a real implementation, you'd maintain a user-to-socket mapping
      return false
    } catch (error) {
      console.error('Error checking user online status:', error)
      return false
    }
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance()