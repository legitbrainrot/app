import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'

describe('GET /api/trades/{id}/messages - Contract Test', () => {
  const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000'
  let authToken: string
  let testTradeId: string

  beforeAll(async () => {
    console.log('Setting up test data for chat history')
    authToken = 'test-auth-token'
    testTradeId = 'test-trade-with-messages'
  })

  afterAll(async () => {
    console.log('Cleaning up chat test data')
  })

  it('should return chat messages for trade participant', async () => {
    const response = await fetch(`${API_BASE_URL}/api/trades/${testTradeId}/messages`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })

    const data = await response.json()

    // Contract expectations
    expect(response.status).toBe(200)
    expect(data).toHaveProperty('messages')
    expect(Array.isArray(data.messages)).toBe(true)

    // Check message structure if messages exist
    if (data.messages.length > 0) {
      const message = data.messages[0]
      expect(message).toHaveProperty('id')
      expect(message).toHaveProperty('tradeId')
      expect(message).toHaveProperty('userId')
      expect(message).toHaveProperty('content')
      expect(message).toHaveProperty('timestamp')
      expect(message).toHaveProperty('user')
    }
  })

  it('should return 401 without authentication', async () => {
    const response = await fetch(`${API_BASE_URL}/api/trades/${testTradeId}/messages`)

    expect(response.status).toBe(401)
  })

  it('should return 404 for non-existent trade', async () => {
    const response = await fetch(`${API_BASE_URL}/api/trades/non-existent-trade/messages`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })

    expect(response.status).toBe(404)
  })

  it('should return 403 for non-participant user', async () => {
    const nonParticipantToken = 'non-participant-token'

    const response = await fetch(`${API_BASE_URL}/api/trades/${testTradeId}/messages`, {
      headers: {
        'Authorization': `Bearer ${nonParticipantToken}`
      }
    })

    expect(response.status).toBe(403)
  })

  it('should support pagination with limit and before parameters', async () => {
    const response = await fetch(
      `${API_BASE_URL}/api/trades/${testTradeId}/messages?limit=10&before=2024-01-01T00:00:00.000Z`,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      }
    )

    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.messages.length).toBeLessThanOrEqual(10)
  })
})