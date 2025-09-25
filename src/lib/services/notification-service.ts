export interface NotificationPayload {
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  priority: 'low' | 'normal' | 'high' | 'critical'
  userId: string
  tradeId?: string
  data?: Record<string, any>
}

export interface EmailTemplate {
  templateId: string
  subject: string
  variables: Record<string, string>
}

export interface NotificationResult {
  success: boolean
  messageId?: string
  error?: string
}

export interface NotificationPreferences {
  email: boolean
  websocket: boolean
  push: boolean
  sms: boolean
}

export class NotificationService {
  // Critical events that always send notifications regardless of preferences
  private static readonly CRITICAL_EVENTS = [
    'payment_deadline_critical',
    'trade_completed',
    'payment_failed',
    'security_alert'
  ]

  // Email templates for different notification types
  private static readonly EMAIL_TEMPLATES: Record<string, EmailTemplate> = {
    trade_created: {
      templateId: 'trade_created',
      subject: 'Your trade listing is now live',
      variables: {
        username: 'User\'s name',
        itemName: 'Trade item name',
        price: 'Trade price',
        tradeUrl: 'Link to trade'
      }
    },
    trade_joined: {
      templateId: 'trade_joined',
      subject: 'Someone joined your trade',
      variables: {
        username: 'Trade creator name',
        participantName: 'Participant name',
        itemName: 'Trade item name',
        tradeUrl: 'Link to trade'
      }
    },
    payment_deadline_warning: {
      templateId: 'payment_deadline_warning',
      subject: '⚠️ Payment deadline approaching',
      variables: {
        username: 'User name',
        timeRemaining: 'Time until deadline',
        itemName: 'Trade item name',
        paymentUrl: 'Payment completion link'
      }
    },
    payment_deadline_critical: {
      templateId: 'payment_deadline_critical',
      subject: '🚨 URGENT: Payment deadline in 5 minutes',
      variables: {
        username: 'User name',
        itemName: 'Trade item name',
        paymentUrl: 'Payment completion link'
      }
    },
    payment_completed: {
      templateId: 'payment_completed',
      subject: 'Payment completed - Middleman assigned',
      variables: {
        username: 'User name',
        itemName: 'Trade item name',
        middlemanName: 'Assigned middleman',
        tradeUrl: 'Link to trade'
      }
    },
    middleman_assigned: {
      templateId: 'middleman_assigned',
      subject: 'Middleman assigned to your trade',
      variables: {
        username: 'User name',
        middlemanName: 'Middleman name',
        itemName: 'Trade item name',
        tradeUrl: 'Link to trade'
      }
    },
    trade_completed: {
      templateId: 'trade_completed',
      subject: '🎉 Trade completed successfully!',
      variables: {
        username: 'User name',
        itemName: 'Trade item name',
        amount: 'Transaction amount',
        tradeUrl: 'Link to completed trade'
      }
    },
    trade_cancelled: {
      templateId: 'trade_cancelled',
      subject: 'Trade cancelled - Refund processed',
      variables: {
        username: 'User name',
        itemName: 'Trade item name',
        refundAmount: 'Refund amount',
        reason: 'Cancellation reason'
      }
    }
  }

  /**
   * Send notification through multiple channels
   */
  static async sendNotification(
    payload: NotificationPayload,
    preferences: NotificationPreferences,
    userEmail?: string
  ): Promise<{
    websocket: NotificationResult
    email: NotificationResult
    push: NotificationResult
  }> {
    const results = {
      websocket: { success: false },
      email: { success: false },
      push: { success: false }
    }

    // Always send critical notifications
    const isCritical = payload.priority === 'critical' ||
                       this.CRITICAL_EVENTS.some(event => payload.type.includes(event))

    // WebSocket notification (real-time)
    if (preferences.websocket || isCritical) {
      results.websocket = await this.sendWebSocketNotification(payload)
    }

    // Email notification
    if ((preferences.email || isCritical) && userEmail) {
      results.email = await this.sendEmailNotification(payload, userEmail)
    }

    // Push notification (if supported)
    if (preferences.push && payload.priority !== 'low') {
      results.push = await this.sendPushNotification(payload)
    }

    return results
  }

  /**
   * Send WebSocket notification for real-time updates
   */
  private static async sendWebSocketNotification(
    payload: NotificationPayload
  ): Promise<NotificationResult> {
    try {
      // In production, this would use Socket.io to emit to specific user
      // For now, simulate WebSocket notification

      const websocketMessage = {
        id: `notif_${Date.now()}`,
        timestamp: new Date().toISOString(),
        ...payload
      }

      // Simulate WebSocket emit
      // io.to(`user_${payload.userId}`).emit('notification', websocketMessage)

      return {
        success: true,
        messageId: websocketMessage.id
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Send email notification
   */
  private static async sendEmailNotification(
    payload: NotificationPayload,
    userEmail: string
  ): Promise<NotificationResult> {
    try {
      // In production, this would integrate with email service (SendGrid, AWS SES, etc.)
      // For now, simulate email sending

      const emailData = {
        to: userEmail,
        subject: payload.title,
        html: this.generateEmailHtml(payload),
        metadata: {
          userId: payload.userId,
          tradeId: payload.tradeId,
          notificationType: payload.type
        }
      }

      // Simulate email sending
      const messageId = `email_${Date.now()}`

      return {
        success: true,
        messageId
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Send push notification
   */
  private static async sendPushNotification(
    payload: NotificationPayload
  ): Promise<NotificationResult> {
    try {
      // In production, this would integrate with push service (FCM, APNs, etc.)
      // For now, simulate push notification

      const pushData = {
        title: payload.title,
        body: payload.message,
        icon: '/icons/notification.png',
        badge: '/icons/badge.png',
        data: {
          userId: payload.userId,
          tradeId: payload.tradeId,
          type: payload.type,
          url: payload.tradeId ? `/trades/${payload.tradeId}` : '/dashboard'
        }
      }

      const messageId = `push_${Date.now()}`

      return {
        success: true,
        messageId
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Generate HTML email content
   */
  private static generateEmailHtml(payload: NotificationPayload): string {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://localhost:3000'
    const tradeUrl = payload.tradeId ? `${baseUrl}/trades/${payload.tradeId}` : `${baseUrl}/dashboard`

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${payload.title}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f8fafc; }
            .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .priority-${payload.priority} { border-left: 4px solid ${this.getPriorityColor(payload.priority)}; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Roblox Trading Platform</h1>
            </div>
            <div class="content priority-${payload.priority}">
              <h2>${payload.title}</h2>
              <p>${payload.message}</p>
              ${payload.tradeId ? `<p><a href="${tradeUrl}" class="button">View Trade</a></p>` : ''}
            </div>
            <div class="footer">
              <p>This is an automated message from Roblox Trading Platform.</p>
              <p>If you have questions, please contact our support team.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }

  /**
   * Get color for priority level
   */
  private static getPriorityColor(priority: string): string {
    const colors = {
      low: '#10b981',
      normal: '#3b82f6',
      high: '#f59e0b',
      critical: '#ef4444'
    }
    return colors[priority as keyof typeof colors] || colors.normal
  }

  /**
   * Create trade-specific notifications
   */
  static async notifyTradeUpdate(
    tradeId: string,
    eventType: 'created' | 'joined' | 'payment_deadline' | 'completed' | 'cancelled',
    participants: Array<{ userId: string; email: string; preferences: NotificationPreferences }>,
    context: Record<string, any>
  ): Promise<void> {
    const notifications = this.getTradeNotifications(eventType, tradeId, context)

    for (const participant of participants) {
      for (const notification of notifications) {
        if (this.shouldNotifyUser(notification, participant.userId, context)) {
          await this.sendNotification(
            { ...notification, userId: participant.userId, tradeId },
            participant.preferences,
            participant.email
          )
        }
      }
    }
  }

  /**
   * Get notifications for trade events
   */
  private static getTradeNotifications(
    eventType: string,
    tradeId: string,
    context: Record<string, any>
  ): NotificationPayload[] {
    const baseNotification = {
      userId: '', // Will be set when sending
      tradeId,
      data: context
    }

    switch (eventType) {
      case 'created':
        return [{
          ...baseNotification,
          title: 'Trade listing created',
          message: `Your "${context.itemName}" trade is now live and visible to other users.`,
          type: 'success' as const,
          priority: 'normal' as const
        }]

      case 'joined':
        return [{
          ...baseNotification,
          title: 'Someone joined your trade',
          message: `${context.participantName} is interested in your "${context.itemName}" trade.`,
          type: 'info' as const,
          priority: 'normal' as const
        }]

      case 'payment_deadline':
        return [{
          ...baseNotification,
          title: 'Payment deadline approaching',
          message: `Complete your payment for "${context.itemName}" within ${context.timeRemaining}.`,
          type: 'warning' as const,
          priority: context.timeRemaining.includes('5 min') ? 'critical' as const : 'high' as const
        }]

      case 'completed':
        return [{
          ...baseNotification,
          title: 'Trade completed successfully! 🎉',
          message: `Your "${context.itemName}" trade has been completed and funds have been released.`,
          type: 'success' as const,
          priority: 'high' as const
        }]

      case 'cancelled':
        return [{
          ...baseNotification,
          title: 'Trade cancelled',
          message: `Your "${context.itemName}" trade was cancelled. ${context.refundAmount ? `Refund of $${context.refundAmount} processed.` : ''}`,
          type: 'info' as const,
          priority: 'normal' as const
        }]

      default:
        return []
    }
  }

  /**
   * Determine if user should receive specific notification
   */
  private static shouldNotifyUser(
    notification: NotificationPayload,
    userId: string,
    context: Record<string, any>
  ): boolean {
    // Always notify critical events
    if (notification.priority === 'critical') return true

    // Don't notify users about their own actions (except confirmations)
    if (context.actionUserId === userId && notification.type !== 'success') {
      return false
    }

    return true
  }

  /**
   * Send batch notifications for system events
   */
  static async sendBatchNotifications(
    notifications: NotificationPayload[],
    userPreferences: Record<string, { email: string; preferences: NotificationPreferences }>
  ): Promise<{
    sent: number
    failed: number
    results: Array<{ userId: string; success: boolean; error?: string }>
  }> {
    const results = []
    let sent = 0
    let failed = 0

    for (const notification of notifications) {
      const user = userPreferences[notification.userId]
      if (!user) {
        failed++
        results.push({ userId: notification.userId, success: false, error: 'User not found' })
        continue
      }

      try {
        await this.sendNotification(notification, user.preferences, user.email)
        sent++
        results.push({ userId: notification.userId, success: true })
      } catch (error: any) {
        failed++
        results.push({ userId: notification.userId, success: false, error: error.message })
      }
    }

    return { sent, failed, results }
  }

  /**
   * Get user notification history
   */
  static async getNotificationHistory(
    userId: string,
    limit: number = 50
  ): Promise<Array<NotificationPayload & { id: string; sentAt: Date; read: boolean }>> {
    // In production, this would query the database
    // For now, return mock data
    return [
      {
        id: 'notif_001',
        title: 'Trade completed',
        message: 'Your Brainrot Item trade was completed successfully',
        type: 'success',
        priority: 'high',
        userId,
        tradeId: 'trade_001',
        sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: false
      }
    ]
  }

  /**
   * Mark notifications as read
   */
  static async markAsRead(notificationIds: string[]): Promise<{ updated: number }> {
    // In production, this would update the database
    return { updated: notificationIds.length }
  }
}

// Type exports
export type NotificationType = 'info' | 'success' | 'warning' | 'error'
export type NotificationPriority = 'low' | 'normal' | 'high' | 'critical'
export type TradeEventType = 'created' | 'joined' | 'payment_deadline' | 'completed' | 'cancelled'