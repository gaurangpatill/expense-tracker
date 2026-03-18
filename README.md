# Expense Tracker

A production-ready expense tracker with secure authentication, budgets, recurring transactions, receipt uploads, and analytics. Built with Next.js App Router, TypeScript, Prisma, and PostgreSQL with a strong focus on data integrity, test reliability, and real-world engineering practices.

## Deployment
Deployed project: https://expense-tracker-phi-eight-61.vercel.app/

## Features
- Secure user authentication (email/password)
- Category management with per-user defaults, icons, and colors
- Income and expense transactions with filters, pagination, and receipt attachments
- Monthly budgets with progress tracking and overspend indicators
- Recurring transactions with idempotent generation
- Analytics dashboard with charts, top merchants, and recent transactions
- Customizable dashboard layout and currency selection
- Settings: change password and soft-delete account

## Dashboard
- Total income, expenses, and net balance
- Spend by category and daily expense trends
- Budget status indicators
- Toggleable widgets and layout preferences

## Tech Stack
Frontend
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS

Backend
- Next.js route handlers
- Prisma ORM
- PostgreSQL (hosted on Supabase in production)

Auth
- Auth.js / NextAuth (Credential)

Testing and Quality
- Vitest + React Testing Library (unit/integration)
- Playwright (end-to-end)
- GitHub Actions CI
- Strict TypeScript + ESLint

## Testing Strategy
This project emphasizes reliable, deterministic tests over superficial coverage.

Unit and Integration Tests
- Service-level tests for business logic
- Validator tests for API boundaries
- Database tests using a dedicated test database
- Safe test isolation (no parallel destructive resets)

```bash
npm run test:unit
```

End-to-End Tests
- Full user flows: auth, transactions, budgets, preferences
- File uploads (receipts)
- Dashboard behavior verification
- CI-safe Playwright setup

```bash
npm run test:e2e
```

## Project Structure
```
src/
  app/            # Next.js app routes
  components/     # Feature and UI components
  server/         # Services and validators
  lib/            # Shared utilities
prisma/
  schema.prisma
  migrations/
  seed.ts
playwright/
  tests/          # End-to-end tests
  fixtures/       # Test assets
  utils/          # Test helpers
test/
  db/             # Test DB helpers
  msw/            # Mock service workers
```

## Engineering Notes
- Explicit test DB lifecycle control to avoid deadlocks
- Avoids flaky parallel truncation strategies
- CI mirrors local behavior to prevent environment drift
- Coverage targets critical logic, not UI boilerplate
- Lint rules enforce React best practices and immutability
