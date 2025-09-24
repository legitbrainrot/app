import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'

describe('POST /api/trades/{id}/payment-intent - Contract Test', () => {
  const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000'
  let authToken: string
  let testTradeId: string

  beforeAll(async () => {
    console.log('Setting up test data for payment intent creation')
    authToken = 'test-auth-token'
    testTradeId = 'test-trade-for-payment'
  })

  afterAll(async () => {
    console.log('Cleaning up payment intent test data')
  })

  it('should create payment intent successfully', async () => {
    const response = await fetch(`${API_BASE_URL}/api/trades/${testTradeId}/payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    })

    const data = await response.json()

    // Contract expectations
    expect(response.status).toBe(201)
    expect(data).toHaveProperty('clientSecret')
    expect(data).toHaveProperty('paymentId')
    expect(typeof data.clientSecret).toBe('string')
    expect(data.clientSecret).toMatch(/^pi_.*_secret_.*/)
  })

  it('should return 401 without authentication', async () => {
    const response = await fetch(`${API_BASE_URL}/api/trades/${testTradeId}/payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    expect(response.status).toBe(401)
  })

  it('should return 404 for non-existent trade', async () => {
    const response = await fetch(`${API_BASE_URL}/api/trades/non-existent-trade/payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    })

    expect(response.status).toBe(404)
  })

  it('should return 403 for non-participant user', async () => {
    const nonParticipantToken = 'non-participant-token'

    const response = await fetch(`${API_BASE_URL}/api/trades/${testTradeId}/payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${nonParticipantToken}`
      }
    })

    expect(response.status).toBe(403)
  })

  it('should return 400 when trade is not in correct status for payment', async () => {
    const completedTradeId = 'completed-trade-id'

    const response = await fetch(`${API_BASE_URL}/api/trades/${completedTradeId}/payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    })

    expect(response.status).toBe(400)
  })

  it('should return 400 when user already has pending payment', async () => {
    // Create first payment intent
    await fetch(`${API_BASE_URL}/api/trades/${testTradeId}/payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    })

    // Try to create second payment intent
    const response = await fetch(`${API_BASE_URL}/api/trades/${testTradeId}/payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    })

    expect(response.status).toBe(400)
  })
})