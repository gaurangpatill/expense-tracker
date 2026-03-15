import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNav } from "@/components/layout/top-nav";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || user.deletedAt) {
    redirect("/login");
  }

  return (
    <div className="app-shell">
      <TopNav />
      <div className="flex">
        <Sidebar />
        <main className="min-h-screen flex-1 px-6 py-8 md:px-10 md:py-10">
          <div className="reveal-up">{children}</div>
        </main>
      </div>
    </div>
  );
}
