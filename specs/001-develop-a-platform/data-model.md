# Data Model: Roblox Trading Platform

## Core Entities

### User
**Purpose**: Represents a Roblox-authenticated user who can create and participate in trades
```prisma
model User {
  id          String   @id @default(cuid())
  robloxId    String   @unique
  username    String
  avatar      String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  createdTrades     Trade[] @relation("TradeCreator")
  participatingTrades TradeParticipant[]
  sentMessages      ChatMessage[]
  payments          Payment[]

  @@map("users")
}
```
**Validation Rules**:
- robloxId must be unique and non-null
- username must be non-empty string
- avatar URL must be valid if provided

### Middleman
**Purpose**: Verified human supervisors who validate in-game exchanges
```prisma
model Middleman {
  id          String   @id @default(cuid())
  userId      String   @unique
  password    String   // Hashed password
  isAvailable Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  supervisedTrades Trade[]

  @@map("middlemen")
}
```
**Validation Rules**:
- userId must reference valid user
- password must be hashed using bcrypt
- isAvailable defaults to true

### Trade
**Purpose**: A trading listing created by a user offering a Brainrot item
```prisma
enum TradeStatus {
  ACTIVE
  NEGOTIATING
  PAYMENT_PENDING
  PAYMENT_COMPLETE
  IN_PROGRESS
  COMPLETED
  CANCELLED
  REFUNDED
}

model Trade {
  id            String      @id @default(cuid())
  creatorId     String
  itemName      String
  itemImage     String
  description   String?
  price         Decimal
  status        TradeStatus @default(ACTIVE)
  paymentDeadline DateTime?
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  middlemanId   String?

  // Relations
  creator       User         @relation("TradeCreator", fields: [creatorId], references: [id])
  participants  TradeParticipant[]
  chatMessages  ChatMessage[]
  payments      Payment[]
  middleman     Middleman?   @relation(fields: [middlemanId], references: [id])

  @@map("trades")
}
```
**State Transitions**:
- ACTIVE → NEGOTIATING (when user contacts creator)
- NEGOTIATING → PAYMENT_PENDING (when terms agreed)
- PAYMENT_PENDING → PAYMENT_COMPLETE (when both users pay)
- PAYMENT_COMPLETE → IN_PROGRESS (when middleman joins)
- IN_PROGRESS → COMPLETED (when middleman approves)
- Any → CANCELLED (timeout or user cancellation)
- PAYMENT_PENDING → REFUNDED (partial payment timeout)

### TradeParticipant
**Purpose**: Links users to trades they're participating in
```prisma
model TradeParticipant {
  id      String @id @default(cuid())
  tradeId String
  userId  String
  role    String // "buyer" | "creator"
  joinedAt DateTime @default(now())

  // Relations
  trade   Trade @relation(fields: [tradeId], references: [id], onDelete: Cascade)
  user    User  @relation(fields: [userId], references: [id])

  @@unique([tradeId, userId])
  @@map("trade_participants")
}
```

### ChatMessage
**Purpose**: Real-time messages in trade negotiation rooms
```prisma
model ChatMessage {
  id        String   @id @default(cuid())
  tradeId   String
  userId    String
  content   String
  timestamp DateTime @default(now())

  // Relations
  trade     Trade @relation(fields: [tradeId], references: [id], onDelete: Cascade)
  user      User  @relation(fields: [userId], references: [id])

  @@map("chat_messages")
}
```
**Validation Rules**:
- content must be non-empty and <= 500 characters
- userId must be participant in the trade

### Payment
**Purpose**: Stripe payment transactions linked to trades
```prisma
enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}

model Payment {
  id              String        @id @default(cuid())
  tradeId         String
  userId          String
  stripeIntentId  String        @unique
  amount          Decimal
  status          PaymentStatus @default(PENDING)
  createdAt       DateTime      @default(now())
  completedAt     DateTime?

  // Relations
  trade           Trade @relation(fields: [tradeId], references: [id])
  user            User  @relation(fields: [userId], references: [id])

  @@map("payments")
}
```
**Business Rules**:
- Each trade can have maximum 2 payments (buyer + creator)
- Payments are held in escrow until trade completion
- Auto-refund if payment deadline expires

## Relationships Summary

```
User (1) ←→ (N) Trade (creator)
User (1) ←→ (N) TradeParticipant
Trade (1) ←→ (N) TradeParticipant
Trade (1) ←→ (N) ChatMessage
Trade (1) ←→ (N) Payment
Trade (1) ←→ (0..1) Middleman
User (1) ←→ (N) ChatMessage
User (1) ←→ (N) Payment
Middleman (1) ←→ (N) Trade
```

## Indexes for Performance

```sql
-- Trade search optimization
CREATE INDEX idx_trades_status_created ON trades(status, created_at DESC);
CREATE INDEX idx_trades_item_name ON trades USING GIN (to_tsvector('english', item_name));

-- Chat message retrieval
CREATE INDEX idx_chat_messages_trade_timestamp ON chat_messages(trade_id, timestamp DESC);

-- Payment lookups
CREATE INDEX idx_payments_stripe_intent ON payments(stripe_intent_id);
CREATE INDEX idx_payments_trade_status ON payments(trade_id, status);

-- User trade history
CREATE INDEX idx_trades_creator_created ON trades(creator_id, created_at DESC);
CREATE INDEX idx_trade_participants_user ON trade_participants(user_id);
```