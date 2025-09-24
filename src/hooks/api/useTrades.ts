import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/lib/auth-client'

export interface Trade {
  id: string
  itemName: string
  itemImage: string
  description?: string
  price: number
  status: 'ACTIVE' | 'UNDER_REVIEW' | 'COMPLETED' | 'CANCELLED'
  createdAt: string
  updatedAt: string
  completedAt?: string
  creator: {
    id: string
    username: string
    avatarUrl?: string
  }
  participants?: Array<{
    id: string
    username: string
    avatarUrl?: string
  }>
  payments?: Array<{
    id: string
    status: string
    amount: number
    createdAt: string
  }>
  participantCount: number
  messageCount: number
}

export interface SearchFilters {
  search?: string
  status?: string
  minPrice?: number
  maxPrice?: number
  limit?: number
  offset?: number
  sortBy?: string
}

export interface CreateTradeData {
  itemName: string
  itemImage: string
  description?: string
  price: number
}

export interface UpdateTradeData {
  itemName?: string
  itemImage?: string
  description?: string
  price?: number
}

// API functions
const api = {
  async getTrades(filters: SearchFilters = {}): Promise<{ trades: Trade[]; totalCount: number; hasMore: boolean }> {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString())
      }
    })

    const response = await fetch(`/api/trades?${params}`)
    if (!response.ok) {
      throw new Error('Failed to fetch trades')
    }
    return response.json()
  },

  async getTrade(id: string): Promise<Trade> {
    const response = await fetch(`/api/trades/${id}`)
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Trade not found')
      }
      throw new Error('Failed to fetch trade')
    }
    return response.json()
  },

  async createTrade(data: CreateTradeData): Promise<Trade> {
    const response = await fetch('/api/trades', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create trade')
    }

    return response.json()
  },

  async updateTrade(id: string, data: UpdateTradeData): Promise<Trade> {
    const response = await fetch(`/api/trades/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update trade')
    }

    return response.json()
  },

  async deleteTrade(id: string): Promise<void> {
    const response = await fetch(`/api/trades/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to delete trade')
    }
  },

  async joinTrade(id: string): Promise<{ message: string; tradeId: string }> {
    const response = await fetch(`/api/trades/${id}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to join trade')
    }

    return response.json()
  }
}

// Hooks
export function useTrades(filters: SearchFilters = {}) {
  return useQuery({
    queryKey: ['trades', filters],
    queryFn: () => api.getTrades(filters),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute for active trades
  })
}

export function useTrade(id: string | undefined) {
  return useQuery({
    queryKey: ['trade', id],
    queryFn: () => api.getTrade(id!),
    enabled: !!id,
    staleTime: 10 * 1000, // 10 seconds
  })
}

export function useCreateTrade() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.createTrade,
    onSuccess: (newTrade) => {
      // Invalidate and refetch trades list
      queryClient.invalidateQueries({ queryKey: ['trades'] })

      // Add the new trade to the cache
      queryClient.setQueryData(['trade', newTrade.id], newTrade)
    },
  })
}

export function useUpdateTrade() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTradeData }) =>
      api.updateTrade(id, data),
    onSuccess: (updatedTrade) => {
      // Update the specific trade in cache
      queryClient.setQueryData(['trade', updatedTrade.id], updatedTrade)

      // Invalidate trades list to reflect changes
      queryClient.invalidateQueries({ queryKey: ['trades'] })
    },
  })
}

export function useDeleteTrade() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.deleteTrade,
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: ['trade', deletedId] })

      // Invalidate trades list
      queryClient.invalidateQueries({ queryKey: ['trades'] })
    },
  })
}

export function useJoinTrade() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.joinTrade,
    onSuccess: (_, tradeId) => {
      // Invalidate the specific trade to refetch with updated participant info
      queryClient.invalidateQueries({ queryKey: ['trade', tradeId] })

      // Invalidate trades list
      queryClient.invalidateQueries({ queryKey: ['trades'] })
    },
  })
}