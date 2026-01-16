import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fef3c7,_#f8f7f4_55%)]">
      <div className="mx-auto flex min-h-screen w-full max-w-lg items-center justify-center px-6">
        {children}
      </div>
    </div>
  );
}
