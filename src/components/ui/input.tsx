import * as React from "react";

import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  rightElement?: React.ReactNode;
};

export function Input({ className, label, error, rightElement, ...props }: InputProps) {
  const generatedId = React.useId();
  const id = props.id ?? generatedId;
  const errorId = `${id}-error`;

  return (
    <div className="flex w-full flex-col gap-1 text-sm">
      {label ? (
        <label htmlFor={id} className="font-medium text-neutral-700">
          {label}
        </label>
      ) : null}
      <div className="relative">
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "glass-input ring-focus w-full rounded-xl px-3 py-2 text-sm text-neutral-900 transition duration-300 ease-out focus:border-transparent",
            rightElement ? "pr-10" : "",
            error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "",
            className
          )}
          {...props}
        />
        {rightElement ? (
          <div className="absolute inset-y-0 right-2 flex items-center">{rightElement}</div>
        ) : null}
      </div>
      {error ? (
        <span id={errorId} className="text-xs text-red-600">
          {error}
        </span>
      ) : null}
    </div>
  );
}
