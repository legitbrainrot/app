<!--
Sync Impact Report:
Version change: Initial → 1.0.0
Added sections:
  - Code Quality (Principle I)
  - Testing Standards (Principle II)
  - User Experience Consistency (Principle III)
  - Performance Requirements (Principle IV)
  - Development Workflow (Section 2)
  - Quality Assurance (Section 3)
Templates requiring updates:
  ✅ plan-template.md - Constitution Check section references constitution v2.1.1
  ✅ spec-template.md - No constitution-specific references found
  ✅ tasks-template.md - No constitution-specific references found
Follow-up TODOs: None - all placeholders filled
-->

# App Constitution

## Core Principles

### I. Code Quality
Code MUST be maintainable, readable, and follow consistent standards across the codebase. All code MUST pass linting (Biome) and type checking (TypeScript) before merge. Components MUST follow established patterns from existing codebase. No unused code or dependencies allowed.

**Rationale**: High code quality reduces bugs, improves developer productivity, and ensures long-term maintainability as the application scales.

### II. Testing Standards (NON-NEGOTIABLE)
TDD is mandatory: Tests MUST be written before implementation. Every component MUST have unit tests. All API endpoints MUST have integration tests. Tests MUST achieve minimum 80% coverage. No feature ships without comprehensive test coverage.

**Rationale**: Test-first development prevents bugs, improves design quality, and provides confidence for refactoring and feature additions.

### III. User Experience Consistency
UI components MUST follow established design system patterns. All interactions MUST provide clear feedback within 100ms. Error states MUST be handled gracefully with user-friendly messages. Responsive design is mandatory for all screen sizes. Accessibility standards (WCAG 2.1 AA) MUST be met.

**Rationale**: Consistent UX builds user trust, reduces confusion, and ensures the application is usable by all users regardless of device or ability.

### IV. Performance Requirements
Page load times MUST be under 3 seconds on 3G networks. Bundle sizes MUST be optimized with code splitting. Images MUST be optimized and lazy-loaded. API responses MUST be under 200ms for 95th percentile. Memory usage MUST not exceed 100MB for typical user sessions.

**Rationale**: Performance directly impacts user satisfaction, conversion rates, and business success, especially on mobile devices and slower networks.

## Development Workflow

Development follows a structured approach with mandatory gates:
- Feature branches MUST be created from main
- All code changes MUST go through pull request review
- CI/CD pipeline MUST pass (lint, type check, tests, build)
- Performance audits required for user-facing changes
- Security review required for authentication/authorization changes

## Quality Assurance

Quality gates enforce constitutional compliance:
- Automated testing in CI pipeline
- Code review process with at least one approval
- Performance monitoring in production
- Regular dependency updates and security audits
- Documentation updates required for public APIs

## Governance

This constitution supersedes all other development practices. Amendments require team consensus and documentation of impact on existing code. All pull requests MUST verify compliance with these principles. Violations MUST be justified with technical rationale and approved by team lead.

**Version**: 1.0.0 | **Ratified**: 2025-09-25 | **Last Amended**: 2025-09-25