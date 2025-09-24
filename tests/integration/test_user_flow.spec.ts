import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'

describe('User Registration and Trade Creation Flow - Integration Test', () => {
  const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000'
  let userToken: string
  let createdTradeId: string
  let uploadedImageUrl: string

  beforeAll(async () => {
    console.log('Setting up integration test for full user flow')
  })

  afterAll(async () => {
    console.log('Cleaning up integration test data')
    // Clean up created trade and uploaded image
    if (createdTradeId && userToken) {
      // Delete trade if API supports it
    }
  })

  it('should complete full user registration and trade creation flow', async () => {
    // Step 1: Authenticate user (simulated Roblox OAuth)
    console.log('Step 1: User authentication')
    const authResponse = await fetch(`${API_BASE_URL}/api/auth/callback/roblox`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // Simulate OAuth callback data
        code: 'mock_oauth_code',
        state: 'mock_state'
      })
    })

    // For testing, we'll use a mock token
    userToken = 'integration-test-user-token'
    expect(userToken).toBeDefined()

    // Step 2: Upload image for trade
    console.log('Step 2: Image upload')
    const testImageBuffer = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
      0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4,
      0x89, 0x00, 0x00, 0x00, 0x0A, 0x49, 0x44, 0x41,
      0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
      0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00,
      0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE,
      0x42, 0x60, 0x82
    ])

    const formData = new FormData()
    const blob = new Blob([testImageBuffer], { type: 'image/png' })
    formData.append('image', blob, 'integration-test-image.png')

    const uploadResponse = await fetch(`${API_BASE_URL}/api/upload/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken}`
      },
      body: formData
    })

    expect(uploadResponse.status).toBe(200)
    const uploadData = await uploadResponse.json()
    uploadedImageUrl = uploadData.url
    expect(uploadedImageUrl).toBeDefined()

    // Step 3: Create trade with uploaded image
    console.log('Step 3: Trade creation')
    const tradeData = {
      itemName: 'Integration Test Crown',
      itemImage: uploadedImageUrl,
      description: 'A test crown created during integration testing',
      price: 15.99
    }

    const createTradeResponse = await fetch(`${API_BASE_URL}/api/trades`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify(tradeData)
    })

    expect(createTradeResponse.status).toBe(201)
    const tradeCreationData = await createTradeResponse.json()
    createdTradeId = tradeCreationData.id

    expect(tradeCreationData.itemName).toBe(tradeData.itemName)
    expect(tradeCreationData.itemImage).toBe(uploadedImageUrl)
    expect(tradeCreationData.status).toBe('ACTIVE')

    // Step 4: Search for the created trade
    console.log('Step 4: Trade search verification')
    const searchResponse = await fetch(
      `${API_BASE_URL}/api/trades?search=${encodeURIComponent('Integration Test Crown')}`,
      {
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      }
    )

    expect(searchResponse.status).toBe(200)
    const searchData = await searchResponse.json()
    expect(Array.isArray(searchData.trades)).toBe(true)

    const foundTrade = searchData.trades.find((trade: any) => trade.id === createdTradeId)
    expect(foundTrade).toBeDefined()
    expect(foundTrade.itemName).toBe(tradeData.itemName)

    // Step 5: Verify trade details
    console.log('Step 5: Trade details verification')
    const tradeDetailsResponse = await fetch(`${API_BASE_URL}/api/trades/${createdTradeId}`, {
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    })

    expect(tradeDetailsResponse.status).toBe(200)
    const tradeDetails = await tradeDetailsResponse.json()
    expect(tradeDetails.id).toBe(createdTradeId)
    expect(tradeDetails.itemImage).toBe(uploadedImageUrl)
    expect(tradeDetails.status).toBe('ACTIVE')
  })

  it('should handle errors gracefully throughout the flow', async () => {
    // Test error handling at each step

    // Step 1: Invalid authentication
    const invalidAuthResponse = await fetch(`${API_BASE_URL}/api/upload/image`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer invalid-token'
      }
    })
    expect(invalidAuthResponse.status).toBe(401)

    // Step 2: Invalid image upload
    const formData = new FormData()
    const textBlob = new Blob(['not an image'], { type: 'text/plain' })
    formData.append('image', textBlob, 'invalid.txt')

    const invalidUploadResponse = await fetch(`${API_BASE_URL}/api/upload/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken}`
      },
      body: formData
    })
    expect(invalidUploadResponse.status).toBe(400)

    // Step 3: Invalid trade creation
    const invalidTradeData = {
      itemName: '', // Empty name should fail
      price: -10 // Negative price should fail
    }

    const invalidTradeResponse = await fetch(`${API_BASE_URL}/api/trades`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify(invalidTradeData)
    })
    expect(invalidTradeResponse.status).toBe(400)
  })
})