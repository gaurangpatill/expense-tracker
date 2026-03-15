import * as React from "react";

import { cn } from "@/lib/utils";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
};

export function Select({ className, label, error, children, ...props }: SelectProps) {
  return (
    <label className="flex w-full flex-col gap-1 text-sm">
      {label ? <span className="font-medium text-neutral-700">{label}</span> : null}
      <select
        className={cn(
          "glass-input ring-focus w-full rounded-xl px-3 py-2 text-sm text-neutral-900 transition duration-300 ease-out focus:border-transparent",
          error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
}
