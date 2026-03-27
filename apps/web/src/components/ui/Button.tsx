import { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({ className, variant = "primary", size = "md", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-indigo-200",
        size === "md" && "h-10 px-4 text-sm",
        size === "sm" && "h-9 px-3 text-xs",
        variant === "primary" && "bg-indigo-500 text-white hover:bg-indigo-600",
        variant === "secondary" && "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
        variant === "ghost" && "text-slate-600 hover:bg-slate-100",
        className
      )}
      {...props}
    />
  );
}
