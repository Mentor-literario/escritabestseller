import Link from "next/link";
import { Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

const planos = [
  {
    name: "Essencial",
    price: "R$ 37/mês",
    tagline: "Para começar da ideia à estrutura do livro.",
    features: [
      "Escrita BestSeller (diagnóstico + ideia + premissa)",
      "Criação de livro guiada por conversa",
      "Dossiê editorial básico em Meus Livros",
      "Biblioteca BestSeller básica",
      "Suporte por e-mail",
    ],
    highlighted: false,
    cta: "Começar com Essencial",
  },
  {
    name: "Pro",
    price: "R$ 67/mês",
    tagline: "Para construir livro, personagens, capítulos, títulos e sinopse com acompanhamento do Mentor.",
    features: [
      "Tudo do Essencial",
      "Mentor guia: títulos, sinopse, personagens e estrutura",
      "Capítulos e cenas no dossiê",
      "Checklist KDP completo",
      "Biblioteca BestSeller completa",
      "Suporte prioritário",
    ],
    highlighted: true,
    cta: "Começar com Pro",
  },
  {
    name: "BestSeller",
    price: "R$ 97/mês",
    tagline: "Para ter a jornada completa: livro, publicação, lançamento e vendas.",
    features: [
      "Tudo do Pro",
      "Estratégia completa de publicação e vendas",
      "Plano de lançamento guiado pelo Mentor",
      "Copies, Reels e anúncios no dossiê",
      "Múltiplos projetos em Meus Livros",
      "Suporte VIP",
    ],
    highlighted: false,
    cta: "Começar com BestSeller",
  },
];

export default function PlanosPage() {
  return (
    <div className="min-h-screen bg-ink-950 text-frost">
      {/* Nav */}
      <nav className="border-b border-purple-900/40 bg-ink-900/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg gradient-purple flex items-center justify-center shadow-glow-purple">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-frost leading-tight">Escrita</p>
              <p className="text-xs text-purple-400">BestSeller</p>
            </div>
          </Link>
          <Link
            href="/login"
            className="gradient-purple text-white text-sm font-semibold px-5 py-2 rounded-lg hover:shadow-glow-purple transition-all"
          >
            Já tenho acesso
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <h1 className="text-3xl md:text-4xl font-bold text-frost font-serif mb-4">Planos</h1>
          <p className="text-silver-400 max-w-xl mx-auto leading-relaxed">
            Todos os planos funcionam através da conversa com o Mentor. Você não preenche formulários — constrói seu livro conversando.
          </p>
          <p className="text-xs text-silver-400/50 mt-3">
            O acesso é liberado por e-mail após a confirmação da compra.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch mb-12">
          {planos.map((p) => (
            <div
              key={p.name}
              className={`rounded-xl overflow-hidden flex flex-col ${
                p.highlighted
                  ? "border border-purple-600/60 shadow-glow-purple bg-ink-900"
                  : "border border-purple-900/40 bg-ink-900"
              }`}
            >
              {p.highlighted && (
                <div className="gradient-purple text-center py-1.5">
                  <span className="text-xs font-semibold text-white flex items-center justify-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Mais popular
                  </span>
                </div>
              )}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-frost font-serif mb-1">{p.name}</h3>
                <p className="text-2xl font-bold text-purple-400 mb-2">{p.price}</p>
                <p className="text-xs text-silver-400 leading-relaxed mb-5">{p.tagline}</p>
                <ul className="space-y-2.5 flex-1 mb-5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-silver-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    p.highlighted
                      ? "gradient-purple text-white hover:shadow-glow-purple"
                      : "border border-purple-700/50 text-purple-300 hover:bg-purple-700/20"
                  }`}
                >
                  {p.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Access info */}
        <div className="bg-ink-900 border border-purple-900/30 rounded-xl p-6 text-center mb-8">
          <h3 className="font-semibold text-frost mb-2">Como funciona o acesso?</h3>
          <p className="text-sm text-silver-400 leading-relaxed max-w-2xl mx-auto">
            Após a compra, você recebe por e-mail o seu <strong className="text-frost">e-mail de acesso</strong> e uma <strong className="text-frost">senha inicial</strong>. Basta entrar em{" "}
            <Link href="/login" className="text-purple-400 underline hover:text-purple-300">
              Entrar na plataforma
            </Link>{" "}
            e começar a conversar com o Escrita BestSeller.
          </p>
          <Link href="/login" className="inline-flex items-center gap-2 mt-4 text-purple-400 text-sm font-medium hover:text-purple-300 transition-colors">
            Já tenho acesso — Entrar <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="text-center">
          <p className="text-xs text-silver-400/50 max-w-2xl mx-auto">
            <strong className="text-silver-300">Aviso importante:</strong> O Escrita BestSeller é uma plataforma de suporte à criação literária. Não garantimos vendas, rankings ou resultados comerciais específicos. Os resultados dependem do esforço e dedicação de cada pessoa.
          </p>
        </div>
      </div>
    </div>
  );
}
