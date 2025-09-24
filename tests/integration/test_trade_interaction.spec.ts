import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'

describe('Trade Joining and Messaging Flow - Integration Test', () => {
  const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000'
  let creatorToken: string
  let buyerToken: string
  let testTradeId: string
  let createdMessageId: string

  beforeAll(async () => {
    console.log('Setting up trade interaction integration test')

    // Setup two different users
    creatorToken = 'integration-test-creator-token'
    buyerToken = 'integration-test-buyer-token'
    testTradeId = 'integration-test-trade-id'
  })

  afterAll(async () => {
    console.log('Cleaning up trade interaction test data')
  })

  it('should complete full trade interaction flow', async () => {
    // Step 1: Create a trade as the creator
    console.log('Step 1: Creator creates trade')
    const tradeData = {
      itemName: 'Interaction Test Sword',
      itemImage: 'https://example.com/sword.png',
      description: 'A test sword for interaction testing',
      price: 20.50
    }

    const createResponse = await fetch(`${API_BASE_URL}/api/trades`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${creatorToken}`
      },
      body: JSON.stringify(tradeData)
    })

    expect(createResponse.status).toBe(201)
    const tradeCreationData = await createResponse.json()
    testTradeId = tradeCreationData.id

    // Step 2: Buyer searches and finds the trade
    console.log('Step 2: Buyer searches for trades')
    const searchResponse = await fetch(
      `${API_BASE_URL}/api/trades?search=${encodeURIComponent('Interaction Test')}`,
      {
        headers: {
          'Authorization': `Bearer ${buyerToken}`
        }
      }
    )

    expect(searchResponse.status).toBe(200)
    const searchData = await searchResponse.json()
    const foundTrade = searchData.trades.find((trade: any) => trade.id === testTradeId)
    expect(foundTrade).toBeDefined()

    // Step 3: Buyer joins the trade
    console.log('Step 3: Buyer joins the trade')
    const joinResponse = await fetch(`${API_BASE_URL}/api/trades/${testTradeId}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${buyerToken}`
      }
    })

    expect(joinResponse.status).toBe(200)
    const joinData = await joinResponse.json()
    expect(joinData.tradeId).toBe(testTradeId)

    // Step 4: Buyer sends initial message
    console.log('Step 4: Buyer sends message')
    const messageData = {
      content: 'Hello! I am interested in purchasing your sword. Is it still available?'
    }

    const sendMessageResponse = await fetch(`${API_BASE_URL}/api/trades/${testTradeId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${buyerToken}`
      },
      body: JSON.stringify(messageData)
    })

    expect(sendMessageResponse.status).toBe(201)
    const messageResponseData = await sendMessageResponse.json()
    createdMessageId = messageResponseData.id
    expect(messageResponseData.content).toBe(messageData.content)

    // Step 5: Creator retrieves messages
    console.log('Step 5: Creator retrieves chat history')
    const getMessagesResponse = await fetch(`${API_BASE_URL}/api/trades/${testTradeId}/messages`, {
      headers: {
        'Authorization': `Bearer ${creatorToken}`
      }
    })

    expect(getMessagesResponse.status).toBe(200)
    const messagesData = await getMessagesResponse.json()
    expect(Array.isArray(messagesData.messages)).toBe(true)
    expect(messagesData.messages.length).toBeGreaterThan(0)

    const sentMessage = messagesData.messages.find((msg: any) => msg.id === createdMessageId)
    expect(sentMessage).toBeDefined()
    expect(sentMessage.content).toBe(messageData.content)

    // Step 6: Creator responds to the message
    console.log('Step 6: Creator responds to buyer')
    const creatorResponseData = {
      content: 'Yes, the sword is still available! The price is $20.50. Would you like to proceed with the purchase?'
    }

    const creatorMessageResponse = await fetch(`${API_BASE_URL}/api/trades/${testTradeId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${creatorToken}`
      },
      body: JSON.stringify(creatorResponseData)
    })

    expect(creatorMessageResponse.status).toBe(201)
    const creatorMessageData = await creatorMessageResponse.json()
    expect(creatorMessageData.content).toBe(creatorResponseData.content)

    // Step 7: Buyer retrieves updated messages
    console.log('Step 7: Buyer sees creator response')
    const updatedMessagesResponse = await fetch(`${API_BASE_URL}/api/trades/${testTradeId}/messages`, {
      headers: {
        'Authorization': `Bearer ${buyerToken}`
      }
    })

    expect(updatedMessagesResponse.status).toBe(200)
    const updatedMessagesData = await updatedMessagesResponse.json()
    expect(updatedMessagesData.messages.length).toBeGreaterThanOrEqual(2)

    // Step 8: Buyer creates payment intent
    console.log('Step 8: Buyer initiates payment')
    const paymentResponse = await fetch(`${API_BASE_URL}/api/trades/${testTradeId}/payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${buyerToken}`
      }
    })

    expect(paymentResponse.status).toBe(201)
    const paymentData = await paymentResponse.json()
    expect(paymentData).toHaveProperty('clientSecret')
    expect(paymentData).toHaveProperty('paymentId')
  })

  it('should handle access control properly', async () => {
    // Test that non-participants cannot access trade messages
    const outsiderToken = 'outsider-token'

    // Outsider tries to view messages
    const unauthorizedMessagesResponse = await fetch(`${API_BASE_URL}/api/trades/${testTradeId}/messages`, {
      headers: {
        'Authorization': `Bearer ${outsiderToken}`
      }
    })
    expect(unauthorizedMessagesResponse.status).toBe(403)

    // Outsider tries to send message
    const unauthorizedSendResponse = await fetch(`${API_BASE_URL}/api/trades/${testTradeId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${outsiderToken}`
      },
      body: JSON.stringify({ content: 'Unauthorized message' })
    })
    expect(unauthorizedSendResponse.status).toBe(403)

    // Outsider tries to create payment intent
    const unauthorizedPaymentResponse = await fetch(`${API_BASE_URL}/api/trades/${testTradeId}/payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${outsiderToken}`
      }
    })
    expect(unauthorizedPaymentResponse.status).toBe(403)
  })

  it('should prevent duplicate joins', async () => {
    // Buyer tries to join the same trade again
    const duplicateJoinResponse = await fetch(`${API_BASE_URL}/api/trades/${testTradeId}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${buyerToken}`
      }
    })

    expect(duplicateJoinResponse.status).toBe(400)
  })

  it('should handle message pagination', async () => {
    // Send multiple messages to test pagination
    for (let i = 1; i <= 15; i++) {
      const messageData = {
        content: `Test message ${i} for pagination testing`
      }

      await fetch(`${API_BASE_URL}/api/trades/${testTradeId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${buyerToken}`
        },
        body: JSON.stringify(messageData)
      })
    }

    // Test pagination with limit
    const paginatedResponse = await fetch(
      `${API_BASE_URL}/api/trades/${testTradeId}/messages?limit=10`,
      {
        headers: {
          'Authorization': `Bearer ${buyerToken}`
        }
      }
    )

    expect(paginatedResponse.status).toBe(200)
    const paginatedData = await paginatedResponse.json()
    expect(paginatedData.messages.length).toBeLessThanOrEqual(10)
  })
})