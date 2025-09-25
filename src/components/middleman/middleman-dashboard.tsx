"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
  DollarSign,
  Users,
  AlertTriangle
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Trade {
  id: string
  itemName: string
  itemImage: string
  price: number
  status: string
  createdAt: string
  timeInQueue: number
  creator: {
    id: string
    username: string
    avatarUrl?: string
  }
  participants: Array<{
    id: string
    username: string
    avatarUrl?: string
  }>
  payments: Array<{
    id: string
    amount: number
    status: string
    createdAt: string
  }>
  messageCount: number
}

interface MiddlemanDashboardProps {
  trades: Trade[]
  stats: {
    pendingCount: number
    todayCompleted: number
    totalCompleted: number
    averageTime: number
  }
  onAssignTrade: (tradeId: string) => Promise<void>
  onViewTrade: (tradeId: string) => void
  isLoading?: boolean
  className?: string
}

export function MiddlemanDashboard({
  trades,
  stats,
  onAssignTrade,
  onViewTrade,
  isLoading = false,
  className
}: MiddlemanDashboardProps) {
  const [assigningTrade, setAssigningTrade] = useState<string | null>(null)

  const handleAssignTrade = async (tradeId: string) => {
    if (assigningTrade) return

    setAssigningTrade(tradeId)
    try {
      await onAssignTrade(tradeId)
    } catch (error) {
      console.error('Failed to assign trade:', error)
    } finally {
      setAssigningTrade(null)
    }
  }

  const getPriorityColor = (timeInQueue: number) => {
    const hoursInQueue = timeInQueue / (1000 * 60 * 60)
    if (hoursInQueue > 24) return 'bg-red-500'
    if (hoursInQueue > 12) return 'bg-yellow-500'
    if (hoursInQueue > 6) return 'bg-orange-500'
    return 'bg-green-500'
  }

  const formatQueueTime = (timeInQueue: number) => {
    return formatDistanceToNow(new Date(Date.now() - timeInQueue), { addSuffix: false })
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Pending Review</p>
                <p className="text-2xl font-bold">{stats.pendingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Today Completed</p>
                <p className="text-2xl font-bold">{stats.todayCompleted}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total Completed</p>
                <p className="text-2xl font-bold">{stats.totalCompleted}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Avg. Resolution</p>
                <p className="text-2xl font-bold">{Math.round(stats.averageTime / 60)}m</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trade Queue */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Trade Review Queue
          </CardTitle>
          <CardDescription>
            Trades pending middleman supervision and approval
          </CardDescription>
        </CardHeader>

        <CardContent>
          {trades.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No trades pending review</p>
              <p className="text-sm">Great job keeping up with the queue!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {trades.map((trade) => (
                <Card key={trade.id} className="border-l-4 border-l-orange-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-4">
                        <img
                          src={trade.itemImage}
                          alt={trade.itemName}
                          className="w-16 h-16 object-cover rounded-md bg-muted"
                        />

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg leading-tight">
                            {trade.itemName}
                          </h3>

                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              ${trade.price.toFixed(2)}
                            </span>

                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {trade.participants.length + 1} users
                            </span>

                            <span className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              {trade.messageCount} messages
                            </span>
                          </div>

                          <div className="flex items-center gap-2 mt-3">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={trade.creator.avatarUrl} />
                              <AvatarFallback>
                                {trade.creator.username.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">
                              <span className="font-medium">{trade.creator.username}</span>
                              {trade.participants.length > 0 && (
                                <>
                                  {' ↔ '}
                                  <span className="font-medium">
                                    {trade.participants[0].username}
                                  </span>
                                  {trade.participants.length > 1 && (
                                    <span className="text-muted-foreground">
                                      {' '}+{trade.participants.length - 1} more
                                    </span>
                                  )}
                                </>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${getPriorityColor(trade.timeInQueue)}`}
                          />
                          <Badge variant="outline" className="text-xs">
                            {formatQueueTime(trade.timeInQueue)} in queue
                          </Badge>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewTrade(trade.id)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>

                          <Button
                            size="sm"
                            onClick={() => handleAssignTrade(trade.id)}
                            disabled={assigningTrade === trade.id}
                          >
                            {assigningTrade === trade.id ? (
                              <>Assigning...</>
                            ) : (
                              <>
                                <Shield className="h-4 w-4 mr-1" />
                                Take Case
                              </>
                            )}
                          </Button>
                        </div>

                        {trade.payments.length > 0 && (
                          <Alert className="mt-2 w-48">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription className="text-xs">
                              Payment of ${trade.payments[0].amount.toFixed(2)} received
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}