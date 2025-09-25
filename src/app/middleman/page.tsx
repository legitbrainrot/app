"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MiddlemanDashboard } from "@/components/middleman/middleman-dashboard"
import { TradeApproval } from "@/components/middleman/trade-approval"
import { Shield, AlertTriangle, LogOut, ArrowLeft } from "lucide-react"
import Link from "next/link"

// Mock auth check - in real app this would use proper middleware authentication
const useMiddlemanAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [middleman, setMiddleman] = useState(null)

  useEffect(() => {
    // Check for middleman JWT token
    const token = localStorage.getItem('middleman_token')
    if (token) {
      // In real app, verify token with server
      setIsAuthenticated(true)
      setMiddleman({
        id: 'admin1',
        userId: 'admin1',
        name: 'Admin User'
      })
    }
    setIsLoading(false)
  }, [])

  const logout = () => {
    localStorage.removeItem('middleman_token')
    setIsAuthenticated(false)
    setMiddleman(null)
  }

  return { isAuthenticated, isLoading, middleman, logout }
}

export default function MiddlemanDashboardPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading, middleman, logout } = useMiddlemanAuth()
  const [selectedTradeId, setSelectedTradeId] = useState<string | null>(null)
  const [trades, setTrades] = useState([])
  const [loadingTrades, setLoadingTrades] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch pending trades
  useEffect(() => {
    if (isAuthenticated) {
      fetchPendingTrades()
    }
  }, [isAuthenticated])

  const fetchPendingTrades = async () => {
    try {
      const token = localStorage.getItem('middleman_token')
      const response = await fetch('/api/middleman/trades/pending', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch pending trades')
      }

      const data = await response.json()
      setTrades(data.trades)
    } catch (err: any) {
      console.error('Error fetching trades:', err)
      setError(err.message)
    } finally {
      setLoadingTrades(false)
    }
  }

  const handleAssignTrade = async (tradeId: string) => {
    try {
      const token = localStorage.getItem('middleman_token')
      const response = await fetch(`/api/middleman/trades/${tradeId}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to assign trade')
      }

      // Refresh trades list
      await fetchPendingTrades()
      // Navigate to trade details
      setSelectedTradeId(tradeId)
    } catch (error: any) {
      console.error('Error assigning trade:', error)
      setError(error.message)
    }
  }

  const handleViewTrade = (tradeId: string) => {
    setSelectedTradeId(tradeId)
  }

  const handleBackToDashboard = () => {
    setSelectedTradeId(null)
    fetchPendingTrades()
  }

  const handleApproveTrade = async (tradeId: string, notes: string) => {
    try {
      const token = localStorage.getItem('middleman_token')
      const response = await fetch(`/api/middleman/trades/${tradeId}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          approved: true,
          notes
        })
      })

      if (!response.ok) {
        throw new Error('Failed to approve trade')
      }

      handleBackToDashboard()
    } catch (error: any) {
      console.error('Error approving trade:', error)
      throw error
    }
  }

  const handleRejectTrade = async (tradeId: string, notes: string) => {
    try {
      const token = localStorage.getItem('middleman_token')
      const response = await fetch(`/api/middleman/trades/${tradeId}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          approved: false,
          notes
        })
      })

      if (!response.ok) {
        throw new Error('Failed to reject trade')
      }

      handleBackToDashboard()
    } catch (error: any) {
      console.error('Error rejecting trade:', error)
      throw error
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-64" />
          <div className="h-96 bg-muted rounded" />
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Middleman Access Required</h2>
            <p className="text-muted-foreground mb-4">
              You need to sign in with middleman credentials to access this dashboard.
            </p>
            <div className="flex gap-2">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  Go Home
                </Button>
              </Link>
              <Link href="/middleman/login" className="flex-1">
                <Button className="w-full">
                  Middleman Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Mock statistics
  const stats = {
    pendingCount: trades.length,
    todayCompleted: 5,
    totalCompleted: 127,
    averageTime: 45 * 60 // 45 minutes in seconds
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {selectedTradeId && (
              <Button variant="ghost" size="sm" onClick={handleBackToDashboard}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            )}
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <Shield className="h-8 w-8 text-primary" />
                Middleman Dashboard
              </h1>
              <p className="text-muted-foreground">
                {selectedTradeId ? 'Review and approve trade' : 'Supervise trades and ensure fair transactions'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium">{middleman?.name}</p>
              <p className="text-sm text-muted-foreground">Middleman ID: {middleman?.userId}</p>
            </div>
            <Button variant="outline" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Content */}
      {selectedTradeId ? (
        // Show trade approval interface
        <TradeApprovalInterface
          tradeId={selectedTradeId}
          onApprove={handleApproveTrade}
          onReject={handleRejectTrade}
        />
      ) : (
        // Show dashboard
        <MiddlemanDashboard
          trades={trades}
          stats={stats}
          onAssignTrade={handleAssignTrade}
          onViewTrade={handleViewTrade}
          isLoading={loadingTrades}
        />
      )}
    </div>
  )
}

// Mock trade approval interface component
function TradeApprovalInterface({
  tradeId,
  onApprove,
  onReject
}: {
  tradeId: string
  onApprove: (id: string, notes: string) => Promise<void>
  onReject: (id: string, notes: string) => Promise<void>
}) {
  // Mock trade data - in real app this would fetch from API
  const mockTrade = {
    id: tradeId,
    itemName: "Sample Trade Item",
    itemImage: "https://via.placeholder.com/400",
    description: "Sample description for middleman review",
    price: 50.00,
    status: "UNDER_REVIEW",
    createdAt: new Date().toISOString(),
    creator: {
      id: "user1",
      username: "TestUser",
      avatarUrl: ""
    },
    participants: [
      {
        id: "user2",
        username: "Buyer",
        avatarUrl: ""
      }
    ],
    payments: [
      {
        id: "payment1",
        amount: 50.00,
        status: "COMPLETED",
        createdAt: new Date().toISOString(),
        user: {
          id: "user2",
          username: "Buyer"
        }
      }
    ],
    messages: [
      {
        id: "msg1",
        content: "Is this item still available?",
        timestamp: new Date().toISOString(),
        user: {
          id: "user2",
          username: "Buyer",
          avatarUrl: ""
        }
      },
      {
        id: "msg2",
        content: "Yes, it's in excellent condition!",
        timestamp: new Date().toISOString(),
        user: {
          id: "user1",
          username: "TestUser",
          avatarUrl: ""
        }
      }
    ]
  }

  return (
    <TradeApproval
      trade={mockTrade}
      onApprove={onApprove}
      onReject={onReject}
    />
  )
}