// Central export for all Zustand stores
export {
  useUIStore,
  useTheme,
  useNotifications,
  useModals,
  useLoading,
  useSearch,
  startNotificationTimer,
} from './ui-store'

export {
  useTradeStore,
  useCurrentTrade,
  useTradeForm,
  useTradeChat,
  useTradeList,
  getUnreadCount,
  getTotalUnreadCount,
  isTradeParticipant,
} from './trade-store'

// Re-export types
export type { UIState } from './ui-store'
export type { TradeState } from './trade-store'