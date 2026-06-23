import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function Input({ label, error, className, id, ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="field-label block">
        {label}
      </label>
      <input id={id} className={cn("field-input", className)} {...props} />
      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
