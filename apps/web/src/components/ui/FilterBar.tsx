import { ReactNode } from "react";
import { Card } from "./Card";

interface FilterBarProps {
  children: ReactNode;
}

export function FilterBar({ children }: FilterBarProps) {
  return <Card className="flex flex-wrap items-center gap-3 p-3">{children}</Card>;
}
