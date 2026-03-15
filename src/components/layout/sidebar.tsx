import Link from "next/link";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/transactions", label: "Transactions" },
  { href: "/categories", label: "Categories" },
  { href: "/budgets", label: "Budgets" },
  { href: "/recurring", label: "Recurring" },
  { href: "/settings", label: "Settings" },
];

export function Sidebar() {
  return (
    <aside className="glass-surface hidden h-screen w-72 flex-col p-6 shadow-xl shadow-slate-900/10 md:flex">
      <div className="mb-10">
        <p className="float-slow text-2xl font-semibold tracking-[0.18em] text-slate-900">ExpenseFlow</p>
        <p className="text-xs text-slate-500">Smart money control</p>
      </div>
      <nav className="flex flex-col gap-2 text-sm">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="glass-pill rounded-2xl px-4 py-3 font-semibold text-slate-700 transition duration-300 ease-out hover:-translate-y-0.5 hover:text-slate-900"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
