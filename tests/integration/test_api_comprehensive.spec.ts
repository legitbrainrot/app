import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'

describe('Comprehensive API Integration - Integration Test', () => {
  const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000'
  let userTokens: { [key: string]: string } = {}
  let middlemanToken: string
  let testTradeIds: string[] = []

  beforeAll(async () => {
    console.log('Setting up comprehensive API integration test')

    // Setup multiple user tokens
    userTokens.creator1 = 'comprehensive-creator1-token'
    userTokens.creator2 = 'comprehensive-creator2-token'
    userTokens.buyer1 = 'comprehensive-buyer1-token'
    userTokens.buyer2 = 'comprehensive-buyer2-token'

    // Setup middleman
    const middlemanAuthResponse = await fetch(`${API_BASE_URL}/api/middleman/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: 'admin1',
        password: 'admin123'
      })
    })

    const middlemanAuthData = await middlemanAuthResponse.json()
    middlemanToken = middlemanAuthData.token
  })

  afterAll(async () => {
    console.log('Cleaning up comprehensive API test data')
  })

  it('should handle complex multi-user trading scenarios', async () => {
    // Step 1: Create multiple trades from different creators
    console.log('Step 1: Creating multiple trades from different users')

    const tradeDataSets = [
      {
        token: userTokens.creator1,
        data: {
          itemName: 'Legendary Sword',
          itemImage: 'https://example.com/sword.png',
          description: 'A powerful legendary sword',
          price: 100.00
        }
      },
      {
        token: userTokens.creator1,
        data: {
          itemName: 'Magic Shield',
          itemImage: 'https://example.com/shield.png',
          description: 'A protective magic shield',
          price: 75.00
        }
      },
      {
        token: userTokens.creator2,
        data: {
          itemName: 'Ancient Bow',
          itemImage: 'https://example.com/bow.png',
          description: 'An ancient bow with special powers',
          price: 85.00
        }
      }
    ]

    for (const tradeSet of tradeDataSets) {
      const response = await fetch(`${API_BASE_URL}/api/trades`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tradeSet.token}`
        },
        body: JSON.stringify(tradeSet.data)
      })

      expect(response.status).toBe(201)
      const tradeData = await response.json()
      testTradeIds.push(tradeData.id)
    }

    expect(testTradeIds).toHaveLength(3)

    // Step 2: Search and filter trades
    console.log('Step 2: Testing search and filtering functionality')

    // Search by item name
    const swordSearchResponse = await fetch(
      `${API_BASE_URL}/api/trades?search=${encodeURIComponent('Legendary Sword')}`,
      {
        headers: {
          'Authorization': `Bearer ${userTokens.buyer1}`
        }
      }
    )

    expect(swordSearchResponse.status).toBe(200)
    const swordSearchData = await swordSearchResponse.json()
    expect(Array.isArray(swordSearchData.trades)).toBe(true)
    expect(swordSearchData.trades.length).toBeGreaterThan(0)

    // Search by partial name
    const partialSearchResponse = await fetch(
      `${API_BASE_URL}/api/trades?search=${encodeURIComponent('Ancient')}`,
      {
        headers: {
          'Authorization': `Bearer ${userTokens.buyer1}`
        }
      }
    )

    expect(partialSearchResponse.status).toBe(200)
    const partialSearchData = await partialSearchResponse.json()
    expect(partialSearchData.trades.some((trade: any) => trade.itemName.includes('Ancient'))).toBe(true)

    // Filter by price range (if supported)
    const priceFilterResponse = await fetch(
      `${API_BASE_URL}/api/trades?min_price=80&max_price=90`,
      {
        headers: {
          'Authorization': `Bearer ${userTokens.buyer1}`
        }
      }
    )

    expect(priceFilterResponse.status).toBe(200)
    const priceFilterData = await priceFilterResponse.json()
    expect(Array.isArray(priceFilterData.trades)).toBe(true)

    // Step 3: Multiple buyers join different trades
    console.log('Step 3: Multiple buyers joining trades')

    // Buyer1 joins first two trades
    for (let i = 0; i < 2; i++) {
      const joinResponse = await fetch(`${API_BASE_URL}/api/trades/${testTradeIds[i]}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userTokens.buyer1}`
        }
      })
      expect(joinResponse.status).toBe(200)
    }

    // Buyer2 joins the third trade
    const buyer2JoinResponse = await fetch(`${API_BASE_URL}/api/trades/${testTradeIds[2]}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userTokens.buyer2}`
      }
    })
    expect(buyer2JoinResponse.status).toBe(200)

    // Step 4: Chat interactions across multiple trades
    console.log('Step 4: Testing chat functionality across trades')

    const chatScenarios = [
      {
        tradeId: testTradeIds[0],
        buyerToken: userTokens.buyer1,
        creatorToken: userTokens.creator1,
        messages: [
          { sender: 'buyer', content: 'Is this sword still available?' },
          { sender: 'creator', content: 'Yes! It\'s in excellent condition.' },
          { sender: 'buyer', content: 'Great! I\'ll proceed with the purchase.' }
        ]
      },
      {
        tradeId: testTradeIds[2],
        buyerToken: userTokens.buyer2,
        creatorToken: userTokens.creator2,
        messages: [
          { sender: 'buyer', content: 'Can you tell me more about the bow\'s special powers?' },
          { sender: 'creator', content: 'It has increased accuracy and fire damage bonus.' }
        ]
      }
    ]

    for (const scenario of chatScenarios) {
      for (const message of scenario.messages) {
        const token = message.sender === 'buyer' ? scenario.buyerToken : scenario.creatorToken

        const messageResponse = await fetch(`${API_BASE_URL}/api/trades/${scenario.tradeId}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ content: message.content })
        })

        expect(messageResponse.status).toBe(201)
      }

      // Verify message history
      const historyResponse = await fetch(`${API_BASE_URL}/api/trades/${scenario.tradeId}/messages`, {
        headers: {
          'Authorization': `Bearer ${scenario.buyerToken}`
        }
      })

      expect(historyResponse.status).toBe(200)
      const historyData = await historyResponse.json()
      expect(historyData.messages.length).toBe(scenario.messages.length)
    }

    // Step 5: Payment intents for multiple trades
    console.log('Step 5: Creating payment intents for multiple trades')

    const paymentScenarios = [
      { tradeId: testTradeIds[0], buyerToken: userTokens.buyer1 },
      { tradeId: testTradeIds[2], buyerToken: userTokens.buyer2 }
    ]

    for (const scenario of paymentScenarios) {
      const paymentResponse = await fetch(`${API_BASE_URL}/api/trades/${scenario.tradeId}/payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${scenario.buyerToken}`
        }
      })

      expect(paymentResponse.status).toBe(201)
      const paymentData = await paymentResponse.json()
      expect(paymentData.clientSecret).toMatch(/^pi_.*_secret_.*/)
    }

    // Step 6: Middleman processes trades with different outcomes
    console.log('Step 6: Middleman processing with different outcomes')

    // Approve first trade
    const approval1Response = await fetch(`${API_BASE_URL}/api/middleman/trades/${testTradeIds[0]}/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${middlemanToken}`
      },
      body: JSON.stringify({
        approved: true,
        notes: 'Legendary sword trade completed successfully. Both parties satisfied.'
      })
    })

    expect(approval1Response.status).toBe(200)
    const approval1Data = await approval1Response.json()
    expect(approval1Data.status).toBe('COMPLETED')

    // Reject second trade (no payment was created for this one)
    // We'll skip this since no payment was made

    // Approve third trade
    const approval3Response = await fetch(`${API_BASE_URL}/api/middleman/trades/${testTradeIds[2]}/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${middlemanToken}`
      },
      body: JSON.stringify({
        approved: true,
        notes: 'Ancient bow trade approved. Item matches description.'
      })
    })

    expect(approval3Response.status).toBe(200)
    const approval3Data = await approval3Response.json()
    expect(approval3Data.status).toBe('COMPLETED')

    // Step 7: Verify final trade states
    console.log('Step 7: Verifying final trade states')

    for (const tradeId of [testTradeIds[0], testTradeIds[2]]) {
      const tradeResponse = await fetch(`${API_BASE_URL}/api/trades/${tradeId}`, {
        headers: {
          'Authorization': `Bearer ${userTokens.buyer1}`
        }
      })

      expect(tradeResponse.status).toBe(200)
      const tradeData = await tradeResponse.json()
      expect(tradeData.status).toBe('COMPLETED')
      expect(tradeData).toHaveProperty('completedAt')
    }
  })

  it('should handle error scenarios gracefully across the API', async () => {
    console.log('Testing comprehensive error handling')

    // Test authentication errors
    const noAuthResponse = await fetch(`${API_BASE_URL}/api/trades`)
    expect(noAuthResponse.status).toBe(401)

    const badAuthResponse = await fetch(`${API_BASE_URL}/api/trades`, {
      headers: {
        'Authorization': 'Bearer invalid-token'
      }
    })
    expect(badAuthResponse.status).toBe(401)

    // Test validation errors
    const invalidTradeResponse = await fetch(`${API_BASE_URL}/api/trades`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userTokens.creator1}`
      },
      body: JSON.stringify({
        itemName: '', // Empty name
        price: -10    // Invalid price
      })
    })
    expect(invalidTradeResponse.status).toBe(400)

    // Test resource not found errors
    const notFoundResponse = await fetch(`${API_BASE_URL}/api/trades/non-existent-id`, {
      headers: {
        'Authorization': `Bearer ${userTokens.buyer1}`
      }
    })
    expect(notFoundResponse.status).toBe(404)

    // Test permission errors
    const outsiderToken = 'outsider-token'
    const permissionResponse = await fetch(`${API_BASE_URL}/api/trades/${testTradeIds[0]}/messages`, {
      headers: {
        'Authorization': `Bearer ${outsiderToken}`
      }
    })
    expect(permissionResponse.status).toBe(403)
  })

  it('should maintain data consistency across operations', async () => {
    console.log('Testing data consistency across operations')

    // Create a trade and verify it appears in search results
    const consistencyTradeData = {
      itemName: 'Consistency Test Item',
      itemImage: 'https://example.com/consistency.png',
      description: 'Item for testing data consistency',
      price: 30.00
    }

    const createResponse = await fetch(`${API_BASE_URL}/api/trades`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userTokens.creator1}`
      },
      body: JSON.stringify(consistencyTradeData)
    })

    const createdTrade = await createResponse.json()
    const consistencyTradeId = createdTrade.id

    // Verify the trade appears in general listing
    const listResponse = await fetch(`${API_BASE_URL}/api/trades`, {
      headers: {
        'Authorization': `Bearer ${userTokens.buyer1}`
      }
    })

    const listData = await listResponse.json()
    const foundInList = listData.trades.some((trade: any) => trade.id === consistencyTradeId)
    expect(foundInList).toBe(true)

    // Join the trade and verify participant count/status changes
    const joinResponse = await fetch(`${API_BASE_URL}/api/trades/${consistencyTradeId}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userTokens.buyer1}`
      }
    })
    expect(joinResponse.status).toBe(200)

    // Send a message and verify it appears in chat history
    const messageResponse = await fetch(`${API_BASE_URL}/api/trades/${consistencyTradeId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userTokens.buyer1}`
      },
      body: JSON.stringify({ content: 'Consistency test message' })
    })

    expect(messageResponse.status).toBe(201)
    const messageData = await messageResponse.json()

    // Verify message appears in chat history
    const chatResponse = await fetch(`${API_BASE_URL}/api/trades/${consistencyTradeId}/messages`, {
      headers: {
        'Authorization': `Bearer ${userTokens.buyer1}`
      }
    })

    const chatData = await chatResponse.json()
    const foundMessage = chatData.messages.some((msg: any) => msg.id === messageData.id)
    expect(foundMessage).toBe(true)

    // Create payment intent and verify trade state
    const paymentResponse = await fetch(`${API_BASE_URL}/api/trades/${consistencyTradeId}/payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userTokens.buyer1}`
      }
    })

    expect(paymentResponse.status).toBe(201)

    // Complete trade and verify final state
    const completionResponse = await fetch(`${API_BASE_URL}/api/middleman/trades/${consistencyTradeId}/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${middlemanToken}`
      },
      body: JSON.stringify({
        approved: true,
        notes: 'Consistency test completed successfully'
      })
    })

    expect(completionResponse.status).toBe(200)

    // Verify final trade state
    const finalStateResponse = await fetch(`${API_BASE_URL}/api/trades/${consistencyTradeId}`, {
      headers: {
        'Authorization': `Bearer ${userTokens.buyer1}`
      }
    })

    const finalStateData = await finalStateResponse.json()
    expect(finalStateData.status).toBe('COMPLETED')
    expect(finalStateData).toHaveProperty('completedAt')
  })
})