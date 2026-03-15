import * as React from "react";

import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-gradient-to-r from-teal-700 via-teal-600 to-amber-500 text-white shadow-lg shadow-teal-900/20 hover:from-teal-600 hover:via-teal-500 hover:to-amber-400",
  secondary:
    "glass-pill text-neutral-800 hover:bg-white/80 hover:text-neutral-900",
  ghost: "bg-transparent text-neutral-700 hover:bg-white/50",
  danger: "bg-rose-600 text-white shadow-lg shadow-rose-900/20 hover:bg-rose-500",
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition duration-300 ease-out ring-focus disabled:pointer-events-none disabled:opacity-60",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
