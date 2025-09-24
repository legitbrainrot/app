import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'

describe('GET /api/trades - Contract Test', () => {
  const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000'

  beforeAll(async () => {
    // Setup test data
    console.log('Setting up test data for trades search')
  })

  afterAll(async () => {
    // Cleanup test data
    console.log('Cleaning up test data')
  })

  it('should return list of trades without query', async () => {
    const response = await fetch(`${API_BASE_URL}/api/trades`)
    const data = await response.json()

    // Contract expectations
    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('application/json')
    expect(data).toHaveProperty('trades')
    expect(Array.isArray(data.trades)).toBe(true)
  })

  it('should return filtered trades with search query', async () => {
    const response = await fetch(`${API_BASE_URL}/api/trades?q=brainrot`)
    const data = await response.json()

    // Contract expectations
    expect(response.status).toBe(200)
    expect(data).toHaveProperty('trades')
    expect(Array.isArray(data.trades)).toBe(true)

    // Each trade should contain required fields
    if (data.trades.length > 0) {
      const trade = data.trades[0]
      expect(trade).toHaveProperty('id')
      expect(trade).toHaveProperty('itemName')
      expect(trade).toHaveProperty('itemImage')
      expect(trade).toHaveProperty('price')
      expect(trade).toHaveProperty('status')
      expect(trade).toHaveProperty('createdAt')
    }
  })

  it('should return trades filtered by status', async () => {
    const response = await fetch(`${API_BASE_URL}/api/trades?status=ACTIVE`)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('trades')

    // All returned trades should have ACTIVE status
    data.trades.forEach((trade: any) => {
      expect(trade.status).toBe('ACTIVE')
    })
  })

  it('should return 400 for invalid status filter', async () => {
    const response = await fetch(`${API_BASE_URL}/api/trades?status=INVALID`)

    expect(response.status).toBe(400)
  })

  it('should return empty array for non-existent search', async () => {
    const response = await fetch(`${API_BASE_URL}/api/trades?q=nonexistentitem123`)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.trades).toHaveLength(0)
  })
})