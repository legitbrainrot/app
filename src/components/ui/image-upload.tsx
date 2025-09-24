import { useState, useRef } from 'react'
import { Button } from "./button"
import { Card, CardContent } from "./card"
import { Alert, AlertDescription } from "./alert"
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react"

export interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  onUpload?: (file: File) => Promise<string>
  maxSize?: number // in bytes
  acceptedTypes?: string[]
  disabled?: boolean
  error?: string
  className?: string
}

export function ImageUpload({
  value,
  onChange,
  onUpload,
  maxSize = 5 * 1024 * 1024, // 5MB default
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  disabled = false,
  error,
  className
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `File type not supported. Please use: ${acceptedTypes.join(', ')}`
    }

    if (file.size > maxSize) {
      return `File too large. Maximum size is ${formatFileSize(maxSize)}`
    }

    return null
  }

  const handleFileSelect = async (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      console.error(validationError)
      return
    }

    // Create preview URL
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)

    if (onUpload) {
      setIsUploading(true)
      try {
        const uploadedUrl = await onUpload(file)
        onChange(uploadedUrl)
        // Clean up object URL since we have the uploaded URL
        URL.revokeObjectURL(objectUrl)
        setPreviewUrl(uploadedUrl)
      } catch (error) {
        console.error('Upload failed:', error)
        // Keep the preview URL for user feedback
      } finally {
        setIsUploading(false)
      }
    } else {
      // If no upload function provided, just use the object URL
      onChange(objectUrl)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (disabled || isUploading) return

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (!disabled && !isUploading) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
    // Clear input so same file can be selected again
    e.target.value = ''
  }

  const handleRemove = () => {
    if (previewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl)
    }
    setPreviewUrl(null)
    onChange('')
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleFileInputChange}
        disabled={disabled || isUploading}
        className="hidden"
      />

      {!previewUrl ? (
        <Card
          className={`border-2 border-dashed transition-colors ${
            isDragging
              ? 'border-primary bg-primary/5'
              : disabled || isUploading
              ? 'border-muted-foreground/25 bg-muted/50'
              : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5 cursor-pointer'
          }`}
          onClick={disabled || isUploading ? undefined : openFileDialog}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
            {isUploading ? (
              <>
                <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                <p className="text-sm font-medium">Uploading image...</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Please wait while we process your image
                </p>
              </>
            ) : (
              <>
                <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm font-medium mb-2">
                  {isDragging ? 'Drop image here' : 'Upload an image'}
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  Drag and drop or click to select
                </p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Supported formats: JPG, PNG, GIF, WebP</p>
                  <p>Maximum size: {formatFileSize(maxSize)}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-48 object-cover rounded-md bg-muted"
              />

              {isUploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md">
                  <div className="text-white text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                    <p className="text-sm">Uploading...</p>
                  </div>
                </div>
              )}

              {!disabled && !isUploading && (
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={handleRemove}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {!isUploading && (
              <div className="flex gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openFileDialog}
                  disabled={disabled}
                  className="flex-1"
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Change Image
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}