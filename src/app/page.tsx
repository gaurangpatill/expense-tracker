import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fef3c7,_#f8f7f4_55%)]">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div>
          <p className="text-lg font-semibold">ExpenseFlow</p>
          <p className="text-xs text-neutral-500">Track. Plan. Breathe.</p>
        </div>
        <div className="flex gap-3 text-sm">
          <Link href="/login" className="text-neutral-600 hover:text-neutral-900">
            Login
          </Link>
          <Link href="/signup">
            <Button>Get started</Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 pb-20 pt-12">
        <section className="grid items-center gap-10 md:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <p className="inline-flex items-center rounded-full bg-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Built for clarity
            </p>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              Your money map, drawn daily.
            </h1>
            <p className="text-base text-neutral-600 md:text-lg">
              ExpenseFlow blends budgets, receipts, and recurring transactions into one calm
              workspace. Get a clean view of cash flow, category spend, and what needs attention.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/signup">
                <Button>Start free</Button>
              </Link>
              <Link href="/login">
                <Button variant="secondary">Sign in</Button>
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Monthly pulse</p>
              <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs text-emerald-700">
                +8.4% savings
              </span>
            </div>
            <div className="mt-6 space-y-3 text-sm text-neutral-500">
              <div className="flex items-center justify-between rounded-xl bg-neutral-50 p-3">
                <span>Essentials</span>
                <span className="font-semibold text-neutral-900">$1,240</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-neutral-50 p-3">
                <span>Experiences</span>
                <span className="font-semibold text-neutral-900">$420</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-neutral-50 p-3">
                <span>Investments</span>
                <span className="font-semibold text-neutral-900">$680</span>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Budgets with edge",
              copy: "Track each category and get clear overspend signals before you spiral.",
            },
            {
              title: "Receipts, handled",
              copy: "Attach images to every transaction for smooth audits and reimbursements.",
            },
            {
              title: "Recurring relief",
              copy: "Automate bills and income with a safe, idempotent generator.",
            },
          ].map((card) => (
            <div key={card.title} className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h3 className="text-lg font-semibold">{card.title}</h3>
              <p className="mt-3 text-sm text-neutral-600">{card.copy}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
