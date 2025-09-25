import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export interface User {
  id: string
  username: string
  robloxId: string
  avatarUrl?: string
  email?: string
  createdAt: string
  updatedAt: string
}

export interface Session {
  user: User
  token: string
  expiresAt: string
}

export interface AuthStatus {
  isAuthenticated: boolean
  user?: User
  isLoading: boolean
}

export interface UpdateProfileData {
  username?: string
  email?: string
  avatarUrl?: string
}

const API_BASE = '/api'

// Query Keys
export const authKeys = {
  all: ['auth'] as const,
  session: ['auth', 'session'] as const,
  user: (userId: string) => ['auth', 'user', userId] as const,
  profile: ['auth', 'profile'] as const,
}

// Auth API functions
export const authApi = {
  async getSession(): Promise<Session | null> {
    try {
      const response = await fetch(`${API_BASE}/auth/session`, {
        credentials: 'include', // Include cookies for session management
      })

      if (response.status === 401) {
        // Not authenticated - this is expected
        return null
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch session: ${response.statusText}`)
      }

      return response.json()
    } catch (error) {
      console.error('Session fetch error:', error)
      return null
    }
  },

  async signOut(): Promise<void> {
    const response = await fetch(`${API_BASE}/auth/signout`, {
      method: 'POST',
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error(`Failed to sign out: ${response.statusText}`)
    }
  },

  async refreshSession(): Promise<Session | null> {
    try {
      const response = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      })

      if (response.status === 401) {
        return null
      }

      if (!response.ok) {
        throw new Error(`Failed to refresh session: ${response.statusText}`)
      }

      return response.json()
    } catch (error) {
      console.error('Session refresh error:', error)
      return null
    }
  },

  async getUser(userId: string): Promise<User> {
    const response = await fetch(`${API_BASE}/users/${userId}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.statusText}`)
    }

    return response.json()
  },

  async updateProfile(data: UpdateProfileData): Promise<User> {
    const response = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Failed to update profile: ${response.statusText}`)
    }

    return response.json()
  },

  async deleteAccount(): Promise<void> {
    const response = await fetch(`${API_BASE}/auth/delete-account`, {
      method: 'DELETE',
      credentials: 'include',
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Failed to delete account: ${response.statusText}`)
    }
  },

  async verifyEmail(token: string): Promise<void> {
    const response = await fetch(`${API_BASE}/auth/verify-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Failed to verify email: ${response.statusText}`)
    }
  },

  async resendVerificationEmail(): Promise<void> {
    const response = await fetch(`${API_BASE}/auth/resend-verification`, {
      method: 'POST',
      credentials: 'include',
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Failed to resend verification: ${response.statusText}`)
    }
  },
}

// React Query Hooks
export function useAuth(): AuthStatus & { refetch: () => void } {
  const query = useQuery({
    queryKey: authKeys.session,
    queryFn: authApi.getSession,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry failed auth requests
    refetchOnWindowFocus: true, // Check auth when window regains focus
    refetchOnMount: true,
  })

  return {
    isAuthenticated: !!query.data,
    user: query.data?.user,
    isLoading: query.isLoading,
    refetch: query.refetch,
  }
}

export function useSignOut() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.signOut,
    onSuccess: () => {
      // Clear all cached data on sign out
      queryClient.clear()

      // Set session to null
      queryClient.setQueryData(authKeys.session, null)

      // Optionally redirect to sign-in page
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/signin'
      }
    },
    onError: (error) => {
      console.error('Sign out error:', error)
    }
  })
}

export function useRefreshSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.refreshSession,
    onSuccess: (session) => {
      queryClient.setQueryData(authKeys.session, session)
    },
    onError: (error) => {
      console.error('Session refresh error:', error)
      // On refresh failure, clear the session
      queryClient.setQueryData(authKeys.session, null)
    }
  })
}

export function useUser(userId: string | undefined) {
  return useQuery({
    queryKey: authKeys.user(userId || ''),
    queryFn: () => authApi.getUser(userId!),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (updatedUser) => {
      // Update the session with the new user data
      queryClient.setQueryData(
        authKeys.session,
        (oldData: Session | null | undefined) => {
          if (!oldData) return oldData
          return { ...oldData, user: updatedUser }
        }
      )

      // Update user cache
      queryClient.setQueryData(authKeys.user(updatedUser.id), updatedUser)
    },
    onError: (error) => {
      console.error('Profile update error:', error)
    }
  })
}

export function useDeleteAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.deleteAccount,
    onSuccess: () => {
      // Clear all data and redirect
      queryClient.clear()
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
    },
    onError: (error) => {
      console.error('Account deletion error:', error)
    }
  })
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: authApi.verifyEmail,
    onError: (error) => {
      console.error('Email verification error:', error)
    }
  })
}

export function useResendVerificationEmail() {
  return useMutation({
    mutationFn: authApi.resendVerificationEmail,
    onError: (error) => {
      console.error('Resend verification error:', error)
    }
  })
}

// Utility functions
export function getAuthRedirectUrl(pathname: string = '/'): string {
  return `/auth/signin?redirect=${encodeURIComponent(pathname)}`
}

export function isUserLoggedIn(): boolean {
  if (typeof window === 'undefined') return false

  // This is a simple client-side check
  // In a real app, you'd want to validate the token
  const token = localStorage.getItem('auth_token') ||
                document.cookie.includes('auth-token')

  return !!token
}

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null

  try {
    const stored = localStorage.getItem('user_data')
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export function clearStoredAuth(): void {
  if (typeof window === 'undefined') return

  localStorage.removeItem('auth_token')
  localStorage.removeItem('user_data')

  // Clear auth-related cookies
  document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
}

// Auth state synchronization across tabs
export function syncAuthAcrossTabs(): void {
  if (typeof window === 'undefined') return

  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === 'auth_token' || e.key === 'user_data') {
      // Auth state changed in another tab, refresh the page
      window.location.reload()
    }
  }

  window.addEventListener('storage', handleStorageChange)

  // Return cleanup function
  return () => window.removeEventListener('storage', handleStorageChange)
}