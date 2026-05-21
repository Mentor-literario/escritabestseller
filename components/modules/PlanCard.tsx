import Button from "@/components/ui/Button";
import { Check } from "lucide-react";

interface PlanCardProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta?: string;
}

export default function PlanCard({ name, price, description, features, highlighted = false, cta = "Começar agora" }: PlanCardProps) {
  return (
    <div className={`rounded-xl p-7 border flex flex-col gap-5 relative ${highlighted ? "bg-wine-700 border-wine-600 text-cream-50" : "bg-white border-gold-300/40 text-elegant-900"}`}>
      {highlighted && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gold-500 text-elegant-900 text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wide">
          Mais popular
        </div>
      )}
      <div>
        <h3 className={`font-bold text-xl font-serif mb-1 ${highlighted ? "text-cream-50" : "text-elegant-900"}`}>{name}</h3>
        <p className={`text-sm leading-relaxed ${highlighted ? "text-cream-200/80" : "text-coffee-500"}`}>{description}</p>
      </div>
      <div>
        <span className={`text-3xl font-bold font-serif ${highlighted ? "text-gold-300" : "text-wine-600"}`}>{price}</span>
        <span className={`text-sm ml-1 ${highlighted ? "text-cream-200/70" : "text-coffee-400"}`}>/mês</span>
      </div>
      <ul className="flex flex-col gap-2.5 flex-1">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${highlighted ? "text-gold-400" : "text-wine-600"}`} />
            <span className={highlighted ? "text-cream-100/90" : "text-elegant-800"}>{f}</span>
          </li>
        ))}
      </ul>
      <Button
        variant={highlighted ? "secondary" : "outline"}
        className="w-full justify-center"
      >
        {cta}
      </Button>
      <p className={`text-xs text-center ${highlighted ? "text-cream-200/50" : "text-coffee-400/60"}`}>
        Cancele a qualquer momento. Sem garantia de resultados.
      </p>
    </div>
  );
}
