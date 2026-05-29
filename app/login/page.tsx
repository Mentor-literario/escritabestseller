"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Mode = "login" | "forgot";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("E-mail ou senha incorretos. Verifique seus dados e tente novamente.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setLoading(true);

    await fetch("/api/reset-senha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: forgotEmail.trim() }),
    });

    setForgotSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg gradient-purple flex items-center justify-center shadow-glow-purple">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-bold text-frost leading-tight">Escrita</p>
              <p className="text-xs text-purple-400">BestSeller</p>
            </div>
          </Link>

          {mode === "login" ? (
            <>
              <h1 className="text-2xl font-bold text-frost font-serif">Entrar no Escrita BestSeller</h1>
              <p className="text-silver-400 text-sm mt-1">
                Use o e-mail da compra e a senha enviada para o seu e-mail.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-frost font-serif">Recuperar senha</h1>
              <p className="text-silver-400 text-sm mt-1">
                Informe o e-mail usado na compra.
              </p>
            </>
          )}
        </div>

        <div className="bg-ink-900 border border-purple-900/40 rounded-2xl p-8">
          {mode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="text-xs text-silver-400 block mb-1.5">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full px-4 py-3 bg-ink-800 border border-purple-900/50 rounded-lg text-frost placeholder-silver-400/30 focus:outline-none focus:border-purple-600 transition-colors text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-silver-400 block mb-1.5">Senha</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-ink-800 border border-purple-900/50 rounded-lg text-frost placeholder-silver-400/30 focus:outline-none focus:border-purple-600 transition-colors text-sm pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-silver-400/50 hover:text-silver-300 transition-colors"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && <p className="text-red-400 text-xs">{error}</p>}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setMode("forgot")}
                  className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Esqueci minha senha
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full gradient-purple text-white font-semibold py-3 rounded-lg hover:shadow-glow-purple transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>

              <p className="text-xs text-silver-400/50 text-center mt-2">
                A senha de acesso é enviada por e-mail após a confirmação da compra.
              </p>
            </form>
          ) : (
            <form onSubmit={handleForgot} className="space-y-5">
              {!forgotSent ? (
                <>
                  <p className="text-sm text-silver-400 leading-relaxed">
                    Informe o e-mail usado na compra. Se ele estiver associado a uma conta, enviaremos instruções para redefinir sua senha.
                  </p>
                  <div>
                    <label className="text-xs text-silver-400 block mb-1.5">E-mail</label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full px-4 py-3 bg-ink-800 border border-purple-900/50 rounded-lg text-frost placeholder-silver-400/30 focus:outline-none focus:border-purple-600 transition-colors text-sm"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full gradient-purple text-white font-semibold py-3 rounded-lg hover:shadow-glow-purple transition-all disabled:opacity-60"
                  >
                    {loading ? "Enviando..." : "Enviar instruções"}
                  </button>
                </>
              ) : (
                <div className="text-center space-y-4 py-4">
                  <div className="w-12 h-12 rounded-full gradient-purple-subtle border border-purple-800/40 flex items-center justify-center mx-auto">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                  </div>
                  <p className="text-sm text-silver-200">
                    Se este e-mail estiver cadastrado, você receberá instruções para redefinir sua senha.
                  </p>
                  <p className="text-xs text-silver-400/60">
                    Verifique também a pasta de spam.
                  </p>
                </div>
              )}
              <button
                type="button"
                onClick={() => { setMode("login"); setForgotSent(false); }}
                className="w-full text-sm text-purple-400 hover:text-purple-300 transition-colors text-center"
              >
                ← Voltar para o login
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
