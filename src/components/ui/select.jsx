import * as React from "react";
import { cn } from "@/lib/utils";

function Select({ className, children, ...props }) {
  return (
    <select
      data-slot="select"
      className={cn(
        "min-h-11 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/25 disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export { Select };
