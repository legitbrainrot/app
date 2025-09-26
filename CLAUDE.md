# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development**: `pnpm run dev` - Start Next.js development server with Turbopack
- **Build**: `pnpm run build` - Build the application with Turbopack
- **Production**: `pnpm run start` - Start production server
- **Lint**: `pnpm run lint` - Run Biome linting checks
- **Format**: `pnpm run format` - Format code with Biome
- **Add shadcn/ui components**: `pnpm dlx shadcn@latest add [component-name]`

## Project Architecture

This is a Next.js 15 application using the App Router with the following stack:

- **Framework**: Next.js 15 with App Router and Turbopack
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: better-auth
- **Styling**: Tailwind CSS v4 with shadcn/ui components (new-york style)
- **Code Quality**: Biome for linting and formatting
- **Git Hooks**: Husky with lint-staged for pre-commit checks
- **UI Library**: Radix UI primitives with shadcn/ui components
- **Icons**: Lucide React

### Key Directory Structure

- `src/app/` - Next.js App Router pages and layouts
- `src/components/ui/` - shadcn/ui components
- `src/components/` - Custom reusable components
- `src/hooks` - Custom reusable hooks
- `src/feature` - Feature-specific code
- `src/lib/` - Utility functions and shared code
- `prisma/` - Database schema and migrations

### Database Configuration

- Prisma client generates to `src/generated/prisma`
- Uses PostgreSQL (DATABASE_URL environment variable)
- Database connection configured in `prisma/schema.prisma`

### Code Style

- Uses Biome (not ESLint/Prettier) for linting and formatting
- 2-space indentation
- Extends "ultracite" configuration
- TypeScript strict mode enabled with strict null checks
- Pre-commit hooks enforce code quality via lint-staged

### Path Aliases

- `@/*` maps to `src/*`
- `@/components` for components
- `@/lib` for utilities
- `@/components/ui` for UI components

### Environment Setup

The project uses:

- Node.js with TypeScript
- **pnpm as package manager** - STRICTLY use pnpm for all package management tasks
- Docker Compose configuration available
- Husky for Git hooks

