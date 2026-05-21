import { InputHTMLAttributes } from "react";
import { clsx } from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
}

export default function Input({ label, hint, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-elegant-800">{label}</label>}
      <input
        className={clsx(
          "w-full px-4 py-2.5 bg-white border border-gold-300/60 rounded text-elegant-900 placeholder-coffee-400/60 focus:outline-none focus:border-wine-500 focus:ring-1 focus:ring-wine-500/30 transition-colors text-sm",
          className
        )}
        {...props}
      />
      {hint && <p className="text-xs text-coffee-400">{hint}</p>}
    </div>
  );
}
