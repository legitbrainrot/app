import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser } from '@/lib/middleware'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { randomUUID } from 'crypto'

const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!
  }
})

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(request: NextRequest) {
  try {
    const authResult = await authenticateUser(request)
    if (!authResult.success) {
      return authResult.response
    }

    const formData = await request.formData()
    const file = formData.get('image') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Supported types: JPEG, PNG, GIF, WebP' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB' },
        { status: 400 }
      )
    }

    // Validate file is not empty
    if (file.size === 0) {
      return NextResponse.json(
        { error: 'File is empty' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop() || 'jpg'
    const fileName = `${randomUUID()}.${fileExtension}`

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Basic image validation - check for image headers
    const isPNG = buffer.length > 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]))
    const isJPEG = buffer.length > 3 && buffer.subarray(0, 3).equals(Buffer.from([0xFF, 0xD8, 0xFF]))
    const isGIF = buffer.length > 6 && (
      buffer.subarray(0, 6).equals(Buffer.from('GIF87a')) ||
      buffer.subarray(0, 6).equals(Buffer.from('GIF89a'))
    )
    const isWebP = buffer.length > 12 &&
      buffer.subarray(0, 4).equals(Buffer.from('RIFF')) &&
      buffer.subarray(8, 12).equals(Buffer.from('WEBP'))

    if (!isPNG && !isJPEG && !isGIF && !isWebP) {
      return NextResponse.json(
        { error: 'Invalid image file format' },
        { status: 400 }
      )
    }

    // Upload to Cloudflare R2
    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
      Key: `images/${fileName}`,
      Body: buffer,
      ContentType: file.type,
      ContentLength: buffer.length
    })

    await s3Client.send(uploadCommand)

    // Construct public URL
    const imageUrl = `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/images/${fileName}`

    return NextResponse.json({
      url: imageUrl,
      filename: fileName,
      size: file.size,
      uploadedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error uploading image:', error)

    if (error instanceof Error && error.name === 'CredentialsError') {
      return NextResponse.json(
        { error: 'Storage service configuration error' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}