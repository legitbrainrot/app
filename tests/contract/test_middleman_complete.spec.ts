import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'

describe('POST /api/middleman/trades/{id}/complete - Contract Test', () => {
  const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000'
  let middlemanToken: string
  let testTradeId: string

  beforeAll(async () => {
    console.log('Setting up middleman authentication for trade completion')

    // Authenticate as middleman first
    const authResponse = await fetch(`${API_BASE_URL}/api/middleman/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: 'admin1',
        password: 'admin123'
      })
    })

    const authData = await authResponse.json()
    middlemanToken = authData.token
    testTradeId = 'test-trade-for-completion'
  })

  afterAll(async () => {
    console.log('Cleaning up middleman completion test data')
  })

  it('should complete trade successfully with valid approval', async () => {
    const completionData = {
      approved: true,
      notes: 'Trade verified, both parties satisfied'
    }

    const response = await fetch(`${API_BASE_URL}/api/middleman/trades/${testTradeId}/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${middlemanToken}`
      },
      body: JSON.stringify(completionData)
    })

    const data = await response.json()

    // Contract expectations
    expect(response.status).toBe(200)
    expect(data).toHaveProperty('message')
    expect(data).toHaveProperty('tradeId')
    expect(data.tradeId).toBe(testTradeId)
    expect(data).toHaveProperty('status')
    expect(data.status).toBe('COMPLETED')
    expect(data).toHaveProperty('completedAt')
  })

  it('should reject trade with disapproval', async () => {
    const rejectionData = {
      approved: false,
      notes: 'Item condition does not match description'
    }

    const response = await fetch(`${API_BASE_URL}/api/middleman/trades/${testTradeId}/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${middlemanToken}`
      },
      body: JSON.stringify(rejectionData)
    })

    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('tradeId')
    expect(data.status).toBe('CANCELLED')
    expect(data).toHaveProperty('notes')
    expect(data.notes).toBe(rejectionData.notes)
  })

  it('should return 401 without middleman authentication', async () => {
    const completionData = {
      approved: true,
      notes: 'Test completion'
    }

    const response = await fetch(`${API_BASE_URL}/api/middleman/trades/${testTradeId}/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(completionData)
    })

    expect(response.status).toBe(401)
  })

  it('should return 403 with regular user token', async () => {
    const userToken = 'regular-user-token'
    const completionData = {
      approved: true,
      notes: 'Unauthorized attempt'
    }

    const response = await fetch(`${API_BASE_URL}/api/middleman/trades/${testTradeId}/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify(completionData)
    })

    expect(response.status).toBe(403)
  })

  it('should return 404 for non-existent trade', async () => {
    const completionData = {
      approved: true,
      notes: 'Test completion'
    }

    const response = await fetch(`${API_BASE_URL}/api/middleman/trades/non-existent-trade/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${middlemanToken}`
      },
      body: JSON.stringify(completionData)
    })

    expect(response.status).toBe(404)
  })

  it('should return 400 without required approved field', async () => {
    const incompleteData = {
      notes: 'Missing approved field'
    }

    const response = await fetch(`${API_BASE_URL}/api/middleman/trades/${testTradeId}/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${middlemanToken}`
      },
      body: JSON.stringify(incompleteData)
    })

    expect(response.status).toBe(400)
  })

  it('should return 400 when trade is not in correct status for completion', async () => {
    const alreadyCompletedTradeId = 'already-completed-trade'
    const completionData = {
      approved: true,
      notes: 'Attempting to complete already finished trade'
    }

    const response = await fetch(`${API_BASE_URL}/api/middleman/trades/${alreadyCompletedTradeId}/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${middlemanToken}`
      },
      body: JSON.stringify(completionData)
    })

    expect(response.status).toBe(400)
  })

  it('should validate notes field when provided', async () => {
    const dataWithLongNotes = {
      approved: true,
      notes: 'x'.repeat(1001) // Over 1000 character limit
    }

    const response = await fetch(`${API_BASE_URL}/api/middleman/trades/${testTradeId}/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${middlemanToken}`
      },
      body: JSON.stringify(dataWithLongNotes)
    })

    expect(response.status).toBe(400)
  })
})