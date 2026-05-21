"use client";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="h-14 border-b border-purple-900/40 bg-ink-900/80 backdrop-blur-sm flex items-center px-6 sticky top-0 z-10">
      <div>
        <h1 className="text-base font-semibold text-frost">{title}</h1>
        {subtitle && <p className="text-xs text-silver-400">{subtitle}</p>}
      </div>
    </header>
  );
}
