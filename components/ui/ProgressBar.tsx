interface ProgressBarProps {
  value: number;
  label?: string;
  showPercent?: boolean;
  color?: "wine" | "gold" | "coffee";
}

const colors = {
  wine: "bg-wine-600",
  gold: "bg-gold-500",
  coffee: "bg-coffee-500",
};

export default function ProgressBar({ value, label, showPercent = true, color = "wine" }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className="flex flex-col gap-1.5">
      {(label || showPercent) && (
        <div className="flex justify-between text-xs text-coffee-500">
          {label && <span>{label}</span>}
          {showPercent && <span>{clamped}%</span>}
        </div>
      )}
      <div className="h-2 bg-cream-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colors[color]}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
