# Quickstart Guide: Roblox Trading Platform

## User Story Validation Steps

This guide provides step-by-step validation for the primary user story: *"A Roblox user wants to trade their rare 'Brainrot' items with other players safely through escrow and middleman supervision."*

## Prerequisites
- Node.js 18+ installed
- PostgreSQL database running
- Stripe test account configured
- Cloudflare R2 bucket configured
- Roblox OAuth app credentials

## Environment Setup

1. **Clone and install dependencies**
   ```bash
   git clone <repo-url>
   cd roblox-trading-platform
   pnpm install
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Fill in required values:
   ```env
   DATABASE_URL="postgresql://user:pass@localhost:5432/trading_db"
   NEXTAUTH_SECRET="your-secret-key"
   ROBLOX_OAUTH_CLIENT_ID="your-roblox-app-id"
   ROBLOX_OAUTH_CLIENT_SECRET="your-roblox-secret"
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_PUBLISHABLE_KEY="pk_test_..."
   CLOUDFLARE_R2_ACCOUNT_ID="your-account-id"
   CLOUDFLARE_R2_ACCESS_KEY="your-access-key"
   CLOUDFLARE_R2_SECRET_KEY="your-secret-key"
   CLOUDFLARE_R2_BUCKET="trading-images"
   ```

3. **Database setup**
   ```bash
   pnpm prisma migrate dev
   pnpm prisma db seed
   ```

4. **Start development server**
   ```bash
   pnpm dev
   ```

## Manual Testing Scenarios

### Scenario 1: User Registration & Authentication
**Goal**: Verify Roblox OAuth integration works correctly

1. Navigate to `http://localhost:3000`
2. Click "Login with Roblox" button
3. Complete Roblox OAuth flow
4. Verify user is redirected back and logged in
5. Check that username and avatar are displayed
6. Logout and login again to test session persistence

**Expected Result**: User successfully authenticates via Roblox OAuth

### Scenario 2: Create Trade Listing
**Goal**: User can create a trade listing with item name and image

1. Login as a user
2. Navigate to "Create Trade" page
3. Fill in trade form:
   - Item name: "Rare Brainrot Item"
   - Upload item image (test with valid PNG/JPEG)
   - Description: "Rare item from event"
   - Price: $25.00
4. Submit form
5. Verify trade appears in "My Trades" list
6. Verify trade appears in public search results

**Expected Result**: Trade listing created and visible to other users

### Scenario 3: Search and Contact
**Goal**: Users can find trades and initiate contact

1. Login as different user (User B)
2. Use search to find "Brainrot" items
3. Verify the trade from Scenario 2 appears
4. Click on trade to view details
5. Click "Contact Seller" to join trade
6. Verify chat interface opens
7. Send a message: "Interested in this item!"
8. Switch to original user (User A) account
9. Verify message notification and response capability

**Expected Result**: Users can communicate in trade-specific chat rooms

### Scenario 4: Payment Flow
**Goal**: Both users complete payment within deadline

1. In the trade chat, User A types: "/agree $25.00"
2. User B responds: "/agree $25.00"
3. Verify system initiates 30-minute payment deadline
4. Both users see "Payment Required" interface
5. User A completes Stripe payment (use test card 4242 4242 4242 4242)
6. User B completes Stripe payment
7. Verify both payments are held in escrow
8. Check that trade status updates to "PAYMENT_COMPLETE"

**Expected Result**: Both payments processed and held in escrow

### Scenario 5: Middleman Notification & Supervision
**Goal**: Available middleman is notified and joins trade

1. Login as middleman (separate authentication)
2. Verify notification appears for the paid trade
3. Middleman clicks "Accept Supervision"
4. Verify middleman joins the trade chat
5. All participants see "Middleman has joined" message
6. Middleman reviews trade details
7. Middleman clicks "Approve Trade Completion"
8. Verify funds are released from escrow
9. Verify trade status updates to "COMPLETED"

**Expected Result**: Trade supervised and completed by middleman

### Scenario 6: Payment Timeout Handling
**Goal**: Verify refund when only one user pays

1. Create new trade between users
2. Agree on terms to trigger payment deadline
3. Only User A makes payment
4. Wait for 30-minute deadline to expire (or mock timer)
5. Verify User A receives automatic refund
6. Verify trade status updates to "REFUNDED"
7. Check that both users are notified of cancellation

**Expected Result**: Partial payment results in refund and trade cancellation

## Integration Tests

Run the following commands to validate system integration:

```bash
# API contract tests
pnpm test:contracts

# WebSocket event tests
pnpm test:websocket

# End-to-end user flows
pnpm test:e2e

# Payment integration tests
pnpm test:payments

# Database migrations and constraints
pnpm test:database
```

## Performance Validation

```bash
# Load testing for real-time chat
pnpm test:load-chat

# Payment processing performance
pnpm test:load-payments

# Database query performance
pnpm test:db-performance
```

## Acceptance Criteria Checklist

- [ ] ✅ Users authenticate via Roblox OAuth exclusively
- [ ] ✅ Users can create trade listings with item name and image upload
- [ ] ✅ Search functionality works for Brainrot item names
- [ ] ✅ Real-time chat enables trade negotiation
- [ ] ✅ 30-minute payment deadline is enforced after agreement
- [ ] ✅ Stripe integration holds funds in escrow
- [ ] ✅ Automatic refund when only one payment received
- [ ] ✅ Middlemen receive notifications when both users pay
- [ ] ✅ Middlemen can join trade rooms for supervision
- [ ] ✅ Trade completion requires middleman approval
- [ ] ✅ Users directed to Discord for unresolved support issues
- [ ] ✅ Real-time status updates for all participants

## Deployment Validation

```bash
# Build production version
pnpm build

# Run production server
pnpm start

# Validate production environment variables
pnpm validate:env

# Database migration on production
pnpm prisma migrate deploy
```

## Monitoring & Observability

After deployment, verify:
- Application logs are captured
- Payment webhooks are processed correctly
- Real-time connections are stable
- Database performance is within limits
- Error tracking is functional

## Support Escalation Test

Test the support flow:
1. Create a scenario requiring manual intervention
2. Verify users are directed to Discord community
3. Confirm support ticket creation process
4. Validate escalation workflow