import { addMinutes, isAfter } from 'date-fns'

export interface MiddlemanContext {
  tradeId: string
  assignedMiddlemanId?: string
  assignmentTime?: Date
  isAvailable: boolean
  workload: number
  expertise: string[]
}

export interface AssignmentResult {
  success: boolean
  middlemanId?: string
  estimatedResponseTime?: number // in minutes
  error?: string
}

export interface SupervisionContext {
  tradeId: string
  middlemanId: string
  creatorId: string
  participantId: string
  itemName: string
  price: number
  supervisionStarted: Date
}

export class MiddlemanService {
  // Maximum response time for middleman to accept assignment (15 minutes)
  private static readonly ASSIGNMENT_TIMEOUT_MINUTES = 15

  // Maximum supervision time before escalation (60 minutes)
  private static readonly SUPERVISION_TIMEOUT_MINUTES = 60

  // Maximum concurrent trades per middleman
  private static readonly MAX_CONCURRENT_TRADES = 3

  /**
   * Find and assign available middleman to trade
   */
  static async assignMiddlemanToTrade(tradeId: string): Promise<AssignmentResult> {
    try {
      // In production, this would query the database for available middlemen
      // For now, we'll simulate the assignment logic

      const availableMiddlemen = await this.getAvailableMiddlemen()

      if (availableMiddlemen.length === 0) {
        return {
          success: false,
          error: 'No middlemen currently available'
        }
      }

      // Select best middleman based on workload and availability
      const selectedMiddleman = this.selectBestMiddleman(availableMiddlemen)

      // Simulate assignment
      const assignmentResult = await this.createAssignment(tradeId, selectedMiddleman.id)

      if (assignmentResult.success) {
        return {
          success: true,
          middlemanId: selectedMiddleman.id,
          estimatedResponseTime: this.calculateResponseTime(selectedMiddleman.workload)
        }
      }

      return assignmentResult
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Get list of available middlemen
   */
  private static async getAvailableMiddlemen(): Promise<Array<{
    id: string
    isAvailable: boolean
    currentWorkload: number
    expertise: string[]
    responseTime: number
    rating: number
  }>> {
    // Simulate database query
    return [
      {
        id: 'mid_001',
        isAvailable: true,
        currentWorkload: 1,
        expertise: ['roblox', 'brainrot_items'],
        responseTime: 5, // minutes average
        rating: 4.8
      },
      {
        id: 'mid_002',
        isAvailable: true,
        currentWorkload: 2,
        expertise: ['roblox', 'high_value_items'],
        responseTime: 8,
        rating: 4.9
      },
      {
        id: 'mid_003',
        isAvailable: false,
        currentWorkload: 3,
        expertise: ['roblox', 'dispute_resolution'],
        responseTime: 10,
        rating: 4.7
      }
    ].filter(m => m.isAvailable && m.currentWorkload < this.MAX_CONCURRENT_TRADES)
  }

  /**
   * Select best middleman based on workload and expertise
   */
  private static selectBestMiddleman(middlemen: any[]): any {
    return middlemen.sort((a, b) => {
      // Prioritize by workload (lower is better)
      const workloadScore = a.currentWorkload - b.currentWorkload
      if (workloadScore !== 0) return workloadScore

      // Then by response time (lower is better)
      const responseTimeScore = a.responseTime - b.responseTime
      if (responseTimeScore !== 0) return responseTimeScore

      // Finally by rating (higher is better)
      return b.rating - a.rating
    })[0]
  }

  /**
   * Create middleman assignment
   */
  private static async createAssignment(tradeId: string, middlemanId: string): Promise<AssignmentResult> {
    try {
      // In production, this would:
      // 1. Update trade with middlemanId
      // 2. Create notification for middleman
      // 3. Set assignment timeout

      // Simulate successful assignment
      return {
        success: true,
        middlemanId
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Calculate estimated response time based on workload
   */
  private static calculateResponseTime(workload: number): number {
    const baseTime = 5 // 5 minutes base response time
    const workloadMultiplier = workload * 2 // 2 minutes per existing trade
    return baseTime + workloadMultiplier
  }

  /**
   * Check if middleman assignment has timed out
   */
  static checkAssignmentTimeout(assignmentTime: Date): {
    isTimedOut: boolean
    timeRemaining?: number
    shouldReassign: boolean
  } {
    const now = new Date()
    const timeout = addMinutes(assignmentTime, this.ASSIGNMENT_TIMEOUT_MINUTES)
    const isTimedOut = isAfter(now, timeout)
    const timeRemaining = timeout.getTime() - now.getTime()

    return {
      isTimedOut,
      timeRemaining: Math.max(0, timeRemaining),
      shouldReassign: isTimedOut
    }
  }

  /**
   * Accept middleman assignment
   */
  static async acceptAssignment(tradeId: string, middlemanId: string): Promise<{
    success: boolean
    supervisionContext?: SupervisionContext
    error?: string
  }> {
    try {
      // In production, this would:
      // 1. Verify assignment is valid and not timed out
      // 2. Update trade status to IN_PROGRESS
      // 3. Create supervision context
      // 4. Send notifications to all participants

      // Simulate successful acceptance
      const supervisionContext: SupervisionContext = {
        tradeId,
        middlemanId,
        creatorId: 'creator_id', // Would come from database
        participantId: 'participant_id', // Would come from database
        itemName: 'Brainrot Item', // Would come from database
        price: 25.00, // Would come from database
        supervisionStarted: new Date()
      }

      return {
        success: true,
        supervisionContext
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Decline middleman assignment and reassign
   */
  static async declineAssignment(tradeId: string, middlemanId: string, reason?: string): Promise<{
    success: boolean
    reassignmentResult?: AssignmentResult
    error?: string
  }> {
    try {
      // In production, this would:
      // 1. Remove current assignment
      // 2. Mark middleman as temporarily unavailable (if needed)
      // 3. Find new middleman
      // 4. Create new assignment

      const reassignmentResult = await this.assignMiddlemanToTrade(tradeId)

      return {
        success: true,
        reassignmentResult
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Approve trade completion
   */
  static async approveTrade(
    tradeId: string,
    middlemanId: string,
    verificationNotes?: string
  ): Promise<{
    success: boolean
    completedAt?: Date
    error?: string
  }> {
    try {
      // In production, this would:
      // 1. Verify middleman is assigned to this trade
      // 2. Update trade status to COMPLETED
      // 3. Trigger escrow release
      // 4. Send completion notifications
      // 5. Record supervision notes

      return {
        success: true,
        completedAt: new Date()
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Report issue during supervision
   */
  static async reportIssue(
    tradeId: string,
    middlemanId: string,
    issueType: 'scam_attempt' | 'item_mismatch' | 'user_unresponsive' | 'technical_issue' | 'other',
    description: string
  ): Promise<{
    success: boolean
    issueId?: string
    escalated?: boolean
    error?: string
  }> {
    try {
      // In production, this would:
      // 1. Create issue record
      // 2. Determine if escalation is needed
      // 3. Send notifications to support team
      // 4. Update trade status if necessary

      const issueId = `issue_${Date.now()}`
      const escalated = issueType === 'scam_attempt' || issueType === 'item_mismatch'

      return {
        success: true,
        issueId,
        escalated
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Get supervision guidelines for middleman
   */
  static getSupervisionGuidelines(): {
    steps: string[]
    redFlags: string[]
    timeouts: Record<string, number>
  } {
    return {
      steps: [
        '1. Join trade chat room and greet participants',
        '2. Verify trade details (item name, price, participants)',
        '3. Guide users to meet in Roblox game',
        '4. Witness the in-game item exchange',
        '5. Confirm both parties received their items/payment',
        '6. Approve trade completion in platform'
      ],
      redFlags: [
        'User asking for personal information',
        'Item significantly different from description',
        'User requesting off-platform payment',
        'Suspicious account activity or new accounts',
        'User pressuring for quick completion',
        'Technical issues preventing verification'
      ],
      timeouts: {
        initialResponse: this.ASSIGNMENT_TIMEOUT_MINUTES,
        supervision: this.SUPERVISION_TIMEOUT_MINUTES,
        userResponse: 10 // minutes
      }
    }
  }

  /**
   * Calculate middleman performance metrics
   */
  static calculatePerformanceMetrics(middlemanId: string): {
    completedTrades: number
    averageTime: number // in minutes
    successRate: number // percentage
    rating: number
    expertise: string[]
  } {
    // In production, this would query historical data
    return {
      completedTrades: 45,
      averageTime: 23, // minutes
      successRate: 98.5, // percentage
      rating: 4.8,
      expertise: ['roblox', 'brainrot_items', 'high_value_items']
    }
  }

  /**
   * Get supervision status for trade
   */
  static getSupervisionStatus(context: SupervisionContext): {
    status: 'waiting' | 'active' | 'completing' | 'completed' | 'timed_out'
    timeElapsed: number
    timeRemaining: number
    nextAction: string
  } {
    const now = new Date()
    const timeElapsed = now.getTime() - context.supervisionStarted.getTime()
    const timeoutDate = addMinutes(context.supervisionStarted, this.SUPERVISION_TIMEOUT_MINUTES)
    const timeRemaining = Math.max(0, timeoutDate.getTime() - now.getTime())

    let status: 'waiting' | 'active' | 'completing' | 'completed' | 'timed_out' = 'active'
    let nextAction = 'Monitor in-game exchange'

    if (timeRemaining === 0) {
      status = 'timed_out'
      nextAction = 'Escalate to support'
    } else if (timeRemaining < 10 * 60 * 1000) { // Less than 10 minutes
      status = 'completing'
      nextAction = 'Prepare to approve or escalate'
    }

    return {
      status,
      timeElapsed,
      timeRemaining,
      nextAction
    }
  }

  /**
   * Create supervision notification
   */
  static createSupervisionNotification(
    type: 'assigned' | 'accepted' | 'completed' | 'issue',
    context: Partial<SupervisionContext> & { tradeId: string }
  ): {
    title: string
    message: string
    priority: 'low' | 'normal' | 'high'
    recipients: ('creator' | 'participant' | 'middleman')[]
  } {
    const notifications = {
      assigned: {
        title: '🛡️ Middleman Assigned',
        message: `A middleman has been assigned to supervise your trade. They will join shortly.`,
        priority: 'normal' as const,
        recipients: ['creator', 'participant'] as const
      },
      accepted: {
        title: '✅ Supervision Started',
        message: `Middleman has joined your trade. Follow their instructions for a safe exchange.`,
        priority: 'normal' as const,
        recipients: ['creator', 'participant'] as const
      },
      completed: {
        title: '🎉 Trade Completed',
        message: `Your trade has been completed successfully! Funds have been released.`,
        priority: 'high' as const,
        recipients: ['creator', 'participant'] as const
      },
      issue: {
        title: '⚠️ Trade Issue Reported',
        message: `An issue has been reported during supervision. Please wait for resolution.`,
        priority: 'high' as const,
        recipients: ['creator', 'participant'] as const
      }
    }

    return notifications[type]
  }
}

// Type exports
export type MiddlemanExpertise = 'roblox' | 'brainrot_items' | 'high_value_items' | 'dispute_resolution'
export type IssueType = 'scam_attempt' | 'item_mismatch' | 'user_unresponsive' | 'technical_issue' | 'other'
export type SupervisionStatus = 'waiting' | 'active' | 'completing' | 'completed' | 'timed_out'