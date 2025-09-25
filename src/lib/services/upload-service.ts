import crypto from 'crypto'

export interface FileValidationOptions {
  maxSizeBytes: number
  allowedTypes: string[]
  allowedExtensions: string[]
  requireImageDimensions?: boolean
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
}

export interface FileValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  metadata?: {
    size: number
    type: string
    extension: string
    dimensions?: { width: number; height: number }
  }
}

export interface UploadResult {
  success: boolean
  url?: string
  key?: string
  error?: string
  metadata?: any
}

export class UploadService {
  // Default validation options for trade item images
  private static readonly DEFAULT_IMAGE_OPTIONS: FileValidationOptions = {
    maxSizeBytes: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
    requireImageDimensions: true,
    minWidth: 100,
    minHeight: 100,
    maxWidth: 2048,
    maxHeight: 2048
  }

  // Security validation patterns
  private static readonly SECURITY_PATTERNS = {
    maliciousExtensions: ['.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js'],
    suspiciousHeaders: ['PK', '<?php', '<script', 'MZ'], // ZIP, PHP, JS, EXE headers
    maxFileNameLength: 255
  }

  /**
   * Validate uploaded file for security and business rules
   */
  static async validateFile(
    file: File,
    options: Partial<FileValidationOptions> = {}
  ): Promise<FileValidationResult> {
    const config = { ...this.DEFAULT_IMAGE_OPTIONS, ...options }
    const errors: string[] = []
    const warnings: string[] = []

    // Basic file validation
    if (!file) {
      errors.push('No file provided')
      return { isValid: false, errors, warnings }
    }

    // File name security check
    const securityCheck = this.performSecurityCheck(file)
    if (!securityCheck.isSecure) {
      errors.push(...securityCheck.errors)
    }

    // Size validation
    if (file.size > config.maxSizeBytes) {
      errors.push(`File size ${this.formatBytes(file.size)} exceeds maximum ${this.formatBytes(config.maxSizeBytes)}`)
    }

    if (file.size === 0) {
      errors.push('File is empty')
    }

    // Type validation
    if (!config.allowedTypes.includes(file.type)) {
      errors.push(`File type ${file.type} not allowed. Allowed types: ${config.allowedTypes.join(', ')}`)
    }

    // Extension validation
    const extension = this.getFileExtension(file.name).toLowerCase()
    if (!config.allowedExtensions.includes(extension)) {
      errors.push(`File extension ${extension} not allowed. Allowed extensions: ${config.allowedExtensions.join(', ')}`)
    }

    // Image dimension validation
    let dimensions: { width: number; height: number } | undefined
    if (config.requireImageDimensions && file.type.startsWith('image/')) {
      try {
        dimensions = await this.getImageDimensions(file)

        if (config.minWidth && dimensions.width < config.minWidth) {
          errors.push(`Image width ${dimensions.width}px is less than minimum ${config.minWidth}px`)
        }

        if (config.minHeight && dimensions.height < config.minHeight) {
          errors.push(`Image height ${dimensions.height}px is less than minimum ${config.minHeight}px`)
        }

        if (config.maxWidth && dimensions.width > config.maxWidth) {
          errors.push(`Image width ${dimensions.width}px exceeds maximum ${config.maxWidth}px`)
        }

        if (config.maxHeight && dimensions.height > config.maxHeight) {
          errors.push(`Image height ${dimensions.height}px exceeds maximum ${config.maxHeight}px`)
        }

        // Add warnings for non-standard aspect ratios
        const aspectRatio = dimensions.width / dimensions.height
        if (aspectRatio < 0.5 || aspectRatio > 2.0) {
          warnings.push('Image has unusual aspect ratio - consider cropping to square or landscape')
        }
      } catch (error) {
        errors.push('Failed to read image dimensions')
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      metadata: {
        size: file.size,
        type: file.type,
        extension,
        dimensions
      }
    }
  }

  /**
   * Perform security validation on file
   */
  private static performSecurityCheck(file: File): {
    isSecure: boolean
    errors: string[]
  } {
    const errors: string[] = []

    // File name length check
    if (file.name.length > this.SECURITY_PATTERNS.maxFileNameLength) {
      errors.push('File name is too long')
    }

    // Malicious extension check
    const extension = this.getFileExtension(file.name).toLowerCase()
    if (this.SECURITY_PATTERNS.maliciousExtensions.includes(extension)) {
      errors.push('File extension is not allowed for security reasons')
    }

    // File name injection check
    if (file.name.includes('../') || file.name.includes('..\\')) {
      errors.push('File name contains path traversal characters')
    }

    // Null byte check
    if (file.name.includes('\x00')) {
      errors.push('File name contains null bytes')
    }

    // Control character check
    if (/[\x00-\x1f\x7f-\x9f]/.test(file.name)) {
      errors.push('File name contains control characters')
    }

    return {
      isSecure: errors.length === 0,
      errors
    }
  }

  /**
   * Get image dimensions from file
   */
  private static async getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const url = URL.createObjectURL(file)

      img.onload = () => {
        URL.revokeObjectURL(url)
        resolve({ width: img.naturalWidth, height: img.naturalHeight })
      }

      img.onerror = () => {
        URL.revokeObjectURL(url)
        reject(new Error('Failed to load image'))
      }

      img.src = url
    })
  }

  /**
   * Generate secure filename
   */
  static generateSecureFilename(originalName: string, userId: string): string {
    const extension = this.getFileExtension(originalName)
    const timestamp = Date.now()
    const randomBytes = crypto.randomBytes(8).toString('hex')
    const userHash = crypto.createHash('sha256').update(userId).digest('hex').substring(0, 8)

    return `${userHash}_${timestamp}_${randomBytes}${extension}`
  }

  /**
   * Generate upload path for organized storage
   */
  static generateUploadPath(
    filename: string,
    category: 'trade-images' | 'avatars' | 'temp' = 'trade-images'
  ): string {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${category}/${year}/${month}/${day}/${filename}`
  }

  /**
   * Create Cloudflare R2 signed upload URL
   */
  static async createSignedUploadUrl(
    filename: string,
    contentType: string,
    userId: string
  ): Promise<UploadResult> {
    try {
      // Generate secure filename and path
      const secureFilename = this.generateSecureFilename(filename, userId)
      const uploadPath = this.generateUploadPath(secureFilename)

      // In production, this would create a signed URL with Cloudflare R2
      // For now, simulate the process
      const mockSignedUrl = `https://trade-images.${process.env.CLOUDFLARE_R2_BUCKET}.r2.cloudflarestorage.com/${uploadPath}?X-Amz-Signature=mock`

      return {
        success: true,
        url: mockSignedUrl,
        key: uploadPath,
        metadata: {
          originalFilename: filename,
          secureFilename,
          contentType,
          uploadPath,
          expiresIn: 3600 // 1 hour
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Process uploaded file (resize, compress, generate thumbnails)
   */
  static async processUploadedImage(
    imageUrl: string,
    options: {
      generateThumbnail?: boolean
      thumbnailSize?: number
      compressQuality?: number
    } = {}
  ): Promise<{
    success: boolean
    processedUrl?: string
    thumbnailUrl?: string
    metadata?: any
    error?: string
  }> {
    try {
      const config = {
        generateThumbnail: true,
        thumbnailSize: 300,
        compressQuality: 0.8,
        ...options
      }

      // In production, this would:
      // 1. Download the image from R2
      // 2. Use Sharp or similar to process the image
      // 3. Generate thumbnail if requested
      // 4. Upload processed images back to R2
      // 5. Return URLs to processed images

      // For now, simulate processing
      const processedUrl = imageUrl.replace('r2.cloudflarestorage.com', 'processed.r2.cloudflarestorage.com')
      const thumbnailUrl = config.generateThumbnail
        ? imageUrl.replace('.', '_thumb.').replace('r2.cloudflarestorage.com', 'thumbs.r2.cloudflarestorage.com')
        : undefined

      return {
        success: true,
        processedUrl,
        thumbnailUrl,
        metadata: {
          originalSize: 1024 * 1024, // Mock 1MB original
          processedSize: 512 * 1024, // Mock 512KB processed
          thumbnailSize: config.generateThumbnail ? 32 * 1024 : 0, // Mock 32KB thumbnail
          compressionRatio: 0.5
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Verify file upload completion and integrity
   */
  static async verifyUpload(
    uploadUrl: string,
    expectedSize?: number,
    expectedHash?: string
  ): Promise<{
    isVerified: boolean
    actualSize?: number
    actualHash?: string
    error?: string
  }> {
    try {
      // In production, this would:
      // 1. HEAD request to check if file exists
      // 2. Verify file size matches expected
      // 3. Calculate and verify hash if provided
      // 4. Check file accessibility

      // Simulate verification
      return {
        isVerified: true,
        actualSize: expectedSize,
        actualHash: expectedHash
      }
    } catch (error: any) {
      return {
        isVerified: false,
        error: error.message
      }
    }
  }

  /**
   * Clean up failed or temporary uploads
   */
  static async cleanupFailedUploads(uploadKeys: string[]): Promise<{
    cleaned: number
    failed: string[]
  }> {
    const failed: string[] = []
    let cleaned = 0

    for (const key of uploadKeys) {
      try {
        // In production, this would delete from R2
        // For now, simulate cleanup
        cleaned++
      } catch (error) {
        failed.push(key)
      }
    }

    return { cleaned, failed }
  }

  /**
   * Helper functions
   */
  private static getFileExtension(filename: string): string {
    return filename.substring(filename.lastIndexOf('.'))
  }

  private static formatBytes(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  }

  /**
   * Get upload configuration for different file types
   */
  static getUploadConfig(
    type: 'trade-image' | 'avatar' | 'document'
  ): FileValidationOptions {
    const configs: Record<string, FileValidationOptions> = {
      'trade-image': this.DEFAULT_IMAGE_OPTIONS,
      'avatar': {
        ...this.DEFAULT_IMAGE_OPTIONS,
        maxSizeBytes: 2 * 1024 * 1024, // 2MB for avatars
        minWidth: 64,
        minHeight: 64,
        maxWidth: 512,
        maxHeight: 512
      },
      'document': {
        maxSizeBytes: 10 * 1024 * 1024, // 10MB
        allowedTypes: ['application/pdf', 'text/plain'],
        allowedExtensions: ['.pdf', '.txt'],
        requireImageDimensions: false
      }
    }

    return configs[type] || this.DEFAULT_IMAGE_OPTIONS
  }
}

// Type exports
export type FileCategory = 'trade-images' | 'avatars' | 'temp'
export type UploadConfigType = 'trade-image' | 'avatar' | 'document'