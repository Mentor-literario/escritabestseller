import Link from "next/link";
import { ArrowRight, LucideIcon } from "lucide-react";

interface ModuleCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  status?: "disponivel" | "bloqueado" | "concluido";
}

const statusStyles = {
  disponivel: "bg-cream-100 border-gold-300/40 hover:border-gold-400",
  bloqueado: "bg-cream-50 border-gold-300/20 opacity-60 cursor-not-allowed",
  concluido: "bg-green-50 border-green-200",
};

export default function ModuleCard({ title, description, href, icon, badge, status = "disponivel" }: ModuleCardProps) {
  const content = (
    <div className={`p-5 border rounded-lg transition-all duration-200 group ${statusStyles[status]}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-wine-600/10 flex items-center justify-center text-wine-600">
          {icon}
        </div>
        {badge && (
          <span className="text-xs bg-gold-100 text-gold-700 px-2 py-0.5 rounded-full font-medium">{badge}</span>
        )}
        {status === "concluido" && (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Concluído</span>
        )}
      </div>
      <h3 className="font-semibold text-elegant-800 mb-1 text-sm">{title}</h3>
      <p className="text-xs text-coffee-500 leading-relaxed mb-3">{description}</p>
      {status === "disponivel" && (
        <div className="flex items-center gap-1 text-xs text-wine-600 font-medium group-hover:gap-2 transition-all">
          Acessar módulo <ArrowRight className="w-3 h-3" />
        </div>
      )}
    </div>
  );

  if (status === "bloqueado") return content;
  return <Link href={href}>{content}</Link>;
}
