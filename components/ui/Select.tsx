import { SelectHTMLAttributes } from "react";
import { clsx } from "clsx";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  hint?: string;
}

export default function Select({ label, options, hint, className, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-elegant-800">{label}</label>}
      <select
        className={clsx(
          "w-full px-4 py-2.5 bg-white border border-gold-300/60 rounded text-elegant-900 focus:outline-none focus:border-wine-500 focus:ring-1 focus:ring-wine-500/30 transition-colors text-sm appearance-none",
          className
        )}
        {...props}
      >
        <option value="">Selecione...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {hint && <p className="text-xs text-coffee-400">{hint}</p>}
    </div>
  );
}
