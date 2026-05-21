"use client";
import { useState, useEffect } from "react";
import { User, Lock, Save, CheckCircle, AlertCircle } from "lucide-react";
import { getUserProfile, saveUserProfile, type UserProfile } from "@/lib/storage";

const GENRES = ["Romance", "Suspense / Thriller", "Fantasia", "Romance Contemporâneo", "Romance Histórico", "Dark Romance", "Ficção Cristã"];
const OBJECTIVES = ["Concluir o livro", "Publicar na Amazon", "Vender mais exemplares", "Começar do zero"];

type FeedbackType = "success" | "error" | null;

function Feedback({ type, message }: { type: FeedbackType; message: string }) {
  if (!type) return null;
  return (
    <div className={`flex items-center gap-2 text-xs p-3 rounded-lg ${
      type === "success"
        ? "bg-green-900/30 border border-green-800/40 text-green-400"
        : "bg-red-900/30 border border-red-800/40 text-red-400"
    }`}>
      {type === "success" ? <CheckCircle className="w-3.5 h-3.5 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
      {message}
    </div>
  );
}

export default function ConfiguracoesPage() {
  const [profile, setProfile] = useState<UserProfile>({
    name: "", email: "", genre: "", currentObjective: "",
    divulgationPreference: "nao-aparecer",
  });
  const [profileFeedback, setProfileFeedback] = useState<{ type: FeedbackType; message: string }>({ type: null, message: "" });

  // Password fields
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [passFeedback, setPassFeedback] = useState<{ type: FeedbackType; message: string }>({ type: null, message: "" });

  useEffect(() => {
    const p = getUserProfile();
    if (p) setProfile(p);
  }, []);

  const set = (key: keyof UserProfile, value: string) =>
    setProfile((f) => ({ ...f, [key]: value }));

  const handleSaveProfile = () => {
    saveUserProfile(profile);
    window.dispatchEvent(new Event("profileUpdated"));
    setProfileFeedback({ type: "success", message: "Perfil salvo com sucesso." });
    setTimeout(() => setProfileFeedback({ type: null, message: "" }), 3000);
  };

  const handleChangePassword = () => {
    if (!newPass || !confirmPass) {
      setPassFeedback({ type: "error", message: "Preencha todos os campos de senha." });
      return;
    }
    if (newPass.length < 8) {
      setPassFeedback({ type: "error", message: "A nova senha deve ter pelo menos 8 caracteres." });
      return;
    }
    if (newPass !== confirmPass) {
      setPassFeedback({ type: "error", message: "Nova senha e confirmação não coincidem." });
      return;
    }
    const updated = { ...profile, password: newPass };
    saveUserProfile(updated);
    setProfile(updated);
    setCurrentPass("");
    setNewPass("");
    setConfirmPass("");
    setPassFeedback({ type: "success", message: "Senha alterada com sucesso." });
    setTimeout(() => setPassFeedback({ type: null, message: "" }), 3000);
  };

  const inputCls = "w-full px-3 py-2.5 bg-ink-800 border border-purple-900/50 rounded-lg text-sm text-frost placeholder-silver-400/40 focus:outline-none focus:border-purple-600 transition-colors";
  const selectCls = `${inputCls} cursor-pointer`;

  return (
    <div className="min-h-screen bg-ink-950">
      <div className="px-6 py-4 border-b border-purple-900/40 bg-ink-900">
        <h1 className="text-base font-semibold text-frost">Configurações</h1>
        <p className="text-xs text-silver-400">Gerencie seu perfil e preferências</p>
      </div>

      <div className="p-6 max-w-2xl mx-auto space-y-6">

        {/* Dados do perfil */}
        <div className="bg-ink-900 border border-purple-900/40 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <User className="w-4 h-4 text-purple-400" />
            <h3 className="font-semibold text-frost text-sm">Dados do perfil</h3>
          </div>

          <div className="flex items-center gap-4 mb-5">
            <div className="w-12 h-12 rounded-full gradient-purple flex items-center justify-center text-lg font-bold text-white shrink-0">
              {profile.name.charAt(0).toUpperCase() || "?"}
            </div>
            <div>
              <p className="text-sm font-medium text-frost">{profile.name || "Sem nome"}</p>
              <p className="text-xs text-silver-400">{profile.email || "E-mail não definido"}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-silver-400 mb-1.5">Nome</label>
              <input value={profile.name} onChange={(e) => set("name", e.target.value)} placeholder="Como o Mentor deve te chamar" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs text-silver-400 mb-1.5">E-mail de acesso</label>
              <input value={profile.email ?? ""} onChange={(e) => set("email", e.target.value)} type="email" placeholder="seu@email.com" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs text-silver-400 mb-1.5">Gênero literário principal</label>
              <select value={profile.genre} onChange={(e) => set("genre", e.target.value)} className={selectCls}>
                <option value="">Selecione...</option>
                {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-silver-400 mb-1.5">Objetivo atual</label>
              <select value={profile.currentObjective} onChange={(e) => set("currentObjective", e.target.value)} className={selectCls}>
                <option value="">Selecione...</option>
                {OBJECTIVES.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-silver-400 mb-2">Preferência de divulgação</label>
              <div className="flex gap-3">
                {[
                  { value: "aparecer", label: "Quero aparecer" },
                  { value: "nao-aparecer", label: "Prefiro não aparecer" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => set("divulgationPreference", opt.value as "aparecer" | "nao-aparecer")}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-all ${
                      profile.divulgationPreference === opt.value
                        ? "gradient-purple text-white border-purple-600"
                        : "border-purple-900/50 text-silver-400 hover:border-purple-700/50 hover:text-frost"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {profileFeedback.type && <div className="mt-4"><Feedback type={profileFeedback.type} message={profileFeedback.message} /></div>}

          <div className="flex justify-end mt-5">
            <button
              onClick={handleSaveProfile}
              className="flex items-center gap-2 px-5 py-2.5 gradient-purple text-white text-sm font-semibold rounded-lg hover:shadow-glow-purple transition-all"
            >
              <Save className="w-4 h-4" /> Salvar alterações
            </button>
          </div>
        </div>

        {/* Segurança da conta */}
        <div className="bg-ink-900 border border-purple-900/40 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-4 h-4 text-purple-400" />
            <h3 className="font-semibold text-frost text-sm">Segurança da conta</h3>
          </div>
          <p className="text-xs text-silver-400 mb-5">
            Use esta área para trocar sua senha de acesso. Por segurança, escolha uma senha com pelo menos 8 caracteres.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-silver-400 mb-1.5">Senha atual</label>
              <input type="password" value={currentPass} onChange={(e) => setCurrentPass(e.target.value)} placeholder="••••••••" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs text-silver-400 mb-1.5">Nova senha</label>
              <input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} placeholder="Mínimo 8 caracteres" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs text-silver-400 mb-1.5">Confirmar nova senha</label>
              <input type="password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} placeholder="Repita a nova senha" className={inputCls} />
            </div>
          </div>

          {passFeedback.type && <div className="mt-4"><Feedback type={passFeedback.type} message={passFeedback.message} /></div>}

          <div className="flex justify-end mt-5">
            <button
              onClick={handleChangePassword}
              className="flex items-center gap-2 px-5 py-2.5 border border-purple-700/50 text-purple-300 hover:bg-purple-700/20 text-sm font-medium rounded-lg transition-all"
            >
              <Lock className="w-4 h-4" /> Alterar senha
            </button>
          </div>
        </div>

        {/* Plano atual */}
        <div className="bg-ink-900 border border-purple-900/30 rounded-xl p-5">
          <h3 className="font-semibold text-frost text-sm mb-2">Plano atual</h3>
          <p className="text-xs text-silver-400">
            Seu plano será gerenciado pela plataforma de pagamento. Em caso de dúvidas sobre sua assinatura, entre em contato pelo e-mail de suporte.
          </p>
        </div>

      </div>
    </div>
  );
}
