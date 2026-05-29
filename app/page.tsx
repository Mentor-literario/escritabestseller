import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-ink-950 flex flex-col">

      {/* Nav */}
      <nav className="px-8 py-6 flex items-center justify-between max-w-5xl mx-auto w-full">
        <div className="flex flex-col">
          <span className="text-base font-serif font-bold text-frost leading-tight tracking-wide">Escrita</span>
          <span className="text-[10px] tracking-[0.18em] uppercase text-gold-500 font-sans font-medium">BestSeller</span>
        </div>
        <Link
          href="/login"
          className="text-xs tracking-[0.12em] uppercase text-silver-400 hover:text-frost transition-colors font-sans"
        >
          Entrar
        </Link>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-8 py-24">
        <div className="max-w-2xl mx-auto text-center">

          <div className="inline-flex items-center gap-2 mb-10">
            <div className="h-px w-8 bg-gold-500/40" />
            <span className="text-[11px] tracking-[0.2em] uppercase text-gold-500/80 font-sans">Organizador literário</span>
            <div className="h-px w-8 bg-gold-500/40" />
          </div>

          <h1 className="text-5xl md:text-6xl font-serif font-bold text-frost leading-[1.1] mb-8 tracking-tight">
            Do rascunho ao<br />
            <span className="text-gradient-gold">livro publicado.</span>
          </h1>

          <p className="text-silver-400 text-base leading-relaxed mb-12 max-w-lg mx-auto font-sans">
            Personagens, estrutura, capítulos, sinopse, marketing e publicação na Amazon KDP — tudo organizado em um só lugar, guiado pelo Mentor.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/planos"
              className="inline-flex items-center gap-2.5 gradient-gold text-ink-950 font-semibold px-8 py-3.5 rounded-lg hover:shadow-glow-gold transition-all text-sm font-sans tracking-wide"
            >
              Começar agora <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-silver-400 hover:text-frost font-medium px-6 py-3.5 transition-colors text-sm font-sans"
            >
              Já tenho acesso
            </Link>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="px-8 py-6 border-t border-gold-500/8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <p className="text-[11px] text-silver-400/30 font-sans tracking-wide">© 2025 Escrita BestSeller</p>
          <Link href="/planos" className="text-[11px] text-silver-400/30 hover:text-gold-500/60 transition-colors font-sans tracking-wide">
            Ver plano
          </Link>
        </div>
      </footer>

    </div>
  );
}
