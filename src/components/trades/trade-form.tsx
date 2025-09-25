"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/ui/image-upload"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Package, AlertCircle } from "lucide-react"

export interface TradeFormData {
  itemName: string
  itemImage: string
  description: string
  price: number
}

interface TradeFormProps {
  initialData?: Partial<TradeFormData>
  onSubmit: (data: TradeFormData) => Promise<void>
  onUploadImage?: (file: File) => Promise<string>
  isLoading?: boolean
  error?: string
  className?: string
}

export function TradeForm({
  initialData,
  onSubmit,
  onUploadImage,
  isLoading = false,
  error,
  className
}: TradeFormProps) {
  const [formData, setFormData] = useState<TradeFormData>({
    itemName: initialData?.itemName || '',
    itemImage: initialData?.itemImage || '',
    description: initialData?.description || '',
    price: initialData?.price || 0
  })

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.itemName.trim()) {
      errors.itemName = 'Item name is required'
    } else if (formData.itemName.length > 100) {
      errors.itemName = 'Item name cannot exceed 100 characters'
    }

    if (!formData.itemImage) {
      errors.itemImage = 'Item image is required'
    }

    if (formData.price <= 0) {
      errors.price = 'Price must be greater than 0'
    } else if (formData.price > 1000) {
      errors.price = 'Price cannot exceed $1,000'
    }

    if (formData.description.length > 1000) {
      errors.description = 'Description cannot exceed 1,000 characters'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Error submitting trade form:', error)
    }
  }

  const handleInputChange = (field: keyof TradeFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleImageChange = (url: string) => {
    handleInputChange('itemImage', url)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          {initialData ? 'Edit Trade Listing' : 'Create Trade Listing'}
        </CardTitle>
        <CardDescription>
          {initialData
            ? 'Update your trade listing details'
            : 'List your Roblox item for secure trading with escrow protection'
          }
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Item Name */}
          <div className="space-y-2">
            <Label htmlFor="itemName">Item Name *</Label>
            <Input
              id="itemName"
              value={formData.itemName}
              onChange={(e) => handleInputChange('itemName', e.target.value)}
              placeholder="Enter the item name (e.g., Dominus Empyreus)"
              disabled={isLoading}
              className={validationErrors.itemName ? 'border-red-500' : ''}
            />
            {validationErrors.itemName && (
              <p className="text-sm text-red-600">{validationErrors.itemName}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {formData.itemName.length}/100 characters
            </p>
          </div>

          {/* Item Image */}
          <div className="space-y-2">
            <Label>Item Image *</Label>
            <ImageUpload
              value={formData.itemImage}
              onChange={handleImageChange}
              onUpload={onUploadImage}
              disabled={isLoading}
              error={validationErrors.itemImage}
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price">Price (USD) *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="price"
                type="number"
                min="0.01"
                max="1000"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                disabled={isLoading}
                className={`pl-8 ${validationErrors.price ? 'border-red-500' : ''}`}
              />
            </div>
            {validationErrors.price && (
              <p className="text-sm text-red-600">{validationErrors.price}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Platform fee: Free • You receive: ${(formData.price * 0.95).toFixed(2)} (95%)
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your item's condition, rarity, or any special features..."
              rows={4}
              disabled={isLoading}
              className={validationErrors.description ? 'border-red-500' : ''}
            />
            {validationErrors.description && (
              <p className="text-sm text-red-600">{validationErrors.description}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {formData.description.length}/1,000 characters
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isLoading || !formData.itemName || !formData.itemImage || formData.price <= 0}
              className="flex-1"
            >
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {initialData ? 'Update Listing' : 'Create Listing'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}