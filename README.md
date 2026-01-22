# ExpenseFlow — Expense Tracker

A production-ready expense tracker with secure authentication, budgets, recurring transactions, receipt uploads, and analytics. Built with Next.js App Router, TypeScript, Prisma, and PostgreSQL with a strong focus on data integrity, test reliability, and real-world engineering practices.

## Features
- Secure user authentication (email/password) with optional Google OAuth scaffolding
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
- PostgreSQL

Auth
- Auth.js / NextAuth (Credentials + optional Google)

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

## Local Setup
```bash
npm install
```

### Database (Docker)
```bash
docker compose up -d
```

### Environment Variables
Create `.env`:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/expense_tracker?schema=public"
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
UPLOAD_DIR="./public/uploads"
# Optional Google OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

For tests:
```
DATABASE_URL_TEST="postgresql://postgres:postgres@localhost:5432/expenseflow_test"
```

### Migrations and Seed
```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

### Run Dev Server
```bash
npm run dev
```

Open http://localhost:3000

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

## Tests
Unit tests:
```bash
npm run test:unit
```

E2E:
```bash
npx playwright install
npm run test:e2e
```

Database reset (tests):
```bash
npm run test:db:reset
```

All tests (CI-like):
```bash
npm run test:all
```

Test DB setup (manual):
```bash
export DATABASE_URL_TEST="postgresql://postgres:postgres@localhost:5432/expenseflow_test"
NODE_ENV=test npx prisma migrate deploy
```

## Deployment Notes
- Run `npm run prisma:migrate` and `npm run prisma:generate` during deploy.
- Ensure `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, and `DATABASE_URL` are set.
- Receipt storage uses local filesystem via `UPLOAD_DIR` and is adapter-based for future S3/Supabase storage.

## Demo Account Seed
`demo@expenseflow.app` / `DemoPass123!`
