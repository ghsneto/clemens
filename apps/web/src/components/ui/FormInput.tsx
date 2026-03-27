import { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
}

export function FormInput({ label, hint, className, ...props }: FormInputProps) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        className={cn(
          "h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100",
          className
        )}
        {...props}
      />
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </label>
  );
}

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Array<{ label: string; value: string }>;
}

export function FormSelect({ label, options, className, ...props }: FormSelectProps) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <select
        className={cn(
          "h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100",
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

interface FieldGroupProps {
  children: ReactNode;
}

export function FieldGroup({ children }: FieldGroupProps) {
  return <div className="grid gap-4 md:grid-cols-2">{children}</div>;
}
