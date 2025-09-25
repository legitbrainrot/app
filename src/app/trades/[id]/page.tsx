"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ChatInterface } from "@/components/ui/chat-interface"
import { PaymentDialog } from "@/components/ui/payment-dialog"
import { useAuth } from "@/lib/auth-client"
import { useTrade, useJoinTrade } from "@/hooks/api/useTrades"
import { useTradeSocket } from "@/hooks/useSocket"
import {
  ArrowLeft,
  MessageSquare,
  Users,
  DollarSign,
  Clock,
  Shield,
  Eye,
  UserPlus,
  AlertCircle,
  CheckCircle
} from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

interface TradePageProps {
  params: { id: string }
}

export default function TradePage({ params }: TradePageProps) {
  const router = useRouter()
  const { data: session } = useAuth()
  const { data: trade, isLoading, error } = useTrade(params.id)
  const joinTradeMutation = useJoinTrade()

  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const [isJoining, setIsJoining] = useState(false)

  // Real-time features
  const {
    messages: realtimeMessages,
    typingUsers,
    tradeStatus,
    isConnected
  } = useTradeSocket(params.id)

  // Merge real-time messages with initial messages
  useEffect(() => {
    if (realtimeMessages.length > 0) {
      setMessages(prev => [...prev, ...realtimeMessages])
    }
  }, [realtimeMessages])

  const handleJoinTrade = async () => {
    if (!session?.user || !trade) return

    setIsJoining(true)
    try {
      await joinTradeMutation.mutateAsync(params.id)
    } catch (error) {
      console.error('Failed to join trade:', error)
    } finally {
      setIsJoining(false)
    }
  }

  const handleSendMessage = async (content: string) => {
    if (!session?.user) return

    try {
      const response = await fetch(`/api/trades/${params.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content })
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      // Real-time messages will be handled by the socket
    } catch (error) {
      console.error('Failed to send message:', error)
      throw error
    }
  }

  const handleCreatePayment = async () => {
    if (!trade) return

    try {
      const response = await fetch(`/api/trades/${params.id}/payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        throw new Error('Failed to create payment')
      }

      // Handle payment intent creation
    } catch (error) {
      console.error('Failed to create payment:', error)
      throw error
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-64" />
          <div className="h-64 bg-muted rounded" />
          <div className="h-96 bg-muted rounded" />
        </div>
      </div>
    )
  }

  if (error || !trade) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Trade Not Found</h2>
            <p className="text-muted-foreground mb-4">
              This trade listing doesn't exist or has been removed.
            </p>
            <Link href="/">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isCreator = trade.creator.id === session?.user?.id
  const isParticipant = trade.participants?.some(p => p.id === session?.user?.id)
  const canJoin = session?.user && !isCreator && !isParticipant && trade.status === 'ACTIVE'
  const canMessage = session?.user && (isCreator || isParticipant)
  const canPay = session?.user && isParticipant && !isCreator && trade.status === 'ACTIVE'

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-500'
      case 'UNDER_REVIEW': return 'bg-yellow-500'
      case 'COMPLETED': return 'bg-blue-500'
      case 'CANCELLED': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Browse
        </Link>

        <div className="flex items-start gap-2">
          <h1 className="text-2xl font-bold flex-1">{trade.itemName}</h1>
          <Badge className={`${getStatusColor(tradeStatus || trade.status)} text-white`}>
            {tradeStatus || trade.status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trade Details */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image */}
                <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                  <img
                    src={trade.itemImage}
                    alt={trade.itemName}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{trade.itemName}</h3>
                    {trade.description && (
                      <p className="text-muted-foreground">{trade.description}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Price</span>
                      <span className="text-2xl font-bold text-primary">
                        ${trade.price.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Listed</span>
                      <span>{formatDistanceToNow(new Date(trade.createdAt), { addSuffix: true })}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Participants</span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {(trade.participants?.length || 0) + 1}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-4 border-t">
                    {canJoin && (
                      <Button
                        onClick={handleJoinTrade}
                        disabled={isJoining || joinTradeMutation.isPending}
                        className="w-full"
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        {isJoining ? 'Joining...' : 'Join Trade'}
                      </Button>
                    )}

                    {canPay && (
                      <Button
                        onClick={() => setShowPaymentDialog(true)}
                        className="w-full"
                        variant={trade.payments?.length ? 'outline' : 'default'}
                      >
                        <DollarSign className="h-4 w-4 mr-2" />
                        {trade.payments?.length ? 'Payment Pending' : 'Make Payment'}
                      </Button>
                    )}

                    {!session?.user && (
                      <Button
                        onClick={() => window.location.href = '/api/auth/signin/roblox'}
                        className="w-full"
                      >
                        Sign In to Trade
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Creator Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Seller Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={trade.creator.avatarUrl} />
                  <AvatarFallback>
                    {trade.creator.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{trade.creator.username}</p>
                  <p className="text-sm text-muted-foreground">Verified Roblox User</p>
                </div>
                <Badge variant="outline" className="ml-auto">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Sidebar */}
        <div className="space-y-6">
          {/* Connection Status */}
          {canMessage && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              {isConnected ? 'Connected' : 'Connecting...'}
            </div>
          )}

          {/* Chat */}
          {canMessage ? (
            <ChatInterface
              messages={messages}
              currentUserId={session?.user?.id || ''}
              onSendMessage={handleSendMessage}
              typingUsers={typingUsers}
              placeholder="Type your message to negotiate..."
            />
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">
                  {!session?.user
                    ? 'Sign in to chat with the seller'
                    : 'Join the trade to start chatting'
                  }
                </p>
              </CardContent>
            </Card>
          )}

          {/* Trade Status */}
          {(isCreator || isParticipant) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Trade Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(tradeStatus || trade.status)}`} />
                  <span className="font-medium">{tradeStatus || trade.status}</span>
                </div>

                {trade.payments && trade.payments.length > 0 && (
                  <Alert>
                    <DollarSign className="h-4 w-4" />
                    <AlertDescription>
                      Payment of ${trade.payments[0].amount.toFixed(2)} received
                    </AlertDescription>
                  </Alert>
                )}

                {trade.status === 'COMPLETED' && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Trade completed successfully!
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Payment Dialog */}
      {showPaymentDialog && trade && (
        <PaymentDialog
          isOpen={showPaymentDialog}
          onClose={() => setShowPaymentDialog(false)}
          trade={{
            id: trade.id,
            itemName: trade.itemName,
            itemImage: trade.itemImage,
            price: trade.price,
            creator: trade.creator
          }}
          onCreatePayment={handleCreatePayment}
        />
      )}
    </div>
  )
}