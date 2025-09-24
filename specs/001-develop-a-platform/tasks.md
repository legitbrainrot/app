# Tasks: Roblox Trading Platform with Escrow

**Input**: Design documents from `/specs/001-develop-a-platform/`
**Prerequisites**: plan.md, research.md, data-model.md, contracts/, quickstart.md

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → Extract: Next.js 15, React 19, Prisma/PostgreSQL, Socket.io, Better Auth, Stripe, Cloudflare R2
2. Load optional design documents:
   → data-model.md: 6 entities (User, Middleman, Trade, TradeParticipant, ChatMessage, Payment)
   → contracts/: 15+ REST endpoints + WebSocket events
   → quickstart.md: Manual testing scenarios
3. Generate tasks by category:
   → Setup: Next.js config, dependencies, database, environment
   → Tests: Contract tests, integration tests, E2E tests
   → Database: Prisma schema, migrations, models
   → Authentication: Better Auth + Roblox OAuth
   → API: REST endpoints for trades, payments, chat
   → WebSocket: Socket.io server and real-time events
   → UI: shadcn/ui components and pages
   → Integration: Stripe payments, Cloudflare R2, middleman workflow
   → Polish: Performance optimization, accessibility, documentation
4. Apply TDD ordering: Tests before implementation
5. Mark parallel tasks [P] for independent files
6. SUCCESS: Tasks ready for execution
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Next.js App Router**: `src/app/`, `src/components/`, `src/lib/`
- **API Routes**: `src/app/api/`
- **Database**: `prisma/schema.prisma`, `prisma/migrations/`
- **Tests**: `tests/unit/`, `tests/integration/`, `tests/e2e/`

## Phase 3.1: Setup & Configuration
- [x] T001 [P] Initialize Next.js 15 project with App Router and TypeScript configuration in next.config.ts
- [x] T002 [P] Configure Biome linting and formatting with Next.js and React rules in biome.json
- [x] T003 [P] Install and configure dependencies: prisma, better-auth, stripe, socket.io, @tanstack/react-query, zustand, cloudflare R2 SDK
- [x] T004 [P] Setup environment variables template in .env.example with all required keys
- [x] T005 [P] Configure TypeScript strict mode and path aliases in tsconfig.json
- [x] T006 [P] Setup shadcn/ui with Tailwind CSS v4 and configure components.json
- [x] T007 [P] Initialize Prisma with PostgreSQL provider in prisma/schema.prisma

## Phase 3.2: Database Schema & Migrations ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: Database must be ready before any API implementation**
- [x] T008 [P] Define User model with Roblox authentication fields in prisma/schema.prisma
- [x] T009 [P] Define Middleman model with password and availability fields in prisma/schema.prisma
- [x] T010 [P] Define Trade model with status enum and relationships in prisma/schema.prisma
- [x] T011 [P] Define TradeParticipant model linking users to trades in prisma/schema.prisma
- [x] T012 [P] Define ChatMessage model for real-time messaging in prisma/schema.prisma
- [x] T013 [P] Define Payment model with Stripe integration fields in prisma/schema.prisma
- [x] T014 Create initial database migration with all models
- [x] T015 [P] Create database seed file with sample data in prisma/seed.ts

## Phase 3.3: Authentication System
- [x] T016 [P] Configure Better Auth with Roblox OAuth provider in src/lib/auth.ts
- [x] T017 [P] Create authentication API routes in src/app/api/auth/[...auth]/route.ts
- [x] T018 [P] Implement Roblox OAuth callback handling with user creation
- [x] T019 [P] Create middleman authentication endpoint in src/app/api/middleman/auth/route.ts
- [x] T020 [P] Build authentication middleware for API route protection in src/lib/middleware.ts

## Phase 3.4: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.5
**CRITICAL: These tests MUST be written and MUST FAIL before ANY API implementation**
- [ ] T021 [P] Contract test GET /api/trades (search functionality) in tests/contract/test_trades_get.spec.ts
- [ ] T022 [P] Contract test POST /api/trades (create listing) in tests/contract/test_trades_post.spec.ts
- [ ] T023 [P] Contract test POST /api/trades/{id}/join (join trade) in tests/contract/test_trades_join.spec.ts
- [ ] T024 [P] Contract test GET /api/trades/{id}/messages (chat history) in tests/contract/test_chat_get.spec.ts
- [ ] T025 [P] Contract test POST /api/trades/{id}/messages (send message) in tests/contract/test_chat_post.spec.ts
- [ ] T026 [P] Contract test POST /api/trades/{id}/payment-intent (create payment) in tests/contract/test_payment_intent.spec.ts
- [ ] T027 [P] Contract test POST /api/middleman/trades/{id}/complete (approve trade) in tests/contract/test_middleman_complete.spec.ts
- [ ] T028 [P] Contract test POST /api/upload/image (file upload) in tests/contract/test_upload.spec.ts
- [ ] T029 [P] Integration test: Complete user registration flow in tests/integration/test_auth.spec.ts
- [ ] T030 [P] Integration test: Full trade creation and search in tests/integration/test_trades.spec.ts
- [ ] T031 [P] Integration test: Real-time chat functionality in tests/integration/test_chat.spec.ts
- [ ] T032 [P] Integration test: Payment and escrow workflow in tests/integration/test_payments.spec.ts
- [ ] T033 [P] Integration test: Middleman supervision workflow in tests/integration/test_middleman.spec.ts

## Phase 3.5: API Implementation (ONLY after tests are failing)
- [ ] T034 [P] Implement GET /api/trades with search and filtering in src/app/api/trades/route.ts
- [ ] T035 [P] Implement POST /api/trades for creating listings in src/app/api/trades/route.ts
- [ ] T036 [P] Implement GET /api/trades/[id] for trade details in src/app/api/trades/[id]/route.ts
- [ ] T037 [P] Implement POST /api/trades/[id]/join for trade participation in src/app/api/trades/[id]/join/route.ts
- [ ] T038 [P] Implement PATCH /api/trades/[id] for status updates in src/app/api/trades/[id]/route.ts
- [ ] T039 [P] Implement GET /api/trades/[id]/messages for chat history in src/app/api/trades/[id]/messages/route.ts
- [ ] T040 [P] Implement POST /api/trades/[id]/messages for sending messages in src/app/api/trades/[id]/messages/route.ts
- [ ] T041 [P] Implement POST /api/trades/[id]/payment-intent for Stripe integration in src/app/api/trades/[id]/payment-intent/route.ts
- [ ] T042 [P] Implement POST /api/payments/[id]/confirm for webhook handling in src/app/api/payments/[id]/confirm/route.ts
- [ ] T043 [P] Implement GET /api/middleman/trades/pending for middleman queue in src/app/api/middleman/trades/pending/route.ts
- [ ] T044 [P] Implement POST /api/middleman/trades/[id]/join in src/app/api/middleman/trades/[id]/join/route.ts
- [ ] T045 [P] Implement POST /api/middleman/trades/[id]/complete in src/app/api/middleman/trades/[id]/complete/route.ts
- [ ] T046 [P] Implement POST /api/upload/image for Cloudflare R2 uploads in src/app/api/upload/image/route.ts

## Phase 3.6: WebSocket Server & Real-time Features
- [ ] T047 Setup Socket.io server integration with Next.js in src/lib/socket-server.ts
- [ ] T048 [P] Implement chat message broadcasting for trade rooms in src/lib/socket-handlers/chat.ts
- [ ] T049 [P] Implement trade status update events in src/lib/socket-handlers/trades.ts
- [ ] T050 [P] Implement middleman notification system in src/lib/socket-handlers/middleman.ts
- [ ] T051 [P] Implement payment status broadcasts in src/lib/socket-handlers/payments.ts
- [ ] T052 Integrate WebSocket authentication with Better Auth tokens
- [ ] T053 [P] Add rate limiting and error handling for WebSocket events in src/lib/socket-middleware.ts

## Phase 3.7: UI Components (shadcn/ui)
- [ ] T054 [P] Create authentication components (LoginButton, UserProfile) in src/components/auth/
- [ ] T055 [P] Create trade listing components (TradeCard, TradeForm) in src/components/trades/
- [ ] T056 [P] Create search components (SearchBar, FilterPanel) in src/components/search/
- [ ] T057 [P] Create chat components (ChatMessage, ChatInput) in src/components/chat/
- [ ] T058 [P] Create payment components (PaymentForm, PaymentStatus) in src/components/payments/
- [ ] T059 [P] Create middleman components (MiddlemanDashboard, TradeApproval) in src/components/middleman/
- [ ] T060 [P] Create file upload component with Cloudflare R2 integration in src/components/ui/image-upload.tsx

## Phase 3.8: Pages & Layout
- [ ] T061 [P] Create root layout with authentication provider in src/app/layout.tsx
- [ ] T062 [P] Create home page with trade search and listings in src/app/page.tsx
- [ ] T063 [P] Create trade creation page in src/app/create-trade/page.tsx
- [ ] T064 [P] Create trade details page with chat in src/app/trades/[id]/page.tsx
- [ ] T065 [P] Create user profile and trade history page in src/app/profile/page.tsx
- [ ] T066 [P] Create middleman dashboard page in src/app/middleman/page.tsx
- [ ] T067 [P] Create middleman login page in src/app/middleman/login/page.tsx

## Phase 3.9: State Management & API Integration
- [ ] T068 [P] Setup TanStack Query with Next.js App Router in src/lib/query-client.ts
- [ ] T069 [P] Create trade queries and mutations in src/lib/api/trades.ts
- [ ] T070 [P] Create chat queries and real-time updates in src/lib/api/chat.ts
- [ ] T071 [P] Create payment queries and Stripe integration in src/lib/api/payments.ts
- [ ] T072 [P] Create user authentication queries in src/lib/api/auth.ts
- [ ] T073 [P] Setup Zustand stores for UI state management in src/lib/stores/
- [ ] T074 Setup Socket.io client with React hooks in src/lib/socket-client.ts

## Phase 3.10: Business Logic & Services
- [ ] T075 [P] Implement trade status validation and transitions in src/lib/services/trade-service.ts
- [ ] T076 [P] Implement payment deadline enforcement in src/lib/services/payment-service.ts
- [ ] T077 [P] Implement escrow management with Stripe in src/lib/services/escrow-service.ts
- [ ] T078 [P] Implement middleman assignment logic in src/lib/services/middleman-service.ts
- [ ] T079 [P] Implement file upload validation and processing in src/lib/services/upload-service.ts
- [ ] T080 [P] Create email notification service for critical events in src/lib/services/notification-service.ts

## Phase 3.11: E2E Tests & User Scenarios
- [ ] T081 [P] E2E test: User registration and authentication flow in tests/e2e/auth.spec.ts
- [ ] T082 [P] E2E test: Create trade listing with image upload in tests/e2e/create-trade.spec.ts
- [ ] T083 [P] E2E test: Search and browse trade listings in tests/e2e/search-trades.spec.ts
- [ ] T084 [P] E2E test: Join trade and negotiate via chat in tests/e2e/trade-negotiation.spec.ts
- [ ] T085 [P] E2E test: Complete payment and escrow process in tests/e2e/payment-flow.spec.ts
- [ ] T086 [P] E2E test: Middleman supervision and trade completion in tests/e2e/middleman-flow.spec.ts
- [ ] T087 [P] E2E test: Payment timeout and refund scenario in tests/e2e/payment-timeout.spec.ts

## Phase 3.12: Performance & Optimization
- [ ] T088 [P] Optimize database queries with proper indexing in prisma/migrations/
- [ ] T089 [P] Implement API response caching with Next.js cache in src/lib/cache.ts
- [ ] T090 [P] Add image optimization and lazy loading in src/components/ui/optimized-image.tsx
- [ ] T091 [P] Implement bundle splitting for large dependencies in next.config.ts
- [ ] T092 [P] Add performance monitoring and logging in src/lib/monitoring.ts
- [ ] T093 [P] Optimize WebSocket connection management and cleanup in src/lib/socket-optimization.ts

## Phase 3.13: Security & Validation
- [ ] T094 [P] Implement input validation schemas with Zod in src/lib/validation/
- [ ] T095 [P] Add CSRF protection and security headers in src/middleware.ts
- [ ] T096 [P] Implement rate limiting for API endpoints in src/lib/rate-limit.ts
- [ ] T097 [P] Add file upload security validation in src/lib/security/file-validation.ts
- [ ] T098 [P] Implement payment fraud detection in src/lib/security/payment-security.ts
- [ ] T099 [P] Add audit logging for sensitive operations in src/lib/security/audit-log.ts

## Phase 3.14: Production Readiness
- [ ] T100 [P] Configure environment-specific settings in src/lib/config.ts
- [ ] T101 [P] Setup database connection pooling and optimization
- [ ] T102 [P] Implement health check endpoints in src/app/api/health/route.ts
- [ ] T103 [P] Add error tracking and reporting integration
- [ ] T104 [P] Create deployment scripts and Docker configuration
- [ ] T105 [P] Setup monitoring dashboards for key metrics

## Dependencies
- Database schema (T008-T015) must complete before API implementation (T034-T046)
- Authentication setup (T016-T020) blocks all authenticated endpoints
- Tests (T021-T033) must be written and failing before implementation (T034-T046)
- WebSocket server (T047) must be ready before real-time features (T048-T051)
- UI components (T054-T060) needed for pages (T061-T067)
- API integration (T068-T074) connects UI to backend services

## Parallel Example
```bash
# Launch database model tasks together:
Task: "Define User model with Roblox authentication fields in prisma/schema.prisma"
Task: "Define Middleman model with password and availability fields in prisma/schema.prisma"
Task: "Define Trade model with status enum and relationships in prisma/schema.prisma"
Task: "Define TradeParticipant model linking users to trades in prisma/schema.prisma"
Task: "Define ChatMessage model for real-time messaging in prisma/schema.prisma"
Task: "Define Payment model with Stripe integration fields in prisma/schema.prisma"
```

```bash
# Launch contract test tasks together:
Task: "Contract test GET /api/trades (search functionality) in tests/contract/test_trades_get.spec.ts"
Task: "Contract test POST /api/trades (create listing) in tests/contract/test_trades_post.spec.ts"
Task: "Contract test POST /api/trades/{id}/join (join trade) in tests/contract/test_trades_join.spec.ts"
Task: "Contract test GET /api/trades/{id}/messages (chat history) in tests/contract/test_chat_get.spec.ts"
```

## Notes
- [P] tasks target different files with no shared dependencies
- Verify tests fail before implementing corresponding features
- Follow TDD: Tests → Implementation → Refactor
- Each task includes specific file path for clarity
- Real-time features require WebSocket server setup first
- Payment integration requires careful error handling and security

## Task Generation Rules Applied
1. **From Contracts**: 15+ API endpoints → 15+ contract tests [P] + implementations
2. **From Data Model**: 6 entities → 6 model definition tasks [P]
3. **From User Stories**: 6 main scenarios → 7 E2E test tasks [P]
4. **From WebSocket Events**: Chat, status updates → real-time handlers [P]
5. **Ordering**: Setup → Database → Tests → Implementation → UI → Integration

## Validation Checklist
- [x] All API contracts have corresponding tests and implementations
- [x] All entities have model definition and validation tasks
- [x] All tests come before their implementations (TDD)
- [x] Parallel tasks target independent files
- [x] Each task specifies exact file path
- [x] Dependencies clearly documented
- [x] Technology-specific tasks included (Next.js, Prisma, Stripe, etc.)
- [x] Performance and security considerations included