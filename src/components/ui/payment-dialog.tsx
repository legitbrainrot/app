import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./dialog"
import { Button } from "./button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"
import { Badge } from "./badge"
import { Separator } from "./separator"
import { Alert, AlertDescription } from "./alert"
import { CreditCard, AlertCircle, Clock, Shield } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export interface PaymentDialogProps {
  isOpen: boolean
  onClose: () => void
  trade: {
    id: string
    itemName: string
    itemImage: string
    price: number
    creator: {
      username: string
      avatarUrl?: string
    }
  }
  paymentIntent?: {
    clientSecret: string
    expiresAt: string | Date
  }
  onCreatePayment?: () => Promise<void>
  onConfirmPayment?: (clientSecret: string) => Promise<void>
  isCreatingPayment?: boolean
  isProcessingPayment?: boolean
  error?: string
}

export function PaymentDialog({
  isOpen,
  onClose,
  trade,
  paymentIntent,
  onCreatePayment,
  onConfirmPayment,
  isCreatingPayment = false,
  isProcessingPayment = false,
  error
}: PaymentDialogProps) {
  const [step, setStep] = useState<'confirm' | 'payment'>('confirm')

  const handleCreatePayment = async () => {
    if (onCreatePayment) {
      await onCreatePayment()
      setStep('payment')
    }
  }

  const handleConfirmPayment = async () => {
    if (paymentIntent?.clientSecret && onConfirmPayment) {
      await onConfirmPayment(paymentIntent.clientSecret)
    }
  }

  const isExpired = paymentIntent?.expiresAt && new Date(paymentIntent.expiresAt) < new Date()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Purchase Item
          </DialogTitle>
          <DialogDescription>
            Complete your purchase securely with our escrow service
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Trade Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3">
                <img
                  src={trade.itemImage}
                  alt={trade.itemName}
                  className="w-16 h-16 object-cover rounded-md bg-muted"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm leading-tight line-clamp-2">
                    {trade.itemName}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Sold by {trade.creator.username}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <span className="text-sm">Item Price</span>
                <span className="font-semibold">${trade.price.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">Platform Fee</span>
                <span className="text-sm">$0.00</span>
              </div>

              <Separator />

              <div className="flex justify-between items-center font-semibold">
                <span>Total</span>
                <span className="text-lg">${trade.price.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Escrow Information */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-green-500 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium mb-1">Secure Escrow Protection</p>
                  <p className="text-muted-foreground text-xs">
                    Your payment is held securely until the trade is completed and verified by our middleman service.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Payment Expiry Warning */}
          {paymentIntent && !isExpired && (
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                Payment expires {formatDistanceToNow(new Date(paymentIntent.expiresAt), { addSuffix: true })}
              </AlertDescription>
            </Alert>
          )}

          {/* Expired Payment */}
          {paymentIntent && isExpired && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This payment has expired. Please create a new payment to continue.
              </AlertDescription>
            </Alert>
          )}

          {/* Step Indicators */}
          {step === 'payment' && paymentIntent && !isExpired && (
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  Payment Intent Created
                </Badge>
              </div>

              <Card>
                <CardContent className="pt-4">
                  <div className="text-center space-y-2">
                    <p className="text-sm font-medium">Ready to Complete Payment</p>
                    <p className="text-xs text-muted-foreground">
                      Click below to complete your secure payment
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isCreatingPayment || isProcessingPayment}
          >
            Cancel
          </Button>

          {step === 'confirm' && (
            <Button
              onClick={handleCreatePayment}
              disabled={isCreatingPayment}
            >
              {isCreatingPayment ? 'Creating Payment...' : 'Create Payment Intent'}
            </Button>
          )}

          {step === 'payment' && paymentIntent && !isExpired && (
            <Button
              onClick={handleConfirmPayment}
              disabled={isProcessingPayment}
            >
              {isProcessingPayment ? 'Processing...' : 'Complete Payment'}
            </Button>
          )}

          {step === 'payment' && isExpired && (
            <Button
              onClick={handleCreatePayment}
              disabled={isCreatingPayment}
            >
              {isCreatingPayment ? 'Creating Payment...' : 'Create New Payment'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}