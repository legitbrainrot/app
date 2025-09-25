"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { UserProfile } from "@/components/auth/user-profile"
import { TradeCard } from "@/components/ui/trade-card"
import { useAuth } from "@/lib/auth-client"
import { useTrades } from "@/hooks/api/useTrades"
import { Package, TrendingUp, Clock, CheckCircle, Plus, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const { data: session, isPending } = useAuth()
  const [activeTab, setActiveTab] = useState("active")

  // Fetch user's trades based on active tab
  const { data: tradesData, isLoading } = useTrades({
    // This would need to be implemented in the API to filter by user
    status: activeTab === 'completed' ? 'COMPLETED' :
           activeTab === 'pending' ? 'UNDER_REVIEW' : 'ACTIVE',
    limit: 20
  })

  const handleViewTrade = (tradeId: string) => {
    window.location.href = `/trades/${tradeId}`
  }

  if (isPending) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-48" />
          <div className="h-64 bg-muted rounded" />
          <div className="h-96 bg-muted rounded" />
        </div>
      </div>
    )
  }

  if (!session?.user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
            <p className="text-muted-foreground mb-4">
              You need to sign in to view your profile and trade history.
            </p>
            <div className="flex gap-2">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  Go Home
                </Button>
              </Link>
              <Button onClick={() => window.location.href = '/api/auth/signin/roblox'} className="flex-1">
                Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Mock statistics - in real app, these would come from API
  const stats = {
    totalTrades: tradesData?.totalCount || 0,
    activeTrades: 3,
    completedTrades: 12,
    totalEarnings: 245.50
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your trade listings and view your trading history
          </p>
        </div>

        {/* Profile Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* User Profile Card */}
          <div className="lg:col-span-1">
            <UserProfile />
          </div>

          {/* Statistics */}
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Package className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.totalTrades}</div>
                <div className="text-xs text-muted-foreground">Total Listings</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.activeTrades}</div>
                <div className="text-xs text-muted-foreground">Active Trades</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.completedTrades}</div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">${stats.totalEarnings}</div>
                <div className="text-xs text-muted-foreground">Total Earned</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your trading activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Link href="/create-trade">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Listing
                </Button>
              </Link>
              <Button variant="outline">
                <Package className="h-4 w-4 mr-2" />
                Manage Inventory
              </Button>
              <Link href="/settings">
                <Button variant="outline">
                  Settings
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Trade History Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>My Trades</CardTitle>
            <CardDescription>View and manage your trade listings</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="active">
                  Active
                  {stats.activeTrades > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {stats.activeTrades}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="pending">
                  Under Review
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completed
                  <Badge variant="secondary" className="ml-2">
                    {stats.completedTrades}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="space-y-4">
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Card key={i} className="animate-pulse">
                        <CardContent className="p-4">
                          <div className="aspect-square bg-muted rounded mb-4" />
                          <div className="h-4 bg-muted rounded mb-2" />
                          <div className="h-3 bg-muted rounded w-3/4" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : tradesData && tradesData.trades.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tradesData.trades.map((trade) => (
                      <TradeCard
                        key={trade.id}
                        {...trade}
                        onView={() => handleViewTrade(trade.id)}
                        isCreator={true}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground mb-4">
                      You don't have any active trades yet
                    </p>
                    <Link href="/create-trade">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Listing
                      </Button>
                    </Link>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="pending">
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">
                    No trades currently under review
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="completed">
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">
                    Your completed trades will appear here
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="cancelled">
                <div className="text-center py-12">
                  <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">
                    No cancelled trades
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Achievement or Tips Section */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">Trading Tips</h3>
                <p className="text-sm text-muted-foreground">
                  Complete more trades to unlock achievements and increase your seller rating
                </p>
              </div>
              <Button variant="outline" size="sm">
                Learn More
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}