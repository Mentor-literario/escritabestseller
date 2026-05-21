import Link from "next/link";
import { BookHeart, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-ink-950 flex flex-col">

      {/* Nav */}
      <nav className="px-6 py-5 flex items-center justify-between max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg gradient-purple flex items-center justify-center shadow-glow-purple">
            <BookHeart className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-frost leading-tight">Escrita</p>
            <p className="text-xs text-purple-400">BestSeller</p>
          </div>
        </div>
        <Link
          href="/login"
          className="text-sm text-silver-400 hover:text-frost transition-colors"
        >
          Entrar
        </Link>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-2xl mx-auto text-center">

          <div className="inline-flex items-center gap-2 bg-purple-900/30 border border-purple-800/40 rounded-full px-4 py-1.5 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span className="text-xs text-purple-300 font-medium">Organizador literário para escritoras independentes</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-frost font-serif leading-tight mb-6">
            Tudo do seu livro<br />organizado em um só lugar
          </h1>

          <p className="text-silver-400 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            O Escrita BestSeller é um organizador literário completo: personagens, estrutura, capítulos, sinopse, marketing e publicação na Amazon KDP — do primeiro rascunho ao lançamento.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 gradient-purple text-white font-semibold px-8 py-3.5 rounded-lg hover:shadow-glow-purple transition-all text-sm"
            >
              Entrar na plataforma <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/planos"
              className="inline-flex items-center gap-2 border border-purple-700/50 text-purple-300 hover:bg-purple-700/20 font-medium px-8 py-3.5 rounded-lg transition-all text-sm"
            >
              Ver planos
            </Link>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-6 text-center">
        <p className="text-xs text-silver-400/30">© 2025 Escrita BestSeller</p>
      </footer>

    </div>
  );
}
