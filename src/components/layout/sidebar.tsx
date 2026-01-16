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
    <aside className="hidden h-screen w-64 flex-col border-r border-neutral-200 bg-white p-6 md:flex">
      <div className="mb-8">
        <p className="text-xl font-semibold">ExpenseFlow</p>
        <p className="text-xs text-neutral-500">Smart money control</p>
      </div>
      <nav className="flex flex-col gap-2 text-sm">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-lg px-3 py-2 font-medium text-neutral-700 transition hover:bg-neutral-100"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
