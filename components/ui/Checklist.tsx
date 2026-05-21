"use client";
import { useState } from "react";
import { Check } from "lucide-react";

interface ChecklistItem {
  id: string;
  label: string;
  description?: string;
}

interface ChecklistProps {
  items: ChecklistItem[];
  title?: string;
}

export default function Checklist({ items, title }: ChecklistProps) {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-3">
      {title && <h3 className="font-semibold text-elegant-800 text-sm uppercase tracking-wide">{title}</h3>}
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => toggle(item.id)}
          className="flex items-start gap-3 text-left group"
        >
          <div className={`mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${checked.has(item.id) ? "bg-wine-600 border-wine-600" : "border-gold-400 group-hover:border-wine-500"}`}>
            {checked.has(item.id) && <Check className="w-3 h-3 text-white" />}
          </div>
          <div>
            <p className={`text-sm font-medium transition-colors ${checked.has(item.id) ? "line-through text-coffee-400" : "text-elegant-800"}`}>
              {item.label}
            </p>
            {item.description && <p className="text-xs text-coffee-400 mt-0.5">{item.description}</p>}
          </div>
        </button>
      ))}
      <p className="text-xs text-coffee-400 mt-1">{checked.size}/{items.length} concluídos</p>
    </div>
  );
}
