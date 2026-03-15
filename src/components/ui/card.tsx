import * as React from "react";

import { cn } from "@/lib/utils";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "glass-card rounded-3xl p-6 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl",
        className
      )}
      {...props}
    />
  );
}
