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
    <nav className="flex w-full items-center gap-2 overflow-x-auto border-b border-neutral-200 bg-white px-4 py-3 md:hidden">
      <span className="text-sm font-semibold">ExpenseFlow</span>
      <div className="flex gap-2 text-xs">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-full border border-neutral-200 px-3 py-1 text-neutral-600"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
