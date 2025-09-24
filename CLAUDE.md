# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Development server**: `pnpm dev` (uses nodemon with ts-node to watch server.ts)
**Build**: `pnpm build` (runs next build + TypeScript compilation for server)
**Production**: `pnpm start` (runs compiled server from dist/)
**Linting**: `pnpm lint` (Biome check)
**Formatting**: `pnpm format` (Biome format with --write)

## Architecture Overview

This is a **hybrid Next.js application** with both client-side React components and a custom Node.js server:

- **Frontend**: Next.js 15 App Router (`src/app/`) with React 19
- **Backend**: Custom Express-like server (`server.ts`) compiled separately
- **UI Components**: shadcn/ui components (`src/components/ui/`) with Radix UI primitives
- **State Management**: Zustand for client state, TanStack Query for server state
- **Real-time**: Socket.io for client-server communication
- **Authentication**: better-auth for session management
- **Styling**: Tailwind CSS v4 with CSS variables for theming

## Build System

The project uses **dual TypeScript configurations**:

- `tsconfig.json`: Next.js client-side compilation (noEmit: true)
- `tsconfig.server.json`: Server compilation (outputs to dist/)

**Important**: Changes to `server.ts` require restart even in development due to the separate compilation process.

## Key Patterns

**Component Structure**: UI components follow shadcn/ui patterns with:

- `cn()` utility for conditional classes (`src/lib/utils.ts`)
- Class Variance Authority for component variants
- Radix UI primitives with custom styling

**Import Paths**: Uses `@/*` alias pointing to `src/*`

**Styling**: Components use Tailwind with CSS custom properties for theme variables. Dark mode is handled through CSS classes.

## Quality Standards

- **Linting**: Biome with Next.js and React rules enabled
- **TypeScript**: Strict mode enabled
- **Formatting**: 2-space indentation, organize imports on save
- **Browser Support**: Modern browsers (ES2017+ target)

## Feature Development Workflow

This project includes a `.specify/` directory for structured feature development:

- Run `/specify` to create feature specifications
- Run `/plan` to generate implementation plans
- Run `/tasks` to create structured task lists
- Follow the constitution in `.specify/memory/constitution.md`

