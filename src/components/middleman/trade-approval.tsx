"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  MessageSquare,
  DollarSign,
  Clock,
  Shield,
  User,
  Loader2
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface TradeApprovalData {
  id: string
  itemName: string
  itemImage: string
  description?: string
  price: number
  status: string
  createdAt: string
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
    user: {
      id: string
      username: string
    }
  }>
  messages: Array<{
    id: string
    content: string
    timestamp: string
    user: {
      id: string
      username: string
      avatarUrl?: string
    }
  }>
}

interface TradeApprovalProps {
  trade: TradeApprovalData
  onApprove: (tradeId: string, notes: string) => Promise<void>
  onReject: (tradeId: string, notes: string) => Promise<void>
  isLoading?: boolean
  className?: string
}

export function TradeApproval({
  trade,
  onApprove,
  onReject,
  isLoading = false,
  className
}: TradeApprovalProps) {
  const [decision, setDecision] = useState<'approve' | 'reject' | null>(null)
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!decision || !notes.trim()) return

    setIsSubmitting(true)
    try {
      if (decision === 'approve') {
        await onApprove(trade.id, notes.trim())
      } else {
        await onReject(trade.id, notes.trim())
      }
    } catch (error) {
      console.error('Failed to submit trade decision:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-500'
      case 'PROCESSING':
        return 'bg-blue-500'
      case 'FAILED':
        return 'bg-red-500'
      default:
        return 'bg-yellow-500'
    }
  }

  const recentMessages = trade.messages.slice(-5)
  const activePayment = trade.payments.find(p => p.status === 'COMPLETED' || p.status === 'PROCESSING')

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Trade Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            <img
              src={trade.itemImage}
              alt={trade.itemName}
              className="w-20 h-20 object-cover rounded-lg bg-muted"
            />
            <div className="flex-1">
              <CardTitle className="text-xl">{trade.itemName}</CardTitle>
              <CardDescription className="mt-1">
                {trade.description || 'No description provided'}
              </CardDescription>
              <div className="flex items-center gap-4 mt-3">
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  <DollarSign className="h-3 w-3 mr-1" />
                  ${trade.price.toFixed(2)}
                </Badge>
                <Badge variant="outline">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDistanceToNow(new Date(trade.createdAt), { addSuffix: true })}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Participants */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Trade Participants</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Creator */}
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Avatar>
              <AvatarImage src={trade.creator.avatarUrl} />
              <AvatarFallback>
                {trade.creator.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{trade.creator.username}</p>
              <p className="text-sm text-muted-foreground">Trade Creator</p>
            </div>
            <Badge variant="outline" className="ml-auto">
              Seller
            </Badge>
          </div>

          {/* Participants */}
          {trade.participants.map((participant, index) => (
            <div key={participant.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Avatar>
                <AvatarImage src={participant.avatarUrl} />
                <AvatarFallback>
                  {participant.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{participant.username}</p>
                <p className="text-sm text-muted-foreground">Buyer</p>
              </div>
              <Badge variant="outline" className="ml-auto">
                Buyer
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Payment Information */}
      {activePayment && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p>
                    <strong>Amount:</strong> ${activePayment.amount.toFixed(2)}
                    <Badge className={`ml-2 ${getStatusColor(activePayment.status)} text-white`}>
                      {activePayment.status}
                    </Badge>
                  </p>
                  <p>
                    <strong>Payer:</strong> {activePayment.user.username}
                  </p>
                  <p>
                    <strong>Received:</strong> {formatDistanceToNow(new Date(activePayment.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Recent Chat Messages */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Recent Chat Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentMessages.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No recent messages
            </p>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((message) => (
                <div key={message.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={message.user.avatarUrl} />
                    <AvatarFallback>
                      {message.user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{message.user.username}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm mt-1 bg-muted p-2 rounded">
                      {message.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Decision Panel */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Middleman Decision
          </CardTitle>
          <CardDescription>
            Review the trade details above and make your decision
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Decision Buttons */}
          <div className="flex gap-3">
            <Button
              variant={decision === 'approve' ? 'default' : 'outline'}
              onClick={() => setDecision('approve')}
              disabled={isLoading || isSubmitting}
              className="flex-1"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve Trade
            </Button>
            <Button
              variant={decision === 'reject' ? 'destructive' : 'outline'}
              onClick={() => setDecision('reject')}
              disabled={isLoading || isSubmitting}
              className="flex-1"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject Trade
            </Button>
          </div>

          {/* Notes Input */}
          {decision && (
            <div className="space-y-2 pt-4 border-t">
              <Label htmlFor="notes">
                {decision === 'approve' ? 'Approval Notes' : 'Rejection Reason'} *
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={
                  decision === 'approve'
                    ? 'Explain why you are approving this trade...'
                    : 'Explain why you are rejecting this trade...'
                }
                rows={3}
                disabled={isLoading || isSubmitting}
              />
              <p className="text-xs text-muted-foreground">
                {notes.length}/1000 characters
              </p>
            </div>
          )}

          {/* Submit Button */}
          {decision && notes.trim() && (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full ${decision === 'reject' ? 'bg-red-600 hover:bg-red-700' : ''}`}
            >
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {decision === 'approve'
                ? 'Confirm Approval'
                : 'Confirm Rejection'
              }
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}