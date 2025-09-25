import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  clientSecret: string
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'succeeded' | 'canceled'
  tradeId: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface Payment {
  id: string
  amount: number
  currency: string
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
  stripePaymentIntentId: string
  tradeId: string
  user: {
    id: string
    username: string
    avatarUrl?: string
  }
  createdAt: string
  updatedAt: string
}

export interface CreatePaymentIntentData {
  tradeId: string
  amount?: number // Optional, defaults to trade price
}

export interface ConfirmPaymentData {
  paymentIntentId: string
  paymentMethodId: string
}

const API_BASE = '/api'

// Query Keys
export const paymentKeys = {
  all: ['payments'] as const,
  intents: ['payments', 'intents'] as const,
  intent: (id: string) => ['payments', 'intents', id] as const,
  tradePayments: (tradeId: string) => ['payments', 'trade', tradeId] as const,
  userPayments: (userId: string) => ['payments', 'user', userId] as const,
}

// Payment API functions
export const paymentApi = {
  async createPaymentIntent(data: CreatePaymentIntentData): Promise<PaymentIntent> {
    const response = await fetch(`${API_BASE}/trades/${data.tradeId}/payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: data.amount }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Failed to create payment intent: ${response.statusText}`)
    }

    return response.json()
  },

  async confirmPayment(data: ConfirmPaymentData): Promise<PaymentIntent> {
    const response = await fetch(`${API_BASE}/payments/${data.paymentIntentId}/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentMethodId: data.paymentMethodId }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Failed to confirm payment: ${response.statusText}`)
    }

    return response.json()
  },

  async getPaymentIntent(paymentIntentId: string): Promise<PaymentIntent> {
    const response = await fetch(`${API_BASE}/payments/${paymentIntentId}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch payment intent: ${response.statusText}`)
    }

    return response.json()
  },

  async getTradePayments(tradeId: string): Promise<{ payments: Payment[] }> {
    const response = await fetch(`${API_BASE}/trades/${tradeId}/payments`)

    if (!response.ok) {
      throw new Error(`Failed to fetch trade payments: ${response.statusText}`)
    }

    return response.json()
  },

  async getUserPayments(userId: string): Promise<{ payments: Payment[] }> {
    const response = await fetch(`${API_BASE}/users/${userId}/payments`)

    if (!response.ok) {
      throw new Error(`Failed to fetch user payments: ${response.statusText}`)
    }

    return response.json()
  },

  async cancelPaymentIntent(paymentIntentId: string): Promise<void> {
    const response = await fetch(`${API_BASE}/payments/${paymentIntentId}/cancel`, {
      method: 'POST',
    })

    if (!response.ok) {
      throw new Error(`Failed to cancel payment intent: ${response.statusText}`)
    }
  },

  async refundPayment(paymentId: string, reason?: string): Promise<Payment> {
    const response = await fetch(`${API_BASE}/payments/${paymentId}/refund`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Failed to refund payment: ${response.statusText}`)
    }

    return response.json()
  },
}

// React Query Hooks
export function useCreatePaymentIntent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: paymentApi.createPaymentIntent,
    onSuccess: (paymentIntent) => {
      // Cache the payment intent
      queryClient.setQueryData(
        paymentKeys.intent(paymentIntent.id),
        paymentIntent
      )

      // Invalidate trade payments to show the new pending payment
      queryClient.invalidateQueries({
        queryKey: paymentKeys.tradePayments(paymentIntent.tradeId)
      })
    },
    onError: (error) => {
      console.error('Failed to create payment intent:', error)
    }
  })
}

export function useConfirmPayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: paymentApi.confirmPayment,
    onSuccess: (paymentIntent) => {
      // Update cached payment intent
      queryClient.setQueryData(
        paymentKeys.intent(paymentIntent.id),
        paymentIntent
      )

      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: paymentKeys.tradePayments(paymentIntent.tradeId)
      })
    },
    onError: (error) => {
      console.error('Failed to confirm payment:', error)
    }
  })
}

export function usePaymentIntent(paymentIntentId: string | undefined) {
  return useQuery({
    queryKey: paymentKeys.intent(paymentIntentId || ''),
    queryFn: () => paymentApi.getPaymentIntent(paymentIntentId!),
    enabled: !!paymentIntentId,
    staleTime: 60 * 1000, // 1 minute
    retry: (failureCount, error: any) => {
      // Don't retry on 404s (payment intent doesn't exist)
      if (error.message?.includes('404')) return false
      return failureCount < 3
    }
  })
}

export function useTradePayments(tradeId: string) {
  return useQuery({
    queryKey: paymentKeys.tradePayments(tradeId),
    queryFn: () => paymentApi.getTradePayments(tradeId),
    enabled: !!tradeId,
    staleTime: 30 * 1000, // 30 seconds
  })
}

export function useUserPayments(userId: string) {
  return useQuery({
    queryKey: paymentKeys.userPayments(userId),
    queryFn: () => paymentApi.getUserPayments(userId),
    enabled: !!userId,
    staleTime: 60 * 1000, // 1 minute
  })
}

export function useCancelPaymentIntent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: paymentApi.cancelPaymentIntent,
    onSuccess: (_, paymentIntentId) => {
      // Remove the cancelled payment intent from cache
      queryClient.removeQueries({
        queryKey: paymentKeys.intent(paymentIntentId)
      })

      // Invalidate all payment-related queries
      queryClient.invalidateQueries({
        queryKey: paymentKeys.all
      })
    },
    onError: (error) => {
      console.error('Failed to cancel payment intent:', error)
    }
  })
}

export function useRefundPayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ paymentId, reason }: { paymentId: string; reason?: string }) =>
      paymentApi.refundPayment(paymentId, reason),
    onSuccess: (refundedPayment) => {
      // Invalidate related queries to refresh payment status
      queryClient.invalidateQueries({
        queryKey: paymentKeys.tradePayments(refundedPayment.tradeId)
      })
      queryClient.invalidateQueries({
        queryKey: paymentKeys.userPayments(refundedPayment.user.id)
      })
    },
    onError: (error) => {
      console.error('Failed to refund payment:', error)
    }
  })
}

// Utility functions for Stripe client integration
export function getStripePublishableKey(): string {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  if (!key) {
    throw new Error('Stripe publishable key is not configured')
  }
  return key
}

export function formatPaymentAmount(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount)
}

export function getPaymentStatusColor(status: Payment['status']): string {
  switch (status) {
    case 'COMPLETED': return 'text-green-600'
    case 'PENDING': return 'text-yellow-600'
    case 'FAILED': return 'text-red-600'
    case 'REFUNDED': return 'text-blue-600'
    default: return 'text-gray-600'
  }
}

export function getPaymentStatusBadgeVariant(status: Payment['status']): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'COMPLETED': return 'default'
    case 'PENDING': return 'secondary'
    case 'FAILED': return 'destructive'
    case 'REFUNDED': return 'outline'
    default: return 'secondary'
  }
}