import { TradeStatus } from '@prisma/client'

// Trade status transition validation and business logic
export class TradeService {
  // Valid state transitions map
  private static readonly VALID_TRANSITIONS: Record<TradeStatus, TradeStatus[]> = {
    ACTIVE: ['NEGOTIATING', 'CANCELLED'],
    NEGOTIATING: ['PAYMENT_PENDING', 'CANCELLED', 'ACTIVE'],
    PAYMENT_PENDING: ['PAYMENT_COMPLETE', 'REFUNDED', 'CANCELLED'],
    PAYMENT_COMPLETE: ['IN_PROGRESS', 'REFUNDED'],
    IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
    COMPLETED: [], // Terminal state
    CANCELLED: [], // Terminal state
    REFUNDED: [], // Terminal state
  }

  // Business rules for status transitions
  private static readonly TRANSITION_REQUIREMENTS: Record<string, (context: any) => boolean> = {
    'ACTIVE->NEGOTIATING': (context) => context.hasParticipant,
    'NEGOTIATING->PAYMENT_PENDING': (context) => context.termsAgreed,
    'PAYMENT_PENDING->PAYMENT_COMPLETE': (context) => context.bothPaid,
    'PAYMENT_COMPLETE->IN_PROGRESS': (context) => context.hasMiddleman,
    'IN_PROGRESS->COMPLETED': (context) => context.middlemanApproved,
  }

  /**
   * Validate if a status transition is allowed
   */
  static canTransition(fromStatus: TradeStatus, toStatus: TradeStatus): boolean {
    const allowedTransitions = this.VALID_TRANSITIONS[fromStatus]
    return allowedTransitions.includes(toStatus)
  }

  /**
   * Validate status transition with business context
   */
  static validateTransition(
    fromStatus: TradeStatus,
    toStatus: TradeStatus,
    context: {
      hasParticipant?: boolean
      termsAgreed?: boolean
      bothPaid?: boolean
      hasMiddleman?: boolean
      middlemanApproved?: boolean
    }
  ): { isValid: boolean; reason?: string } {
    // Check if transition is structurally valid
    if (!this.canTransition(fromStatus, toStatus)) {
      return {
        isValid: false,
        reason: `Invalid transition from ${fromStatus} to ${toStatus}`
      }
    }

    // Check business rule requirements
    const transitionKey = `${fromStatus}->${toStatus}`
    const requirementCheck = this.TRANSITION_REQUIREMENTS[transitionKey]

    if (requirementCheck && !requirementCheck(context)) {
      return {
        isValid: false,
        reason: `Business requirements not met for transition ${transitionKey}`
      }
    }

    return { isValid: true }
  }

  /**
   * Get next possible statuses from current status
   */
  static getNextStatuses(currentStatus: TradeStatus): TradeStatus[] {
    return this.VALID_TRANSITIONS[currentStatus] || []
  }

  /**
   * Check if status is terminal (no further transitions)
   */
  static isTerminalStatus(status: TradeStatus): boolean {
    return this.VALID_TRANSITIONS[status].length === 0
  }

  /**
   * Get human-readable status description
   */
  static getStatusDescription(status: TradeStatus): string {
    const descriptions: Record<TradeStatus, string> = {
      ACTIVE: 'Available for trading',
      NEGOTIATING: 'Users are negotiating terms',
      PAYMENT_PENDING: 'Waiting for payments',
      PAYMENT_COMPLETE: 'Payments received, awaiting middleman',
      IN_PROGRESS: 'Middleman supervising trade',
      COMPLETED: 'Trade completed successfully',
      CANCELLED: 'Trade was cancelled',
      REFUNDED: 'Payments have been refunded'
    }
    return descriptions[status]
  }

  /**
   * Get status color for UI representation
   */
  static getStatusColor(status: TradeStatus): 'green' | 'yellow' | 'red' | 'blue' | 'gray' {
    const colors: Record<TradeStatus, 'green' | 'yellow' | 'red' | 'blue' | 'gray'> = {
      ACTIVE: 'green',
      NEGOTIATING: 'blue',
      PAYMENT_PENDING: 'yellow',
      PAYMENT_COMPLETE: 'yellow',
      IN_PROGRESS: 'blue',
      COMPLETED: 'green',
      CANCELLED: 'gray',
      REFUNDED: 'red'
    }
    return colors[status]
  }

  /**
   * Determine if user can perform action based on trade status
   */
  static canUserPerformAction(
    status: TradeStatus,
    action: 'join' | 'message' | 'pay' | 'cancel',
    userRole: 'creator' | 'participant' | 'middleman' | 'viewer'
  ): boolean {
    const actionPermissions: Record<string, boolean> = {
      // Join trade
      [`ACTIVE-join-viewer`]: true,
      [`NEGOTIATING-join-viewer`]: true,

      // Send messages
      [`ACTIVE-message-creator`]: false,
      [`NEGOTIATING-message-creator`]: true,
      [`NEGOTIATING-message-participant`]: true,
      [`PAYMENT_PENDING-message-creator`]: true,
      [`PAYMENT_PENDING-message-participant`]: true,
      [`PAYMENT_COMPLETE-message-creator`]: true,
      [`PAYMENT_COMPLETE-message-participant`]: true,
      [`PAYMENT_COMPLETE-message-middleman`]: true,
      [`IN_PROGRESS-message-creator`]: true,
      [`IN_PROGRESS-message-participant`]: true,
      [`IN_PROGRESS-message-middleman`]: true,

      // Make payments
      [`PAYMENT_PENDING-pay-creator`]: true,
      [`PAYMENT_PENDING-pay-participant`]: true,

      // Cancel trade
      [`ACTIVE-cancel-creator`]: true,
      [`NEGOTIATING-cancel-creator`]: true,
      [`NEGOTIATING-cancel-participant`]: true,
      [`PAYMENT_PENDING-cancel-creator`]: false,
      [`PAYMENT_PENDING-cancel-participant`]: false,
    }

    const key = `${status}-${action}-${userRole}`
    return actionPermissions[key] ?? false
  }

  /**
   * Calculate trade progress percentage
   */
  static getProgressPercentage(status: TradeStatus): number {
    const progressMap: Record<TradeStatus, number> = {
      ACTIVE: 10,
      NEGOTIATING: 25,
      PAYMENT_PENDING: 50,
      PAYMENT_COMPLETE: 75,
      IN_PROGRESS: 90,
      COMPLETED: 100,
      CANCELLED: 0,
      REFUNDED: 0
    }
    return progressMap[status]
  }

  /**
   * Get required actions for current status
   */
  static getRequiredActions(
    status: TradeStatus,
    userRole: 'creator' | 'participant' | 'middleman'
  ): string[] {
    const actions: Record<string, string[]> = {
      [`ACTIVE-creator`]: ['Wait for participants'],
      [`ACTIVE-participant`]: [],
      [`NEGOTIATING-creator`]: ['Discuss terms', 'Agree on price'],
      [`NEGOTIATING-participant`]: ['Discuss terms', 'Agree on price'],
      [`PAYMENT_PENDING-creator`]: ['Complete payment within 30 minutes'],
      [`PAYMENT_PENDING-participant`]: ['Complete payment within 30 minutes'],
      [`PAYMENT_COMPLETE-middleman`]: ['Accept supervision', 'Join trade room'],
      [`IN_PROGRESS-creator`]: ['Complete in-game exchange'],
      [`IN_PROGRESS-participant`]: ['Complete in-game exchange'],
      [`IN_PROGRESS-middleman`]: ['Verify exchange', 'Approve completion'],
      [`COMPLETED-creator`]: ['Trade completed'],
      [`COMPLETED-participant`]: ['Trade completed'],
      [`COMPLETED-middleman`]: ['Trade completed'],
    }

    const key = `${status}-${userRole}`
    return actions[key] || []
  }
}

// Type exports for use in other modules
export type TransitionValidation = {
  isValid: boolean
  reason?: string
}

export type TradeActionPermission = {
  canJoin: boolean
  canMessage: boolean
  canPay: boolean
  canCancel: boolean
}