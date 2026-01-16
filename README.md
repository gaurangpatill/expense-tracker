# ExpenseFlow — Expense Tracker

A production-ready expense tracker with secure authentication, budgets, recurring transactions, receipt uploads, and analytics. Built with Next.js App Router, Prisma, and PostgreSQL.

## Features
- Secure signup/login with Credentials (optional Google OAuth scaffolding)
- Category management with per-user defaults
- Transactions with filters, pagination, and receipt attachments
- Monthly budgets with progress tracking and overspend alerts
- Recurring rules with idempotent generation
- Analytics dashboard with charts and top merchants
- Settings: change password and soft-delete account

## Tech Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- Auth.js / NextAuth (Credentials + optional Google)
- React Hook Form + Zod validation
- Recharts
- Vitest + Playwright

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

### Migrations + Seed
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

## Tests
Unit tests:
```bash
npm run test:unit
```

E2E (requires running database and dev server):
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

Test DB setup:
```bash
export DATABASE_URL_TEST=\"postgresql://postgres:postgres@localhost:5432/expenseflow_test\"
NODE_ENV=test npx prisma migrate deploy
```

## Deployment Notes
- Run `npm run prisma:migrate` and `npm run prisma:generate` during deploy.
- Ensure `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, and `DATABASE_URL` are set.
- Receipt storage uses local filesystem via `UPLOAD_DIR` and is adapter-based for future S3/Supabase storage.

## Demo Account Seed
`demo@expenseflow.app` / `DemoPass123!`
