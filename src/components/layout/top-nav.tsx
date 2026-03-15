import Link from "next/link";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/transactions", label: "Transactions" },
  { href: "/categories", label: "Categories" },
  { href: "/budgets", label: "Budgets" },
  { href: "/recurring", label: "Recurring" },
  { href: "/settings", label: "Settings" },
];

export function TopNav() {
  return (
    <nav className="glass-nav flex w-full items-center gap-3 overflow-x-auto px-4 py-3 shadow-lg shadow-slate-900/5 md:hidden">
      <span className="text-sm font-semibold tracking-[0.12em] text-slate-900">ExpenseFlow</span>
      <div className="flex gap-2 text-xs">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="glass-pill rounded-full px-3 py-1 font-semibold text-slate-700 transition duration-300 ease-out hover:-translate-y-0.5 hover:text-slate-900"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
