# Research: Roblox Trading Platform

## Technology Stack Decisions

### Frontend Framework
**Decision**: Next.js 15 with App Router
**Rationale**:
- Built-in SSR/SSG for SEO and performance
- App Router provides modern React patterns
- Excellent TypeScript support
- Built-in API routes for backend functionality
- Active community and ecosystem

**Alternatives considered**:
- Vite + React: Less integrated, requires separate backend
- Remix: Smaller ecosystem, less mature
- SvelteKit: Smaller community, team familiarity

### Database & ORM
**Decision**: PostgreSQL with Prisma ORM
**Rationale**:
- PostgreSQL provides ACID compliance for financial transactions
- Prisma offers excellent TypeScript integration
- Schema migrations and introspection
- Type-safe database queries
- Built-in connection pooling

**Alternatives considered**:
- MySQL: Less robust JSON support
- MongoDB: Less suitable for financial transactions requiring ACID
- Drizzle ORM: Newer, less mature ecosystem

### Real-time Communication
**Decision**: Socket.io
**Rationale**:
- Mature WebSocket library with fallbacks
- Room-based messaging perfect for trade chats
- Built-in reconnection and error handling
- Excellent Next.js integration
- Supports middleman notifications

**Alternatives considered**:
- Native WebSocket: Requires manual fallback handling
- Pusher: Third-party dependency, cost implications
- Supabase Realtime: Ties us to Supabase ecosystem

### Authentication
**Decision**: Better Auth
**Rationale**:
- Modern, type-safe auth library
- Supports OAuth providers (Roblox)
- Built for Next.js App Router
- Session management and security features
- Supports multiple user types (users/middlemen)

**Alternatives considered**:
- NextAuth.js: Less type-safe, complex configuration
- Auth0: External dependency, cost implications
- Custom OAuth: Security risks, development overhead

### Payment Processing
**Decision**: Stripe
**Rationale**:
- Industry standard for online payments
- Strong escrow/marketplace capabilities
- Excellent developer experience and docs
- PCI compliance handled
- Supports refunds and complex payment flows

**Alternatives considered**:
- PayPal: Less developer-friendly API
- Custom payment system: Regulatory and security complexity
- Crypto payments: Volatility and regulatory concerns

### File Storage
**Decision**: Cloudflare R2
**Rationale**:
- S3-compatible API with familiar patterns
- Cost-effective for image storage
- Global CDN for fast image delivery
- No egress fees
- Simple integration with Next.js

**Alternatives considered**:
- AWS S3: Higher costs with egress fees
- Vercel Blob: More expensive, smaller limits
- Local storage: Not scalable, backup complexity

### Styling & UI Components
**Decision**: Tailwind CSS + shadcn/ui
**Rationale**:
- Utility-first approach for consistency
- shadcn/ui provides accessible, customizable components
- Built on Radix UI primitives
- Excellent TypeScript support
- Active community and updates

**Alternatives considered**:
- Chakra UI: Heavier bundle, less customizable
- Material-UI: Opinionated design, harder to customize
- Custom CSS: Development overhead, consistency challenges

### State Management
**Decision**: Zustand + TanStack Query
**Rationale**:
- Zustand for client state (lightweight, TypeScript-first)
- TanStack Query for server state (caching, synchronization)
- Minimal boilerplate compared to Redux
- Excellent Next.js App Router compatibility

**Alternatives considered**:
- Redux Toolkit: More boilerplate, overkill for this use case
- Jotai: Atomic approach adds complexity
- Context API only: Performance issues with frequent updates

### Testing Strategy
**Decision**: Vitest + Playwright + Jest
**Rationale**:
- Vitest for unit tests (fast, Vite-based)
- Playwright for E2E tests (cross-browser, reliable)
- Jest for integration tests (mature, good mocking)
- All support TypeScript out of the box

**Alternatives considered**:
- Jest only: Slower for unit tests
- Cypress: Heavier, debugging challenges
- Testing Library only: Missing E2E capabilities

## Integration Patterns

### Roblox OAuth Integration
- Use OAuth 2.0 flow with Roblox API
- Store user Roblox ID and username
- Implement refresh token rotation for security
- Handle OAuth errors gracefully

### Stripe Integration
- Use Stripe Connect for marketplace functionality
- Implement payment intents for escrow
- Handle webhooks for payment status updates
- Implement refund logic for failed trades

### Real-time Features
- Socket.io rooms for trade-specific chats
- Emit payment status updates to all participants
- Middleman notification system
- Connection management and reconnection logic

### File Upload Flow
- Direct upload to Cloudflare R2 via signed URLs
- Image validation and processing
- Thumbnail generation for trade listings
- CDN delivery for optimized loading