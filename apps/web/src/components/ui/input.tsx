import * as React from "react";
import { cn } from "../../lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "w-full rounded-xl border border-white/20 bg-white/70 px-3 py-2 text-sm outline-none backdrop-blur-md focus:ring-2 focus:ring-brand-sky/40",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";
