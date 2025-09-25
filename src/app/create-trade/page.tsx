"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TradeForm, type TradeFormData } from "@/components/trades/trade-form"
import { useAuth } from "@/lib/auth-client"
import { useCreateTrade } from "@/hooks/api/useTrades"
import { ArrowLeft, Package, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function CreateTradePage() {
  const router = useRouter()
  const { data: session } = useAuth()
  const createTradeMutation = useCreateTrade()

  const [error, setError] = useState<string | null>(null)

  const handleImageUpload = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('image', file)

    const response = await fetch('/api/upload/image', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to upload image')
    }

    const data = await response.json()
    return data.url
  }

  const handleSubmit = async (formData: TradeFormData) => {
    setError(null)

    try {
      const newTrade = await createTradeMutation.mutateAsync(formData)

      // Redirect to the new trade page
      router.push(`/trades/${newTrade.id}`)
    } catch (err: any) {
      console.error('Failed to create trade:', err)
      setError(err.message || 'Failed to create trade listing')
    }
  }

  // Redirect if not authenticated
  if (!session?.user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
            <p className="text-muted-foreground mb-4">
              You need to sign in with your Roblox account to create trade listings.
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Create Trade Listing</h1>
          <p className="text-muted-foreground">
            List your Roblox item for secure trading with escrow protection
          </p>
        </div>
      </div>

      {/* Information Card */}
      <Card className="mb-6 bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            How Trading Works
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium mb-1">1. Create Listing</h4>
              <p className="text-muted-foreground">Upload item details and set your price</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">2. Chat & Negotiate</h4>
              <p className="text-muted-foreground">Buyers can message you to discuss the trade</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">3. Secure Transaction</h4>
              <p className="text-muted-foreground">Payment held in escrow until middleman confirms delivery</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Trade Form */}
      <TradeForm
        onSubmit={handleSubmit}
        onUploadImage={handleImageUpload}
        isLoading={createTradeMutation.isPending}
        error={createTradeMutation.error?.message}
      />

      {/* Tips Card */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">Tips for a Successful Listing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">📸 High-Quality Images</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Use clear, well-lit photos</li>
                <li>• Show the item from multiple angles</li>
                <li>• Highlight any special features</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">📝 Detailed Descriptions</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Describe item condition accurately</li>
                <li>• Mention rarity or special attributes</li>
                <li>• Be honest about any flaws</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">💰 Fair Pricing</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Research current market prices</li>
                <li>• Consider item rarity and demand</li>
                <li>• Be open to reasonable negotiations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">⚡ Quick Responses</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Respond to inquiries promptly</li>
                <li>• Be professional and friendly</li>
                <li>• Keep communication on-platform</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}