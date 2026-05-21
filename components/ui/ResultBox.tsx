"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface ResultBoxProps {
  title?: string;
  children: React.ReactNode;
  copyText?: string;
}

export default function ResultBox({ title, children, copyText }: ResultBoxProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (copyText) {
      navigator.clipboard.writeText(copyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-cream-100 border border-gold-300/50 rounded-lg p-5">
      {(title || copyText) && (
        <div className="flex items-center justify-between mb-3">
          {title && <h4 className="font-semibold text-elegant-800 text-sm uppercase tracking-wide">{title}</h4>}
          {copyText && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs text-coffee-500 hover:text-wine-600 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copiado!" : "Copiar"}
            </button>
          )}
        </div>
      )}
      <div className="text-sm text-elegant-800 leading-relaxed">{children}</div>
    </div>
  );
}
