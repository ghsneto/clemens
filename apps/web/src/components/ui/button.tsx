import * as React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = "primary", ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition",
      variant === "primary" && "bg-brand-ocean text-white hover:bg-teal-700",
      variant === "secondary" && "border border-white/20 bg-white/70 text-slate-700 backdrop-blur-md",
      className
    )}
    {...props}
  />
));
Button.displayName = "Button";
