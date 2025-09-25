import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// UI Theme and Layout State
interface UIState {
  // Theme
  theme: 'light' | 'dark' | 'system'
  isSystemTheme: boolean

  // Layout
  sidebarOpen: boolean
  mobileMenuOpen: boolean

  // Modals and Dialogs
  modals: {
    paymentDialog: boolean
    tradeDialog: boolean
    profileDialog: boolean
    settingsDialog: boolean
  }

  // Loading States
  globalLoading: boolean
  loadingOperations: Set<string>

  // Notifications
  notifications: Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message?: string
    duration?: number
    createdAt: Date
  }>

  // Search and Filters
  searchQuery: string
  activeFilters: {
    priceRange: [number, number] | null
    category: string | null
    status: string | null
    dateRange: [Date, Date] | null
  }

  // Actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  toggleMobileMenu: () => void
  setMobileMenuOpen: (open: boolean) => void

  openModal: (modalKey: keyof UIState['modals']) => void
  closeModal: (modalKey: keyof UIState['modals']) => void
  closeAllModals: () => void

  setGlobalLoading: (loading: boolean) => void
  addLoadingOperation: (operation: string) => void
  removeLoadingOperation: (operation: string) => void

  addNotification: (notification: Omit<UIState['notifications'][0], 'id' | 'createdAt'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void

  setSearchQuery: (query: string) => void
  updateFilters: (filters: Partial<UIState['activeFilters']>) => void
  clearFilters: () => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Initial state
      theme: 'system',
      isSystemTheme: true,
      sidebarOpen: true,
      mobileMenuOpen: false,
      modals: {
        paymentDialog: false,
        tradeDialog: false,
        profileDialog: false,
        settingsDialog: false,
      },
      globalLoading: false,
      loadingOperations: new Set(),
      notifications: [],
      searchQuery: '',
      activeFilters: {
        priceRange: null,
        category: null,
        status: null,
        dateRange: null,
      },

      // Actions
      setTheme: (theme) => {
        set({ theme, isSystemTheme: theme === 'system' })

        // Apply theme to document
        if (typeof window !== 'undefined') {
          const root = document.documentElement
          if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
            root.className = root.className.replace(/theme-\w+/, `theme-${systemTheme}`)
          } else {
            root.className = root.className.replace(/theme-\w+/, `theme-${theme}`)
          }
        }
      },

      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

      openModal: (modalKey) => set((state) => ({
        modals: { ...state.modals, [modalKey]: true }
      })),
      closeModal: (modalKey) => set((state) => ({
        modals: { ...state.modals, [modalKey]: false }
      })),
      closeAllModals: () => set((state) => ({
        modals: Object.keys(state.modals).reduce((acc, key) => ({
          ...acc,
          [key]: false
        }), {} as UIState['modals'])
      })),

      setGlobalLoading: (loading) => set({ globalLoading: loading }),

      addLoadingOperation: (operation) => set((state) => ({
        loadingOperations: new Set([...state.loadingOperations, operation])
      })),

      removeLoadingOperation: (operation) => set((state) => {
        const newOperations = new Set(state.loadingOperations)
        newOperations.delete(operation)
        return { loadingOperations: newOperations }
      }),

      addNotification: (notification) => set((state) => ({
        notifications: [
          {
            id: crypto.randomUUID(),
            createdAt: new Date(),
            duration: 5000, // Default 5 seconds
            ...notification,
          },
          ...state.notifications,
        ].slice(0, 10) // Keep only latest 10 notifications
      })),

      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      })),

      clearNotifications: () => set({ notifications: [] }),

      setSearchQuery: (query) => set({ searchQuery: query }),

      updateFilters: (filters) => set((state) => ({
        activeFilters: { ...state.activeFilters, ...filters }
      })),

      clearFilters: () => set({
        activeFilters: {
          priceRange: null,
          category: null,
          status: null,
          dateRange: null,
        }
      }),
    }),
    {
      name: 'ui-store',
      partialize: (state) => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
        // Don't persist notifications, modals, or loading states
      }),
    }
  )
)

// Selectors for better performance
export const useTheme = () => useUIStore((state) => ({
  theme: state.theme,
  isSystemTheme: state.isSystemTheme,
  setTheme: state.setTheme,
}))

export const useNotifications = () => useUIStore((state) => ({
  notifications: state.notifications,
  addNotification: state.addNotification,
  removeNotification: state.removeNotification,
  clearNotifications: state.clearNotifications,
}))

export const useModals = () => useUIStore((state) => ({
  modals: state.modals,
  openModal: state.openModal,
  closeModal: state.closeModal,
  closeAllModals: state.closeAllModals,
}))

export const useLoading = () => useUIStore((state) => ({
  globalLoading: state.globalLoading,
  loadingOperations: state.loadingOperations,
  setGlobalLoading: state.setGlobalLoading,
  addLoadingOperation: state.addLoadingOperation,
  removeLoadingOperation: state.removeLoadingOperation,
  isLoading: state.globalLoading || state.loadingOperations.size > 0,
}))

export const useSearch = () => useUIStore((state) => ({
  searchQuery: state.searchQuery,
  activeFilters: state.activeFilters,
  setSearchQuery: state.setSearchQuery,
  updateFilters: state.updateFilters,
  clearFilters: state.clearFilters,
  hasActiveFilters: Object.values(state.activeFilters).some(filter => filter !== null),
}))

// Auto-remove notifications after their duration
export const startNotificationTimer = () => {
  setInterval(() => {
    const state = useUIStore.getState()
    const now = new Date()

    state.notifications.forEach((notification) => {
      if (notification.duration && notification.duration > 0) {
        const elapsed = now.getTime() - notification.createdAt.getTime()
        if (elapsed > notification.duration) {
          state.removeNotification(notification.id)
        }
      }
    })
  }, 1000)
}