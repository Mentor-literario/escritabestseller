import Link from "next/link";
import { Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

const features = [
  "Mentor literário com IA — constrói o livro conversando",
  "Diagnóstico da sua ideia e premissa",
  "Criação de personagens, cenas e estrutura de capítulos",
  "Dossiê editorial completo em Meus Livros",
  "Títulos e sinopse guiados pelo Mentor",
  "Checklist KDP para publicação na Amazon",
  "Estratégia de lançamento e vendas",
  "Biblioteca BestSeller completa",
];

const KIWIFY_URL = "https://pay.kiwify.com.br/mVTh9cg";

export default function PlanosPage() {
  return (
    <div className="min-h-screen bg-ink-950 text-frost">
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

      <div className="max-w-lg mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-frost font-serif mb-4">
            Comece a escrever seu livro hoje
          </h1>
          <p className="text-silver-400 leading-relaxed">
            Uma assinatura. Acesso completo ao Mentor literário e a tudo que você precisa para sair da ideia ao livro publicado.
          </p>
        </div>

        <div className="border border-purple-600/60 shadow-glow-purple bg-ink-900 rounded-2xl overflow-hidden mb-8">
          <div className="gradient-purple text-center py-2">
            <span className="text-xs font-semibold text-white flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Acesso completo
            </span>
          </div>

          <div className="p-8">
            <h2 className="text-2xl font-bold text-frost font-serif mb-1">Escrita BestSeller</h2>
            <p className="text-sm text-silver-400 mb-6">Tudo incluso. Sem limites.</p>

            <ul className="space-y-3 mb-8">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-silver-200">
                  <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>

            <a
              href={KIWIFY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full gradient-purple text-white font-semibold py-3.5 rounded-xl hover:shadow-glow-purple transition-all text-base"
            >
              Assinar agora <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="bg-ink-900 border border-purple-900/30 rounded-xl p-6 text-center mb-6">
          <h3 className="font-semibold text-frost mb-2">Como funciona o acesso?</h3>
          <p className="text-sm text-silver-400 leading-relaxed max-w-sm mx-auto">
            Após a compra, você recebe um e-mail com seu <strong className="text-frost">e-mail</strong> e <strong className="text-frost">senha de acesso</strong>. É só entrar e começar.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 mt-4 text-purple-400 text-sm font-medium hover:text-purple-300 transition-colors"
          >
            Já tenho acesso — Entrar <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <p className="text-xs text-silver-400/50 text-center max-w-sm mx-auto">
          <strong className="text-silver-300">Aviso:</strong> O Escrita BestSeller é uma plataforma de apoio à criação literária. Os resultados dependem do esforço de cada pessoa.
        </p>
      </div>
    </div>
  );
}
