import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export interface ChatMessage {
  id: string
  content: string
  timestamp: string
  user: {
    id: string
    username: string
    avatarUrl?: string
  }
  tradeId: string
}

export interface SendMessageData {
  content: string
  tradeId: string
}

const API_BASE = '/api'

// Query Keys
export const chatKeys = {
  all: ['chat'] as const,
  messages: (tradeId: string) => ['chat', 'messages', tradeId] as const,
  typing: (tradeId: string) => ['chat', 'typing', tradeId] as const,
}

// Chat API functions
export const chatApi = {
  async getMessages(tradeId: string): Promise<{ messages: ChatMessage[] }> {
    const response = await fetch(`${API_BASE}/trades/${tradeId}/messages`)
    if (!response.ok) {
      throw new Error(`Failed to fetch messages: ${response.statusText}`)
    }
    return response.json()
  },

  async sendMessage(data: SendMessageData): Promise<ChatMessage> {
    const response = await fetch(`${API_BASE}/trades/${data.tradeId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: data.content }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Failed to send message: ${response.statusText}`)
    }

    return response.json()
  },

  async markMessagesRead(tradeId: string, messageIds: string[]): Promise<void> {
    const response = await fetch(`${API_BASE}/trades/${tradeId}/messages/read`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messageIds }),
    })

    if (!response.ok) {
      throw new Error(`Failed to mark messages as read: ${response.statusText}`)
    }
  },
}

// React Query Hooks
export function useTradeMessages(tradeId: string) {
  return useQuery({
    queryKey: chatKeys.messages(tradeId),
    queryFn: () => chatApi.getMessages(tradeId),
    enabled: !!tradeId,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 10 * 1000, // Refetch every 10 seconds as fallback
  })
}

export function useSendMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: chatApi.sendMessage,
    onSuccess: (newMessage) => {
      // Optimistically update the messages query
      queryClient.setQueryData(
        chatKeys.messages(newMessage.tradeId),
        (oldData: { messages: ChatMessage[] } | undefined) => {
          if (!oldData) return { messages: [newMessage] }

          // Check if message already exists (to prevent duplicates from real-time updates)
          const messageExists = oldData.messages.some(msg => msg.id === newMessage.id)
          if (messageExists) return oldData

          return {
            messages: [...oldData.messages, newMessage]
          }
        }
      )
    },
    onError: (error) => {
      console.error('Failed to send message:', error)
    }
  })
}

export function useMarkMessagesRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ tradeId, messageIds }: { tradeId: string; messageIds: string[] }) =>
      chatApi.markMessagesRead(tradeId, messageIds),
    onSuccess: (_, { tradeId }) => {
      // Invalidate messages query to refetch read status
      queryClient.invalidateQueries({ queryKey: chatKeys.messages(tradeId) })
    },
  })
}

// Real-time message utilities
export function addRealtimeMessage(
  queryClient: ReturnType<typeof useQueryClient>,
  tradeId: string,
  message: ChatMessage
) {
  queryClient.setQueryData(
    chatKeys.messages(tradeId),
    (oldData: { messages: ChatMessage[] } | undefined) => {
      if (!oldData) return { messages: [message] }

      // Check if message already exists
      const messageExists = oldData.messages.some(msg => msg.id === message.id)
      if (messageExists) return oldData

      return {
        messages: [...oldData.messages, message]
      }
    }
  )
}

export function updateMessageStatus(
  queryClient: ReturnType<typeof useQueryClient>,
  tradeId: string,
  messageId: string,
  updates: Partial<ChatMessage>
) {
  queryClient.setQueryData(
    chatKeys.messages(tradeId),
    (oldData: { messages: ChatMessage[] } | undefined) => {
      if (!oldData) return oldData

      return {
        messages: oldData.messages.map(msg =>
          msg.id === messageId ? { ...msg, ...updates } : msg
        )
      }
    }
  )
}

// Typing indicator utilities
export interface TypingUser {
  id: string
  username: string
}

export function addTypingUser(
  queryClient: ReturnType<typeof useQueryClient>,
  tradeId: string,
  user: TypingUser
) {
  queryClient.setQueryData(
    chatKeys.typing(tradeId),
    (oldData: TypingUser[] | undefined) => {
      if (!oldData) return [user]

      // Check if user is already typing
      if (oldData.some(u => u.id === user.id)) return oldData

      return [...oldData, user]
    }
  )
}

export function removeTypingUser(
  queryClient: ReturnType<typeof useQueryClient>,
  tradeId: string,
  userId: string
) {
  queryClient.setQueryData(
    chatKeys.typing(tradeId),
    (oldData: TypingUser[] | undefined) => {
      if (!oldData) return []

      return oldData.filter(u => u.id !== userId)
    }
  )
}

export function getTypingUsers(
  queryClient: ReturnType<typeof useQueryClient>,
  tradeId: string
): TypingUser[] {
  return queryClient.getQueryData(chatKeys.typing(tradeId)) || []
}