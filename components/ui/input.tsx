import { cn } from "@/lib/utils";
import * as React from "react";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        "border-input bg-background placeholder:text-muted-foreground file:text-foreground focus-visible:border-primary flex h-10 w-full rounded-md border px-3 py-2 text-sm transition-colors duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-0 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 md:text-sm [&::-webkit-search-cancel-button]:hidden",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };
