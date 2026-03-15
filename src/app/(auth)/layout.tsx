import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <div className="mx-auto flex min-h-screen w-full max-w-lg items-center justify-center px-6">
        <div className="reveal-up w-full">{children}</div>
      </div>
    </div>
  );
}
