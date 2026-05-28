"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function ResetSenhaForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const erro = searchParams.get("erro");
    if (erro === "link-invalido") {
      setError("Link inválido ou expirado. Solicite um novo e-mail.");
      return;
    }

    // Sessão já estabelecida pelo /auth/callback — só confirmar que há usuária logada
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setReady(true);
      } else {
        setError("Link inválido ou expirado. Solicite um novo e-mail.");
      }
    });
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError("Erro ao criar senha. Tente novamente.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg gradient-purple flex items-center justify-center shadow-glow-purple">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-bold text-frost leading-tight">Escrita</p>
              <p className="text-xs text-purple-400">BestSeller</p>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-frost font-serif">Criar sua senha</h1>
          <p className="text-silver-400 text-sm mt-1">Escolha uma senha para acessar a plataforma.</p>
        </div>

        <div className="bg-ink-900 border border-purple-900/40 rounded-2xl p-8">
          {error && !ready ? (
            <p className="text-red-400 text-sm text-center">{error}</p>
          ) : !ready ? (
            <p className="text-silver-400 text-sm text-center">Verificando link...</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-xs text-silver-400 block mb-1.5">Nova senha</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
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
              <div>
                <label className="text-xs text-silver-400 block mb-1.5">Confirmar senha</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repita a senha"
                  className="w-full px-4 py-3 bg-ink-800 border border-purple-900/50 rounded-lg text-frost placeholder-silver-400/30 focus:outline-none focus:border-purple-600 transition-colors text-sm"
                  required
                />
              </div>

              {error && <p className="text-red-400 text-xs">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full gradient-purple text-white font-semibold py-3 rounded-lg hover:shadow-glow-purple transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Salvando..." : "Criar senha e entrar"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetSenhaPage() {
  return (
    <Suspense>
      <ResetSenhaForm />
    </Suspense>
  );
}
