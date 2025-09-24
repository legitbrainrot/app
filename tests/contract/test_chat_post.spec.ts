import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'

describe('POST /api/trades/{id}/messages - Contract Test', () => {
  const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000'
  let authToken: string
  let testTradeId: string

  beforeAll(async () => {
    console.log('Setting up test data for sending chat messages')
    authToken = 'test-auth-token'
    testTradeId = 'test-trade-for-messaging'
  })

  afterAll(async () => {
    console.log('Cleaning up sent message test data')
  })

  it('should send message successfully', async () => {
    const messageData = {
      content: 'Hello, I am interested in your item!'
    }

    const response = await fetch(`${API_BASE_URL}/api/trades/${testTradeId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(messageData)
    })

    const data = await response.json()

    // Contract expectations
    expect(response.status).toBe(201)
    expect(data).toHaveProperty('id')
    expect(data.content).toBe(messageData.content)
    expect(data).toHaveProperty('tradeId')
    expect(data).toHaveProperty('userId')
    expect(data).toHaveProperty('timestamp')
  })

  it('should return 401 without authentication', async () => {
    const messageData = {
      content: 'Test message'
    }

    const response = await fetch(`${API_BASE_URL}/api/trades/${testTradeId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(messageData)
    })

    expect(response.status).toBe(401)
  })

  it('should return 400 with empty content', async () => {
    const messageData = {
      content: ''
    }

    const response = await fetch(`${API_BASE_URL}/api/trades/${testTradeId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(messageData)
    })

    expect(response.status).toBe(400)
  })

  it('should return 400 with content too long', async () => {
    const messageData = {
      content: 'x'.repeat(501) // Over 500 character limit
    }

    const response = await fetch(`${API_BASE_URL}/api/trades/${testTradeId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(messageData)
    })

    expect(response.status).toBe(400)
  })

  it('should return 404 for non-existent trade', async () => {
    const messageData = {
      content: 'Test message'
    }

    const response = await fetch(`${API_BASE_URL}/api/trades/non-existent-trade/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(messageData)
    })

    expect(response.status).toBe(404)
  })

  it('should return 403 for non-participant user', async () => {
    const messageData = {
      content: 'Test message'
    }
    const nonParticipantToken = 'non-participant-token'

    const response = await fetch(`${API_BASE_URL}/api/trades/${testTradeId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${nonParticipantToken}`
      },
      body: JSON.stringify(messageData)
    })

    expect(response.status).toBe(403)
  })

  it('should return 400 without required content field', async () => {
    const response = await fetch(`${API_BASE_URL}/api/trades/${testTradeId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({})
    })

    expect(response.status).toBe(400)
  })
})