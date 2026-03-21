import * as React from "react";
import { cn } from "../../lib/utils";

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-2xl border border-white/20 bg-white/70 p-4 shadow-glass backdrop-blur-md", className)} {...props} />
));
Card.displayName = "Card";
