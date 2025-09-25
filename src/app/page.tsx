"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/ui/search-bar"
import { TradeCard } from "@/components/ui/trade-card"
import { LoginButton } from "@/components/auth/login-button"
import { useAuth } from "@/lib/auth-client"
import { useTrades } from "@/hooks/api/useTrades"
import { Shield, Star, Users, Zap, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function Home() {
  const { data: session } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchFilters, setSearchFilters] = useState({})

  const { data: tradesData, isLoading } = useTrades({
    search: searchQuery,
    limit: 12,
    ...searchFilters
  })

  const handleSearch = (query: string, filters: any) => {
    setSearchQuery(query)
    setSearchFilters(filters)
  }

  const handleViewTrade = (tradeId: string) => {
    window.location.href = `/trades/${tradeId}`
  }

  const handleJoinTrade = (tradeId: string) => {
    if (!session?.user) {
      // Redirect to login
      return
    }
    // Handle join logic
  }

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Trade Roblox Items
              <span className="text-primary"> Securely</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect with other players, negotiate deals through real-time chat, and complete secure transactions with escrow protection and human middleman supervision.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {session?.user ? (
              <>
                <Link href="/create-trade">
                  <Button size="lg" className="w-full sm:w-auto">
                    Start Trading
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#browse">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Browse Items
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <LoginButton size="lg" />
                <Link href="#how-it-works">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Learn More
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Our Platform?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We provide the most secure and user-friendly way to trade Roblox items
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Escrow Protection</h3>
                <p className="text-sm text-muted-foreground">
                  Your payments are held securely until trades are completed
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Human Middlemen</h3>
                <p className="text-sm text-muted-foreground">
                  Expert supervisors ensure fair and secure transactions
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Real-time Chat</h3>
                <p className="text-sm text-muted-foreground">
                  Negotiate directly with other traders instantly
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Roblox OAuth</h3>
                <p className="text-sm text-muted-foreground">
                  Verify your identity with official Roblox authentication
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Search & Browse Section */}
      <section id="browse" className="container mx-auto px-4">
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Browse Active Trades</h2>
            <p className="text-muted-foreground">
              Discover amazing Roblox items from our trusted community
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              filters={searchFilters}
              onFiltersChange={setSearchFilters}
              placeholder="Search for Brainrot items, accessories, and more..."
              isLoading={isLoading}
            />
          </div>

          {/* Trade Results */}
          {tradesData && tradesData.trades.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {tradesData.trades.map((trade) => (
                <TradeCard
                  key={trade.id}
                  {...trade}
                  onView={() => handleViewTrade(trade.id)}
                  onJoin={() => handleJoinTrade(trade.id)}
                  isCreator={trade.creator.id === session?.user?.id}
                />
              ))}
            </div>
          ) : searchQuery ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No trades found matching your search.
              </p>
              <Button variant="outline" onClick={() => setSearchQuery("")} className="mt-4">
                Clear Search
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* Placeholder cards for loading or empty state */}
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="aspect-square bg-muted rounded mb-4" />
                    <div className="h-4 bg-muted rounded mb-2" />
                    <div className="h-3 bg-muted rounded w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {tradesData && tradesData.hasMore && (
            <div className="text-center">
              <Button variant="outline">Load More Trades</Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {!session?.user && (
        <section className="bg-primary/5 py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl font-bold">Ready to Start Trading?</h2>
              <p className="text-muted-foreground">
                Join thousands of Roblox players trading items safely and securely
              </p>
              <LoginButton size="lg" />
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
