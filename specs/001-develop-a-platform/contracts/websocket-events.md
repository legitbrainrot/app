# WebSocket Events Specification

## Connection & Authentication

### Client → Server
```typescript
// Join trade room
{
  event: 'join-trade',
  data: {
    tradeId: string,
    token: string // JWT token
  }
}

// Leave trade room
{
  event: 'leave-trade',
  data: {
    tradeId: string
  }
}
```

### Server → Client
```typescript
// Connection acknowledged
{
  event: 'connected',
  data: {
    userId: string,
    userType: 'user' | 'middleman'
  }
}

// Join room success
{
  event: 'joined-trade',
  data: {
    tradeId: string,
    participants: Array<{
      userId: string,
      username: string,
      role: string
    }>
  }
}
```

## Chat Messages

### Client → Server
```typescript
// Send message
{
  event: 'send-message',
  data: {
    tradeId: string,
    content: string
  }
}
```

### Server → Client
```typescript
// New message broadcast
{
  event: 'new-message',
  data: {
    id: string,
    tradeId: string,
    userId: string,
    username: string,
    content: string,
    timestamp: string
  }
}
```

## Trade Status Updates

### Server → Client
```typescript
// Trade status changed
{
  event: 'trade-status-changed',
  data: {
    tradeId: string,
    status: 'NEGOTIATING' | 'PAYMENT_PENDING' | 'PAYMENT_COMPLETE' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED',
    timestamp: string,
    paymentDeadline?: string // Only for PAYMENT_PENDING
  }
}

// Payment received
{
  event: 'payment-received',
  data: {
    tradeId: string,
    userId: string,
    username: string,
    remainingTime: number // seconds until deadline
  }
}

// Payment deadline warning
{
  event: 'payment-deadline-warning',
  data: {
    tradeId: string,
    remainingTime: number // seconds
  }
}
```

## Middleman Events

### Server → Client (Middleman only)
```typescript
// New trade needs supervision
{
  event: 'trade-needs-middleman',
  data: {
    tradeId: string,
    itemName: string,
    price: number,
    participants: Array<{
      userId: string,
      username: string
    }>
  }
}
```

### Client → Server (Middleman only)
```typescript
// Accept middleman role
{
  event: 'accept-middleman-role',
  data: {
    tradeId: string
  }
}
```

### Server → Client (All trade participants)
```typescript
// Middleman joined
{
  event: 'middleman-joined',
  data: {
    tradeId: string,
    middlemanId: string,
    timestamp: string
  }
}
```

## Error Events

### Server → Client
```typescript
// Generic error
{
  event: 'error',
  data: {
    message: string,
    code?: string,
    tradeId?: string
  }
}

// Authentication error
{
  event: 'auth-error',
  data: {
    message: 'Invalid token' | 'Token expired' | 'Unauthorized'
  }
}

// Rate limit error
{
  event: 'rate-limit',
  data: {
    message: 'Too many messages',
    retryAfter: number // seconds
  }
}
```

## Room Management

### Room Naming Convention
- Trade rooms: `trade:${tradeId}`
- Middleman notification room: `middleman:notifications`

### Room Permissions
- **Trade rooms**: Only trade participants (creator + buyer) and assigned middleman
- **Middleman room**: Only authenticated middlemen

### Connection Lifecycle
1. Client connects with JWT token
2. Server validates token and identifies user type
3. Client joins relevant rooms based on permissions
4. Server broadcasts presence updates to room participants
5. Client receives real-time updates for subscribed events

### Cleanup
- Remove user from all rooms on disconnect
- Clear message rate limiting on disconnect
- Update participant presence in trade rooms