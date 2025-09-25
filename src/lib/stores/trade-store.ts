import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

// Trade-specific UI state and temporary data
interface Trade {
  id: string
  itemName: string
  itemImage: string
  description?: string
  price: number
  status: 'ACTIVE' | 'UNDER_REVIEW' | 'COMPLETED' | 'CANCELLED'
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
    amount: number
    status: string
    user: {
      id: string
      username: string
    }
  }>
  createdAt: string
}

interface TradeFormData {
  itemName: string
  description: string
  price: number
  itemImage: File | string | null
  category?: string
  tags?: string[]
}

interface ChatMessage {
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

interface TradeState {
  // Current trade being viewed
  currentTrade: Trade | null

  // Trade creation form
  tradeForm: TradeFormData
  isCreatingTrade: boolean
  createTradeErrors: Record<string, string>

  // Chat state for current trade
  chatMessages: ChatMessage[]
  typingUsers: string[]
  unreadCounts: Record<string, number> // tradeId -> count
  chatConnection: 'disconnected' | 'connecting' | 'connected'

  // Trade list filters and sorting
  sortBy: 'newest' | 'price_low' | 'price_high' | 'popularity'
  viewMode: 'grid' | 'list'

  // Recently viewed trades for quick access
  recentlyViewed: string[] // Trade IDs

  // Actions
  setCurrentTrade: (trade: Trade | null) => void

  updateTradeForm: (data: Partial<TradeFormData>) => void
  resetTradeForm: () => void
  setCreateTradeError: (field: string, error: string) => void
  clearCreateTradeErrors: () => void
  setIsCreatingTrade: (isCreating: boolean) => void

  addChatMessage: (message: ChatMessage) => void
  setChatMessages: (messages: ChatMessage[]) => void
  addTypingUser: (userId: string) => void
  removeTypingUser: (userId: string) => void
  setChatConnection: (status: TradeState['chatConnection']) => void
  markMessagesRead: (tradeId: string) => void
  incrementUnreadCount: (tradeId: string) => void

  setSortBy: (sortBy: TradeState['sortBy']) => void
  setViewMode: (viewMode: TradeState['viewMode']) => void

  addRecentlyViewed: (tradeId: string) => void
  clearRecentlyViewed: () => void

  // Trade status updates
  updateTradeStatus: (tradeId: string, status: Trade['status']) => void
  addTradeParticipant: (tradeId: string, participant: Trade['participants'][0]) => void

  // Reset entire state
  reset: () => void
}

const initialTradeForm: TradeFormData = {
  itemName: '',
  description: '',
  price: 0,
  itemImage: null,
  category: '',
  tags: [],
}

export const useTradeStore = create<TradeState>()(
  immer((set, get) => ({
    // Initial state
    currentTrade: null,
    tradeForm: initialTradeForm,
    isCreatingTrade: false,
    createTradeErrors: {},
    chatMessages: [],
    typingUsers: [],
    unreadCounts: {},
    chatConnection: 'disconnected',
    sortBy: 'newest',
    viewMode: 'grid',
    recentlyViewed: [],

    // Actions
    setCurrentTrade: (trade) => set((state) => {
      state.currentTrade = trade
      if (trade) {
        // Add to recently viewed
        const recentlyViewed = state.recentlyViewed.filter(id => id !== trade.id)
        state.recentlyViewed = [trade.id, ...recentlyViewed].slice(0, 10)

        // Reset chat state for new trade
        state.chatMessages = []
        state.typingUsers = []
        state.chatConnection = 'disconnected'
      }
    }),

    updateTradeForm: (data) => set((state) => {
      state.tradeForm = { ...state.tradeForm, ...data }
    }),

    resetTradeForm: () => set((state) => {
      state.tradeForm = initialTradeForm
      state.createTradeErrors = {}
    }),

    setCreateTradeError: (field, error) => set((state) => {
      state.createTradeErrors[field] = error
    }),

    clearCreateTradeErrors: () => set((state) => {
      state.createTradeErrors = {}
    }),

    setIsCreatingTrade: (isCreating) => set((state) => {
      state.isCreatingTrade = isCreating
    }),

    addChatMessage: (message) => set((state) => {
      // Check if message already exists (prevent duplicates)
      const existingMessage = state.chatMessages.find(m => m.id === message.id)
      if (!existingMessage) {
        state.chatMessages.push(message)
        // Sort messages by timestamp
        state.chatMessages.sort((a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        )
      }
    }),

    setChatMessages: (messages) => set((state) => {
      state.chatMessages = messages.sort((a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      )
    }),

    addTypingUser: (userId) => set((state) => {
      if (!state.typingUsers.includes(userId)) {
        state.typingUsers.push(userId)
      }
    }),

    removeTypingUser: (userId) => set((state) => {
      state.typingUsers = state.typingUsers.filter(id => id !== userId)
    }),

    setChatConnection: (status) => set((state) => {
      state.chatConnection = status
    }),

    markMessagesRead: (tradeId) => set((state) => {
      state.unreadCounts[tradeId] = 0
    }),

    incrementUnreadCount: (tradeId) => set((state) => {
      state.unreadCounts[tradeId] = (state.unreadCounts[tradeId] || 0) + 1
    }),

    setSortBy: (sortBy) => set((state) => {
      state.sortBy = sortBy
    }),

    setViewMode: (viewMode) => set((state) => {
      state.viewMode = viewMode
    }),

    addRecentlyViewed: (tradeId) => set((state) => {
      const filtered = state.recentlyViewed.filter(id => id !== tradeId)
      state.recentlyViewed = [tradeId, ...filtered].slice(0, 10)
    }),

    clearRecentlyViewed: () => set((state) => {
      state.recentlyViewed = []
    }),

    updateTradeStatus: (tradeId, status) => set((state) => {
      if (state.currentTrade && state.currentTrade.id === tradeId) {
        state.currentTrade.status = status
      }
    }),

    addTradeParticipant: (tradeId, participant) => set((state) => {
      if (state.currentTrade && state.currentTrade.id === tradeId) {
        if (!state.currentTrade.participants) {
          state.currentTrade.participants = []
        }
        const exists = state.currentTrade.participants.some(p => p.id === participant.id)
        if (!exists) {
          state.currentTrade.participants.push(participant)
        }
      }
    }),

    reset: () => set((state) => {
      state.currentTrade = null
      state.tradeForm = initialTradeForm
      state.isCreatingTrade = false
      state.createTradeErrors = {}
      state.chatMessages = []
      state.typingUsers = []
      state.unreadCounts = {}
      state.chatConnection = 'disconnected'
      state.recentlyViewed = []
    }),
  }))
)

// Selectors for better performance
export const useCurrentTrade = () => useTradeStore((state) => ({
  currentTrade: state.currentTrade,
  setCurrentTrade: state.setCurrentTrade,
  updateTradeStatus: state.updateTradeStatus,
  addTradeParticipant: state.addTradeParticipant,
}))

export const useTradeForm = () => useTradeStore((state) => ({
  tradeForm: state.tradeForm,
  isCreatingTrade: state.isCreatingTrade,
  createTradeErrors: state.createTradeErrors,
  updateTradeForm: state.updateTradeForm,
  resetTradeForm: state.resetTradeForm,
  setCreateTradeError: state.setCreateTradeError,
  clearCreateTradeErrors: state.clearCreateTradeErrors,
  setIsCreatingTrade: state.setIsCreatingTrade,
}))

export const useTradeChat = () => useTradeStore((state) => ({
  chatMessages: state.chatMessages,
  typingUsers: state.typingUsers,
  chatConnection: state.chatConnection,
  unreadCounts: state.unreadCounts,
  addChatMessage: state.addChatMessage,
  setChatMessages: state.setChatMessages,
  addTypingUser: state.addTypingUser,
  removeTypingUser: state.removeTypingUser,
  setChatConnection: state.setChatConnection,
  markMessagesRead: state.markMessagesRead,
  incrementUnreadCount: state.incrementUnreadCount,
}))

export const useTradeList = () => useTradeStore((state) => ({
  sortBy: state.sortBy,
  viewMode: state.viewMode,
  recentlyViewed: state.recentlyViewed,
  setSortBy: state.setSortBy,
  setViewMode: state.setViewMode,
  addRecentlyViewed: state.addRecentlyViewed,
  clearRecentlyViewed: state.clearRecentlyViewed,
}))

// Helper functions
export const getUnreadCount = (tradeId: string): number => {
  const state = useTradeStore.getState()
  return state.unreadCounts[tradeId] || 0
}

export const getTotalUnreadCount = (): number => {
  const state = useTradeStore.getState()
  return Object.values(state.unreadCounts).reduce((total, count) => total + count, 0)
}

export const isTradeParticipant = (tradeId: string, userId: string): boolean => {
  const state = useTradeStore.getState()
  if (!state.currentTrade || state.currentTrade.id !== tradeId) {
    return false
  }

  return state.currentTrade.creator.id === userId ||
         state.currentTrade.participants?.some(p => p.id === userId) || false
}