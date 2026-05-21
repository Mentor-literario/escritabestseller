import Link from "next/link";
import { Sparkles, Mail, ShoppingCart } from "lucide-react";

export default function CadastroPage() {
  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">

        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg gradient-purple flex items-center justify-center shadow-glow-purple">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <p className="font-bold text-frost leading-tight">Escrita</p>
            <p className="text-xs text-purple-400">BestSeller</p>
          </div>
        </Link>

        <div className="bg-ink-900 border border-purple-900/40 rounded-2xl p-8">
          <div className="w-14 h-14 rounded-full gradient-purple-subtle border border-purple-800/40 flex items-center justify-center mx-auto mb-5">
            <ShoppingCart className="w-6 h-6 text-purple-400" />
          </div>

          <h1 className="text-2xl font-bold text-frost font-serif mb-3">
            Seu acesso é criado após a compra
          </h1>

          <p className="text-silver-400 text-sm leading-relaxed mb-6">
            Depois da confirmação da compra, você receberá por e-mail seus dados de acesso para entrar no Escrita BestSeller.
          </p>

          <div className="bg-ink-800 border border-purple-900/30 rounded-xl p-4 mb-6 flex items-start gap-3 text-left">
            <Mail className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <p className="text-xs text-silver-400 leading-relaxed">
              Após a compra, você receberá um e-mail com seu <strong className="text-frost">e-mail de acesso</strong> e sua <strong className="text-frost">senha inicial</strong>. Basta usar esses dados para entrar na plataforma.
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href="/planos"
              className="block w-full gradient-purple text-white font-semibold py-3 rounded-lg hover:shadow-glow-purple transition-all text-sm"
            >
              Ver planos e adquirir acesso
            </Link>
            <Link
              href="/login"
              className="block w-full border border-purple-700/50 text-purple-300 hover:bg-purple-700/20 font-medium py-3 rounded-lg transition-all text-sm"
            >
              Já tenho acesso — Entrar
            </Link>
          </div>
        </div>

        <Link href="/" className="block mt-5 text-xs text-silver-400/40 hover:text-silver-400/70 transition-colors">
          ← Voltar ao início
        </Link>
      </div>
    </div>
  );
}
