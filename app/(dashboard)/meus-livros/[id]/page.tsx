"use client";
import { useEffect, useState, useCallback, type ReactNode } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft, ChevronDown, Edit3, Save, Check, Plus, Trash2, BookOpen, X, Calendar,
} from "lucide-react";
import {
  getBooks,
  updateBookTitle,
  updateBookGenre,
  updateBookTextField,
  updateBookChecklist,
  updateSynopses,
  updateCharacters,
  updateChapters,
  updateNotesList,
  updateActsContent,
  updateMarketingCalendar,
  updatePublishingInfo,
  updateSceneIdeasList,
  getBookProgress,
  type Book,
  type ChecklistItem,
  type Character,
  type Chapter,
  type ChapterStatus,
  type ActId,
  type SceneIdea,
  type Note,
  type MarketingItem,
  type MarketingChannel,
  type MarketingStatus,
  type PublishingInfo,
} from "@/lib/supabase-storage";

// ─── Tab config ───────────────────────────────────────────────────────────────

const TABS = [
  "Visão geral", "Premissa", "Sinopse", "Personagens",
  "Estrutura", "Capítulos", "Cenas", "Anotações", "Divulgação", "Publicação", "Checklist",
] as const;

type Tab = (typeof TABS)[number];

// ─── Acts structure definition ────────────────────────────────────────────────

const ACTS_STRUCTURE = [
  {
    id: "ato1" as ActId,
    label: "Ato 1 — Apresentação",
    colorBorder: "border-blue-700/40",
    colorBg: "bg-blue-900/20",
    colorText: "text-blue-300",
    colorBadge: "bg-blue-900/40 text-blue-300",
    sections: [
      "Situação inicial da protagonista",
      "Mundo comum",
      "Problema ou desejo principal",
      "Incidente que muda tudo",
      "Primeiro ponto de virada",
    ],
  },
  {
    id: "ato2" as ActId,
    label: "Ato 2 — Desenvolvimento e conflito",
    colorBorder: "border-purple-700/40",
    colorBg: "bg-purple-900/20",
    colorText: "text-purple-300",
    colorBadge: "bg-purple-900/40 text-purple-300",
    sections: [
      "Primeiras tentativas da protagonista",
      "Obstáculos crescentes",
      "Relações importantes",
      "Ponto médio",
      "Crise emocional ou grande complicação",
    ],
  },
  {
    id: "ato3" as ActId,
    label: "Ato 3 — Clímax e resolução",
    colorBorder: "border-orange-700/40",
    colorBg: "bg-orange-900/20",
    colorText: "text-orange-300",
    colorBadge: "bg-orange-900/40 text-orange-300",
    sections: [
      "Decisão final da protagonista",
      "Confronto principal",
      "Clímax",
      "Resolução emocional",
      "Gancho final ou fechamento",
    ],
  },
];

const ACT_LABELS: Record<ActId, string> = {
  ato1: "Ato 1",
  ato2: "Ato 2",
  ato3: "Ato 3",
};

// ─── Chapter status helpers ───────────────────────────────────────────────────

const STATUS_LABELS: Record<ChapterStatus, string> = {
  rascunho: "Rascunho",
  "em-escrita": "Em escrita",
  revisao: "Revisão",
  concluido: "Concluído",
};

const STATUS_COLORS: Record<ChapterStatus, string> = {
  rascunho: "text-silver-400",
  "em-escrita": "text-blue-400",
  revisao: "text-yellow-400",
  concluido: "text-green-400",
};

const STATUS_BG: Record<ChapterStatus, string> = {
  rascunho: "bg-ink-700 text-silver-400",
  "em-escrita": "bg-blue-900/40 text-blue-400",
  revisao: "bg-yellow-900/40 text-yellow-400",
  concluido: "bg-green-900/40 text-green-400",
};

// ─── Sidebar data indicator ───────────────────────────────────────────────────

function getHasData(book: Book, tab: Tab): boolean {
  switch (tab) {
    case "Premissa":    return !!book.premise?.trim();
    case "Sinopse":     return !!(book.shortSynopsis?.trim() || book.longSynopsis?.trim());
    case "Personagens": return (book.charactersList?.length ?? 0) > 0 || !!book.characters?.trim();
    case "Estrutura":   return !!(book.actsContent && Object.values(book.actsContent).some(a => Object.values(a).some(v => v?.trim())));
    case "Capítulos":   return (book.chaptersList?.length ?? 0) > 0;
    case "Cenas":       return (book.sceneIdeasList?.length ?? 0) > 0 || !!book.scenes?.trim();
    case "Anotações":   return (book.notesList?.length ?? 0) > 0 || !!book.notes?.trim();
    case "Divulgação":  return (book.marketingCalendar?.length ?? 0) > 0;
    case "Publicação":  return !!(book.publishingInfo?.keywords?.length || book.publishingInfo?.publishDate);
    case "Checklist":   return (book.checklist?.length ?? 0) > 0;
    default:            return false;
  }
}

// ─── Overview tab ─────────────────────────────────────────────────────────────

function OverviewTab({ book }: { book: Book }) {
  const progress = getBookProgress(book);
  const hasActsContent = !!(book.actsContent && Object.values(book.actsContent).some(a => Object.values(a).some(v => v?.trim())));

  const sections: [string, boolean][] = [
    ["Premissa",    !!book.premise?.trim()],
    ["Sinopse",     !!(book.shortSynopsis?.trim() || book.longSynopsis?.trim())],
    ["Personagens", (book.charactersList?.length ?? 0) > 0 || !!book.characters?.trim()],
    ["Estrutura",   hasActsContent],
    ["Capítulos",   (book.chaptersList?.length ?? 0) > 0],
    ["Cenas",       (book.sceneIdeasList?.length ?? 0) > 0 || !!book.scenes?.trim()],
    ["Anotações",   (book.notesList?.length ?? 0) > 0 || !!book.notes?.trim()],
    ["Divulgação",  (book.marketingCalendar?.length ?? 0) > 0],
    ["Publicação",  !!(book.publishingInfo?.keywords?.length || book.publishingInfo?.publishDate)],
    ["Checklist",   (book.checklist?.length ?? 0) > 0],
  ];

  const filled = sections.filter(([, has]) => has).length;
  const checklistDone = book.checklist?.filter((i) => i.done).length ?? 0;
  const checklistTotal = book.checklist?.length ?? 0;
  const chapters = book.chaptersList ?? [];
  const chaptersDone = chapters.filter((c) => c.status === "concluido").length;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Gênero", value: book.genre || "—" },
          { label: "Preenchimento", value: `${progress}%` },
          { label: "Seções", value: `${filled} / ${sections.length}` },
          { label: "Checklist", value: checklistTotal > 0 ? `${checklistDone} / ${checklistTotal}` : "—" },
        ].map(({ label, value }) => (
          <div key={label} className="bg-ink-800 border border-purple-900/30 rounded-xl p-4">
            <p className="text-xs text-silver-400/60 uppercase tracking-wide mb-1">{label}</p>
            <p className="text-sm font-semibold text-frost">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-ink-800 border border-purple-900/30 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-frost mb-4">Seções do livro</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {sections.map(([label, has]) => (
            <div key={label} className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg border ${
              has ? "border-purple-700/50 bg-purple-900/20 text-purple-300"
                  : "border-ink-600 bg-ink-900 text-silver-400/40"
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${has ? "bg-purple-400" : "bg-ink-600"}`} />
              {label}
            </div>
          ))}
        </div>
      </div>

      {chapters.length > 0 && (
        <div className="bg-ink-800 border border-purple-900/30 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-frost mb-3">Progresso dos capítulos</h3>
          <div className="flex items-center gap-6 mb-3">
            <span className="text-xs text-silver-400">{chapters.length} capítulos</span>
            <span className="text-xs text-green-400">{chaptersDone} concluídos</span>
          </div>
          <div className="w-full h-1.5 bg-ink-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-green-500 transition-all"
              style={{ width: `${chapters.length > 0 ? Math.round((chaptersDone / chapters.length) * 100) : 0}%` }}
            />
          </div>
        </div>
      )}

      <div className="bg-ink-800 border border-purple-900/30 rounded-xl p-5">
        <p className="text-xs text-silver-400 mb-1">Última atualização</p>
        <p className="text-sm text-frost">
          {new Date(book.updatedAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
        </p>
      </div>
    </div>
  );
}

// ─── Premissa tab (guided template) ──────────────────────────────────────────

function PremissaTab({ book, onSaved }: {
  book: Book;
  onSaved: (value: string) => void;
}) {
  const TEMPLATE = `Quando [protagonista], uma pessoa que [característica principal ou situação inicial], se vê diante de [acontecimento que muda tudo], ela precisa [objetivo principal da história]. Mas, para conseguir isso, terá que enfrentar [conflito principal], enquanto descobre que [risco emocional, segredo, dilema ou transformação].`;

  const [value, setValue] = useState(book.premise ?? "");
  const [saved, setSaved] = useState(false);

  useEffect(() => { setValue(book.premise ?? ""); }, [book.premise]);

  const handleSave = async () => {
    await updateBookTextField(book.id, "premise", value);
    onSaved(value);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const useTemplate = () => { setValue(TEMPLATE); setSaved(false); };
  const isDirty = value !== (book.premise ?? "");

  return (
    <div className="space-y-4">
      <div className="bg-ink-800 border border-purple-900/30 rounded-xl p-4">
        <p className="text-xs text-silver-400 font-semibold uppercase tracking-wide mb-3">Uma boa premissa tem 6 elementos</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            ["1.", "Protagonista",    "Quem é a personagem principal"],
            ["2.", "Situação inicial","O mundo antes da virada"],
            ["3.", "Incidente",       "O acontecimento que muda tudo"],
            ["4.", "Objetivo",        "O que ela precisa conquistar"],
            ["5.", "Conflito",        "O que se opõe a ela"],
            ["6.", "Risco emocional", "O que ela pode perder ou descobrir"],
          ].map(([num, label, desc]) => (
            <div key={label} className="flex items-start gap-2">
              <span className="text-xs text-purple-400 font-bold mt-0.5 shrink-0">{num}</span>
              <div>
                <p className="text-xs text-frost font-medium">{label}</p>
                <p className="text-xs text-silver-400/60">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-purple-900/10 border border-purple-700/30 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-purple-400 font-semibold uppercase tracking-wide">Modelo de premissa</p>
          {!value.trim() && (
            <button
              onClick={useTemplate}
              className="text-xs text-purple-400 hover:text-purple-300 border border-purple-700/50 px-2 py-1 rounded-lg transition-colors"
            >
              Usar modelo
            </button>
          )}
        </div>
        <p className="text-xs text-silver-300/80 leading-relaxed italic">
          "Quando{" "}<span className="text-purple-400 not-italic">[protagonista]</span>, uma pessoa que{" "}
          <span className="text-purple-400 not-italic">[característica / situação inicial]</span>, se vê diante de{" "}
          <span className="text-purple-400 not-italic">[acontecimento que muda tudo]</span>, ela precisa{" "}
          <span className="text-purple-400 not-italic">[objetivo principal]</span>. Mas, para conseguir isso,
          terá que enfrentar{" "}<span className="text-purple-400 not-italic">[conflito principal]</span>,
          enquanto descobre que{" "}<span className="text-purple-400 not-italic">[risco emocional, segredo, dilema]</span>."
        </p>
      </div>

      <textarea
        value={value}
        onChange={(e) => { setValue(e.target.value); setSaved(false); }}
        placeholder="Escreva a premissa do seu livro aqui. Use o modelo acima como guia — substitua os trechos entre colchetes pelo que acontece na sua história."
        rows={7}
        className="w-full px-4 py-3 bg-ink-800 border border-purple-900/40 rounded-xl text-sm text-silver-200 placeholder-silver-400/30 focus:outline-none focus:border-purple-600 transition-colors resize-none leading-relaxed"
      />
      <div className="flex items-center justify-between">
        <p className="text-xs text-silver-400/40">{value.length > 0 ? `${value.length} caracteres` : ""}</p>
        <button
          onClick={handleSave}
          disabled={!isDirty && !saved}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            saved ? "bg-green-900/40 border border-green-700/50 text-green-400"
              : isDirty ? "gradient-purple text-white hover:shadow-glow-purple"
              : "bg-ink-800 border border-purple-900/30 text-silver-400/40 cursor-not-allowed"
          }`}
        >
          {saved ? <><Check className="w-3.5 h-3.5" /> Salvo</> : <><Save className="w-3.5 h-3.5" /> Salvar</>}
        </button>
      </div>
    </div>
  );
}

// ─── Synopsis tab ─────────────────────────────────────────────────────────────

function SynopsisTab({ book, onSaved }: {
  book: Book;
  onSaved: (short: string, long: string) => void;
}) {
  const [shortText, setShort] = useState(book.shortSynopsis ?? book.synopsis ?? "");
  const [longText, setLong] = useState(book.longSynopsis ?? "");
  const [saved, setSaved] = useState(false);

  const isDirty =
    shortText !== (book.shortSynopsis ?? book.synopsis ?? "") ||
    longText !== (book.longSynopsis ?? "");

  const handleSave = async () => {
    await updateSynopses(book.id, shortText, longText);
    onSaved(shortText, longText);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs text-silver-400 uppercase tracking-wide mb-1 font-semibold">Sinopse curta</label>
        <p className="text-xs text-silver-400/50 mb-2">Para a capa ou apresentações rápidas — até 3 frases.</p>
        <textarea
          value={shortText}
          onChange={(e) => { setShort(e.target.value); setSaved(false); }}
          rows={4}
          placeholder="Descreva o livro de forma atrativa em poucas frases..."
          className="w-full px-4 py-3 bg-ink-800 border border-purple-900/40 rounded-xl text-sm text-silver-200 placeholder-silver-400/30 focus:outline-none focus:border-purple-600 transition-colors resize-none leading-relaxed"
        />
        <p className="text-xs text-silver-400/40 mt-1">{shortText.length} caracteres</p>
      </div>
      <div>
        <label className="block text-xs text-silver-400 uppercase tracking-wide mb-1 font-semibold">Sinopse longa</label>
        <p className="text-xs text-silver-400/50 mb-2">Resumo completo da história — para a Amazon ou editoras.</p>
        <textarea
          value={longText}
          onChange={(e) => { setLong(e.target.value); setSaved(false); }}
          rows={12}
          placeholder="Escreva a sinopse completa com início, meio e fim da história..."
          className="w-full px-4 py-3 bg-ink-800 border border-purple-900/40 rounded-xl text-sm text-silver-200 placeholder-silver-400/30 focus:outline-none focus:border-purple-600 transition-colors resize-none leading-relaxed"
        />
        <p className="text-xs text-silver-400/40 mt-1">{longText.length} caracteres</p>
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={!isDirty && !saved}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            saved ? "bg-green-900/40 border border-green-700/50 text-green-400"
              : isDirty ? "gradient-purple text-white hover:shadow-glow-purple"
              : "bg-ink-800 border border-purple-900/30 text-silver-400/40 cursor-not-allowed"
          }`}
        >
          {saved ? <><Check className="w-3.5 h-3.5" /> Salvo</> : <><Save className="w-3.5 h-3.5" /> Salvar</>}
        </button>
      </div>
    </div>
  );
}

// ─── Personagens tab (structured character cards) ─────────────────────────────

const CHARACTER_ROLES = [
  "Protagonista", "Antagonista", "Par romântico", "Melhor amigo/a", "Pai", "Mãe",
  "Tio/a", "Irmão/irmã", "Mentor", "Rival", "Vilão", "Personagem secundário", "Outro",
];

const ZODIAC_SIGNS = [
  "Áries", "Touro", "Gêmeos", "Câncer", "Leão", "Virgem",
  "Libra", "Escorpião", "Sagitário", "Capricórnio", "Aquário", "Peixes",
];

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-1 h-4 bg-purple-500 rounded-full shrink-0" />
      <p className="text-xs text-silver-300 uppercase tracking-wide font-bold">{label}</p>
    </div>
  );
}

function FieldGroup({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div>
      <label className="text-xs text-silver-400 mb-0.5 block">{label}</label>
      {hint && <p className="text-xs text-silver-400/40 italic mb-1 leading-relaxed">{hint}</p>}
      {children}
    </div>
  );
}

function PersonagensTab({ book, onSaved }: {
  book: Book;
  onSaved: (characters: Character[]) => void;
}) {
  const [characters, setCharacters] = useState<Character[]>(() => book.charactersList ?? []);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const inputCls = "w-full px-3 py-2 bg-ink-900 border border-purple-900/40 rounded-lg text-sm text-frost placeholder-silver-400/30 focus:outline-none focus:border-purple-600 transition-colors";
  const textareaCls = "w-full px-3 py-2 bg-ink-900 border border-purple-900/40 rounded-lg text-sm text-silver-200 placeholder-silver-400/30 focus:outline-none focus:border-purple-600 transition-colors resize-none leading-relaxed";
  const selectCls = "w-full px-3 py-2 bg-ink-900 border border-purple-900/40 rounded-lg text-sm text-frost focus:outline-none focus:border-purple-600 transition-colors cursor-pointer";

  const addCharacter = () => {
    const newChar: Character = {
      id: Date.now().toString(),
      name: "", role: "", age: "",
      hairColor: "", skinColor: "", eyeColor: "", height: "",
      appearance: "", distinctiveFeatures: "",
      personality: "", sign: "",
      narrativeRole: "", objective: "",
      internalConflict: "", externalConflict: "",
      relationships: "", impactOnProtagonist: "",
      backstory: "", reasonToExist: "",
      arc: "", notes: "",
    };
    setCharacters((prev) => [...prev, newChar]);
    setExpandedId(newChar.id);
    setSaved(false);
  };

  const updateChar = (id: string, patch: Partial<Character>) => {
    setCharacters((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
    setSaved(false);
  };

  const deleteChar = (id: string) => {
    setCharacters((prev) => prev.filter((c) => c.id !== id));
    setSaved(false);
  };

  const handleSave = async () => {
    await updateCharacters(book.id, characters);
    onSaved(characters);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-silver-400">
          {characters.length} {characters.length === 1 ? "personagem" : "personagens"}
        </p>
        <button
          onClick={handleSave}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            saved ? "bg-green-900/40 border border-green-700/50 text-green-400"
              : "gradient-purple text-white hover:shadow-glow-purple"
          }`}
        >
          {saved ? <><Check className="w-3 h-3" /> Salvo</> : <><Save className="w-3 h-3" /> Salvar</>}
        </button>
      </div>

      {characters.length === 0 && (
        <div className="text-center py-12 bg-ink-800 rounded-xl border border-purple-900/30">
          <div className="w-12 h-12 rounded-full bg-purple-900/30 border border-purple-800/40 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-6 h-6 text-purple-500/50" />
          </div>
          <p className="text-silver-400 text-sm mb-1">Nenhum personagem ainda.</p>
          <p className="text-silver-400/50 text-xs">Clique em "Adicionar personagem" para criar a primeira ficha.</p>
        </div>
      )}

      {characters.map((char) => (
        <div key={char.id} className="bg-ink-800 border border-purple-900/30 rounded-xl overflow-hidden">
          {/* Character header */}
          <div
            className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-ink-700 transition-colors"
            onClick={() => setExpandedId(expandedId === char.id ? null : char.id)}
          >
            <div className="w-9 h-9 rounded-lg bg-purple-900/40 border border-purple-700/40 flex items-center justify-center shrink-0">
              <span className="text-base font-bold text-purple-300">
                {char.name ? char.name.charAt(0).toUpperCase() : "?"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-frost font-medium truncate">
                {char.name || "Personagem sem nome"}
              </p>
              {char.role && (
                <p className="text-xs text-silver-400/60 truncate">{char.role}</p>
              )}
            </div>
            <ChevronDown className={`w-4 h-4 text-silver-400 transition-transform shrink-0 ${expandedId === char.id ? "rotate-180" : ""}`} />
          </div>

          {/* Character expanded form */}
          {expandedId === char.id && (
            <div className="px-4 pb-5 pt-3 space-y-6 border-t border-purple-900/30">

              {/* ── DADOS BÁSICOS */}
              <div>
                <SectionHeader label="Dados básicos" />
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <FieldGroup label="Nome do personagem">
                      <input
                        value={char.name}
                        onChange={(e) => updateChar(char.id, { name: e.target.value })}
                        placeholder="Ex: Valentina Sousa"
                        className={inputCls}
                      />
                    </FieldGroup>
                    <FieldGroup label="Idade">
                      <input
                        value={char.age}
                        onChange={(e) => updateChar(char.id, { age: e.target.value })}
                        placeholder="Ex: 28 anos"
                        className={inputCls}
                      />
                    </FieldGroup>
                  </div>
                  <FieldGroup label="Função na história">
                    <select
                      value={char.role}
                      onChange={(e) => updateChar(char.id, { role: e.target.value })}
                      className={selectCls}
                    >
                      <option value="">Selecione a função...</option>
                      {CHARACTER_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </FieldGroup>
                  <FieldGroup label="Relação com o/a protagonista ou com a história">
                    <textarea
                      value={char.relationships}
                      onChange={(e) => updateChar(char.id, { relationships: e.target.value })}
                      rows={2}
                      placeholder="Ex: É o ex-namorado da protagonista, com quem ela precisa trabalhar na mesma empresa..."
                      className={textareaCls}
                    />
                  </FieldGroup>
                </div>
              </div>

              {/* ── APARÊNCIA FÍSICA */}
              <div>
                <SectionHeader label="Aparência física" />
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <FieldGroup label="Cor dos cabelos">
                      <input
                        value={char.hairColor ?? ""}
                        onChange={(e) => updateChar(char.id, { hairColor: e.target.value })}
                        placeholder="Ex: castanho escuro"
                        className={inputCls}
                      />
                    </FieldGroup>
                    <FieldGroup label="Cor da pele">
                      <input
                        value={char.skinColor ?? ""}
                        onChange={(e) => updateChar(char.id, { skinColor: e.target.value })}
                        placeholder="Ex: morena clara"
                        className={inputCls}
                      />
                    </FieldGroup>
                    <FieldGroup label="Cor dos olhos">
                      <input
                        value={char.eyeColor ?? ""}
                        onChange={(e) => updateChar(char.id, { eyeColor: e.target.value })}
                        placeholder="Ex: verde-acinzentado"
                        className={inputCls}
                      />
                    </FieldGroup>
                  </div>
                  <FieldGroup label="Altura">
                    <input
                      value={char.height ?? ""}
                      onChange={(e) => updateChar(char.id, { height: e.target.value })}
                      placeholder="Ex: 1,68m"
                      className={inputCls}
                    />
                  </FieldGroup>
                  <FieldGroup label="Aspecto físico geral">
                    <textarea
                      value={char.appearance}
                      onChange={(e) => updateChar(char.id, { appearance: e.target.value })}
                      rows={2}
                      placeholder="Descreva o visual geral: corpo, estilo, postura, expressão predominante..."
                      className={textareaCls}
                    />
                  </FieldGroup>
                  <FieldGroup label="Características físicas marcantes">
                    <textarea
                      value={char.distinctiveFeatures ?? ""}
                      onChange={(e) => updateChar(char.id, { distinctiveFeatures: e.target.value })}
                      rows={2}
                      placeholder="Ex: cicatriz no queixo, sorriso assimétrico, tatuagem no pulso, sardas..."
                      className={textareaCls}
                    />
                  </FieldGroup>
                </div>
              </div>

              {/* ── PERSONALIDADE */}
              <div>
                <SectionHeader label="Personalidade" />
                <div className="space-y-3">
                  <FieldGroup label="Características psicológicas">
                    <textarea
                      value={char.personality}
                      onChange={(e) => updateChar(char.id, { personality: e.target.value })}
                      rows={3}
                      placeholder="Como essa pessoa age, reage, sente e pensa? Quais são seus valores, medos e forças?"
                      className={textareaCls}
                    />
                  </FieldGroup>
                  <FieldGroup
                    label="Signo"
                    hint="O signo pode ajudar a definir traços de personalidade, temperamento e comportamento do personagem."
                  >
                    <select
                      value={char.sign ?? ""}
                      onChange={(e) => updateChar(char.id, { sign: e.target.value })}
                      className={selectCls}
                    >
                      <option value="">Selecione o signo...</option>
                      {ZODIAC_SIGNS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </FieldGroup>
                </div>
              </div>

              {/* ── FUNÇÃO NARRATIVA */}
              <div>
                <SectionHeader label="Função narrativa" />
                <div className="space-y-3">
                  <FieldGroup
                    label="Papel narrativo"
                    hint="O que esse personagem representa dentro da trama?"
                  >
                    <textarea
                      value={char.narrativeRole ?? ""}
                      onChange={(e) => updateChar(char.id, { narrativeRole: e.target.value })}
                      rows={2}
                      placeholder="Ex: Representa o passado que a protagonista tenta escapar mas não consegue deixar para trás..."
                      className={textareaCls}
                    />
                  </FieldGroup>
                  <FieldGroup
                    label="Objetivo do personagem"
                    hint="O que ele quer alcançar na história?"
                  >
                    <textarea
                      value={char.objective}
                      onChange={(e) => updateChar(char.id, { objective: e.target.value })}
                      rows={2}
                      placeholder="O que esse personagem quer conquistar, provar ou proteger ao longo da história?"
                      className={textareaCls}
                    />
                  </FieldGroup>
                  <FieldGroup
                    label="Conflito interno"
                    hint="Segredo, ferida emocional, medo, culpa, trauma, insegurança ou ponto vulnerável do personagem."
                  >
                    <textarea
                      value={char.internalConflict}
                      onChange={(e) => updateChar(char.id, { internalConflict: e.target.value })}
                      rows={2}
                      placeholder="O que esse personagem carrega por dentro que o impede de ser feliz ou agir livremente?"
                      className={textareaCls}
                    />
                  </FieldGroup>
                  <FieldGroup
                    label="Conflito externo"
                    hint="O obstáculo de fora: outro personagem, sociedade, família, dinheiro, rival, distância, promessa, reputação, perigo ou situação concreta da trama."
                  >
                    <textarea
                      value={char.externalConflict}
                      onChange={(e) => updateChar(char.id, { externalConflict: e.target.value })}
                      rows={2}
                      placeholder="Qual é a barreira ou obstáculo externo que esse personagem precisa enfrentar?"
                      className={textareaCls}
                    />
                  </FieldGroup>
                  <FieldGroup label="Como ele muda ou impacta o/a protagonista">
                    <textarea
                      value={char.arc}
                      onChange={(e) => updateChar(char.id, { arc: e.target.value })}
                      rows={2}
                      placeholder="De que forma a presença desse personagem transforma a protagonista ou muda o rumo da história?"
                      className={textareaCls}
                    />
                  </FieldGroup>
                  <FieldGroup
                    label="Por que esse personagem existe na história"
                    hint="Se esse personagem fosse retirado da história, o que faria falta?"
                  >
                    <textarea
                      value={char.backstory}
                      onChange={(e) => updateChar(char.id, { backstory: e.target.value })}
                      rows={2}
                      placeholder="Qual é a função insubstituível desse personagem? O que ele provoca que nenhum outro pode?"
                      className={textareaCls}
                    />
                  </FieldGroup>
                  <FieldGroup label="Observações livres">
                    <textarea
                      value={char.notes}
                      onChange={(e) => updateChar(char.id, { notes: e.target.value })}
                      rows={3}
                      placeholder="Referências visuais, inspirações, curiosidades, detalhes que você não quer esquecer..."
                      className={textareaCls}
                    />
                  </FieldGroup>
                </div>
              </div>

              {/* Delete */}
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => deleteChar(char.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-400/60 hover:text-red-400 hover:bg-red-900/20 border border-red-900/30 hover:border-red-700/40 rounded-lg transition-all"
                >
                  <Trash2 className="w-3 h-3" /> Excluir personagem
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={addCharacter}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-purple-700/40 text-purple-400 hover:bg-purple-900/10 hover:border-purple-600/60 transition-all text-sm font-medium"
      >
        <Plus className="w-4 h-4" /> Adicionar personagem
      </button>
    </div>
  );
}

// ─── Estrutura tab (3-act structure) ─────────────────────────────────────────

function EstruturaTab({ book, onSaved }: {
  book: Book;
  onSaved: (content: Record<string, Record<string, string>>) => void;
}) {
  const [content, setContent] = useState<Record<string, Record<string, string>>>(
    () => book.actsContent ?? {}
  );
  const [expandedAct, setExpandedAct] = useState<string | null>("ato1");
  const [saved, setSaved] = useState(false);

  const updateSection = (actId: string, section: string, val: string) => {
    setContent((prev) => ({
      ...prev,
      [actId]: { ...(prev[actId] ?? {}), [section]: val },
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    await updateActsContent(book.id, content);
    onSaved(content);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const chaptersForAct = (actId: string) =>
    (book.chaptersList ?? []).filter((c) => c.act === actId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-silver-400">Planejamento geral do livro por atos</p>
        <button
          onClick={handleSave}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            saved ? "bg-green-900/40 border border-green-700/50 text-green-400"
              : "gradient-purple text-white hover:shadow-glow-purple"
          }`}
        >
          {saved ? <><Check className="w-3 h-3" /> Salvo</> : <><Save className="w-3 h-3" /> Salvar</>}
        </button>
      </div>

      {ACTS_STRUCTURE.map((act) => {
        const isExpanded = expandedAct === act.id;
        const actChapters = chaptersForAct(act.id);
        const actData = content[act.id] ?? {};
        const filled = act.sections.filter((s) => actData[s]?.trim()).length;

        return (
          <div key={act.id} className={`border ${act.colorBorder} rounded-xl overflow-hidden`}>
            <div
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer ${act.colorBg} hover:opacity-90 transition-opacity`}
              onClick={() => setExpandedAct(isExpanded ? null : act.id)}
            >
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold ${act.colorText}`}>{act.label}</p>
                <p className="text-xs text-silver-400/60 mt-0.5">
                  {filled}/{act.sections.length} seções preenchidas
                  {actChapters.length > 0 && ` · ${actChapters.length} ${actChapters.length === 1 ? "capítulo" : "capítulos"}`}
                </p>
              </div>
              <ChevronDown className={`w-4 h-4 ${act.colorText} transition-transform shrink-0 ${isExpanded ? "rotate-180" : ""}`} />
            </div>

            {isExpanded && (
              <div className="p-4 space-y-4 bg-ink-900/50 border-t border-purple-900/20">
                <div className="space-y-3">
                  {act.sections.map((section, idx) => (
                    <div key={section}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold shrink-0 ${act.colorText}`}>{idx + 1}.</span>
                        <label className="text-xs text-silver-300 font-medium">{section}</label>
                      </div>
                      <textarea
                        value={actData[section] ?? ""}
                        onChange={(e) => updateSection(act.id, section, e.target.value)}
                        rows={2}
                        placeholder="O que acontece nesta parte da história..."
                        className="w-full px-3 py-2 bg-ink-800 border border-purple-900/40 rounded-lg text-sm text-silver-200 placeholder-silver-400/30 focus:outline-none focus:border-purple-600 transition-colors resize-none leading-relaxed"
                      />
                    </div>
                  ))}
                </div>

                {actChapters.length > 0 && (
                  <div>
                    <p className="text-xs text-silver-400 uppercase tracking-wide font-semibold mb-2">Capítulos deste ato</p>
                    <div className="space-y-1.5">
                      {actChapters.map((ch) => (
                        <div key={ch.id} className={`flex items-start gap-2 px-3 py-2 rounded-lg ${act.colorBg} border ${act.colorBorder}`}>
                          <span className={`text-xs font-bold shrink-0 ${act.colorText}`}>Cap. {ch.number}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-frost font-medium truncate">
                              {ch.title || `Capítulo ${ch.number}`}
                            </p>
                            {ch.summary && (
                              <p className="text-xs text-silver-400/60 truncate">{ch.summary}</p>
                            )}
                          </div>
                          <span className={`text-xs px-1.5 py-0.5 rounded shrink-0 ${STATUS_BG[ch.status]}`}>
                            {STATUS_LABELS[ch.status]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {actChapters.length === 0 && (
                  <p className="text-xs text-silver-400/40 italic border-t border-purple-900/20 pt-3">
                    Nenhum capítulo associado a este ato. Vá para "Capítulos" e selecione o ato correspondente.
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Chapters tab (with full writing area) ────────────────────────────────────

function ChaptersTab({ book, onSaved }: {
  book: Book;
  onSaved: (chapters: Chapter[]) => void;
}) {
  const [chapters, setChapters] = useState<Chapter[]>(() => book.chaptersList ?? []);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const addChapter = () => {
    const newCh: Chapter = {
      id: Date.now().toString(),
      number: chapters.length + 1,
      title: "",
      summary: "",
      dramaticGoal: "",
      finalHook: "",
      content: "",
      status: "rascunho",
      act: undefined,
      structureItems: [],
    };
    setChapters((prev) => [...prev, newCh]);
    setExpandedId(newCh.id);
    setSaved(false);
  };

  const updateChapter = (id: string, patch: Partial<Chapter>) => {
    setChapters((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
    setSaved(false);
  };

  const deleteChapter = (id: string) => {
    setChapters((prev) =>
      prev.filter((c) => c.id !== id).map((c, i) => ({ ...c, number: i + 1 }))
    );
    setSaved(false);
  };

  const handleSave = async () => {
    await updateChapters(book.id, chapters);
    onSaved(chapters);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-silver-400">
          {chapters.length} {chapters.length === 1 ? "capítulo" : "capítulos"}
        </p>
        <button
          onClick={handleSave}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            saved ? "bg-green-900/40 border border-green-700/50 text-green-400"
              : "gradient-purple text-white hover:shadow-glow-purple"
          }`}
        >
          {saved ? <><Check className="w-3 h-3" /> Salvo</> : <><Save className="w-3 h-3" /> Salvar</>}
        </button>
      </div>

      {chapters.length === 0 && (
        <div className="text-center py-10 bg-ink-800 rounded-xl border border-purple-900/30">
          <BookOpen className="w-7 h-7 text-purple-500/40 mx-auto mb-3" />
          <p className="text-silver-400 text-sm">Nenhum capítulo ainda.</p>
          <p className="text-silver-400/50 text-xs mt-1">Clique em "Adicionar capítulo" para começar.</p>
        </div>
      )}

      {chapters.map((chapter) => (
        <div key={chapter.id} className="bg-ink-800 border border-purple-900/30 rounded-xl overflow-hidden">
          {/* Chapter header */}
          <div
            className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-ink-700 transition-colors"
            onClick={() => setExpandedId(expandedId === chapter.id ? null : chapter.id)}
          >
            <div className="w-7 h-7 rounded-lg bg-purple-900/40 border border-purple-700/40 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-purple-300">{chapter.number}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-frost font-medium truncate">
                {chapter.title || `Capítulo ${chapter.number}`}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <p className={`text-xs ${STATUS_COLORS[chapter.status]}`}>
                  {STATUS_LABELS[chapter.status]}
                </p>
                {chapter.act && (
                  <span className="text-xs text-silver-400/50">· {ACT_LABELS[chapter.act]}</span>
                )}
                {chapter.content && chapter.content.trim().length > 0 && (
                  <span className="text-xs text-green-400/60">· {chapter.content.length} caracteres</span>
                )}
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-silver-400 transition-transform shrink-0 ${expandedId === chapter.id ? "rotate-180" : ""}`} />
          </div>

          {/* Chapter expanded */}
          {expandedId === chapter.id && (
            <div className="px-4 pb-4 pt-2 space-y-4 border-t border-purple-900/30">
              {/* Title */}
              <div>
                <label className="text-xs text-silver-400 mb-1 block">Título do capítulo</label>
                <input
                  value={chapter.title}
                  onChange={(e) => updateChapter(chapter.id, { title: e.target.value })}
                  placeholder={`Capítulo ${chapter.number}`}
                  className="w-full px-3 py-2 bg-ink-900 border border-purple-900/40 rounded-lg text-sm text-frost placeholder-silver-400/30 focus:outline-none focus:border-purple-600 transition-colors"
                />
              </div>

              {/* Act + Status row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-silver-400 mb-1 block">Ato</label>
                  <select
                    value={chapter.act ?? ""}
                    onChange={(e) => updateChapter(chapter.id, { act: e.target.value as ActId || undefined })}
                    className="w-full px-3 py-2 bg-ink-900 border border-purple-900/40 rounded-lg text-sm text-frost focus:outline-none focus:border-purple-600 transition-colors"
                  >
                    <option value="">Não associado</option>
                    <option value="ato1">Ato 1 — Apresentação</option>
                    <option value="ato2">Ato 2 — Desenvolvimento</option>
                    <option value="ato3">Ato 3 — Clímax e resolução</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-silver-400 mb-1 block">Status</label>
                  <select
                    value={chapter.status}
                    onChange={(e) => updateChapter(chapter.id, { status: e.target.value as ChapterStatus })}
                    className="w-full px-3 py-2 bg-ink-900 border border-purple-900/40 rounded-lg text-sm text-frost focus:outline-none focus:border-purple-600 transition-colors"
                  >
                    <option value="rascunho">Rascunho</option>
                    <option value="em-escrita">Em escrita</option>
                    <option value="revisao">Revisão</option>
                    <option value="concluido">Concluído</option>
                  </select>
                </div>
              </div>

              {/* Summary */}
              <div>
                <label className="text-xs text-silver-400 mb-1 block">Resumo / Planejamento</label>
                <textarea
                  value={chapter.summary}
                  onChange={(e) => updateChapter(chapter.id, { summary: e.target.value })}
                  rows={2}
                  placeholder="O que acontece neste capítulo? Qual é o arco dramático?"
                  className="w-full px-3 py-2 bg-ink-900 border border-purple-900/40 rounded-lg text-sm text-silver-200 placeholder-silver-400/30 focus:outline-none focus:border-purple-600 transition-colors resize-none leading-relaxed"
                />
              </div>

              {/* Full chapter writing area */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-silver-400 font-semibold uppercase tracking-wide">Texto do capítulo</label>
                  {chapter.content && chapter.content.length > 0 && (
                    <span className="text-xs text-silver-400/40">{chapter.content.length} caracteres</span>
                  )}
                </div>
                <textarea
                  value={chapter.content ?? ""}
                  onChange={(e) => updateChapter(chapter.id, { content: e.target.value })}
                  rows={22}
                  placeholder="Escreva o capítulo completo aqui. Este é o seu espaço de escrita — use à vontade..."
                  className="w-full px-4 py-3 bg-ink-950 border border-purple-900/30 rounded-xl text-sm text-silver-100 placeholder-silver-400/25 focus:outline-none focus:border-purple-600 transition-colors resize-none leading-loose font-serif tracking-wide"
                />
              </div>

              {/* Final hook */}
              <div>
                <label className="text-xs text-silver-400 mb-1 block">Gancho final</label>
                <input
                  value={chapter.finalHook}
                  onChange={(e) => updateChapter(chapter.id, { finalHook: e.target.value })}
                  placeholder="Com o que o leitor vai ficar ao terminar este capítulo?"
                  className="w-full px-3 py-2 bg-ink-900 border border-purple-900/40 rounded-lg text-sm text-frost placeholder-silver-400/30 focus:outline-none focus:border-purple-600 transition-colors"
                />
              </div>

              {/* Delete chapter */}
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => deleteChapter(chapter.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-400/60 hover:text-red-400 hover:bg-red-900/20 border border-red-900/30 hover:border-red-700/40 rounded-lg transition-all"
                >
                  <Trash2 className="w-3 h-3" /> Excluir capítulo
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={addChapter}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-purple-700/40 text-purple-400 hover:bg-purple-900/10 hover:border-purple-600/60 transition-all text-sm font-medium"
      >
        <Plus className="w-4 h-4" /> Adicionar capítulo
      </button>
    </div>
  );
}

// ─── Scenes bank tab (Ideias de Cenas) ────────────────────────────────────────

function ScenesBankTab({ book, onSaved }: {
  book: Book;
  onSaved: (sceneIdeas: SceneIdea[]) => void;
}) {
  const [sceneIdeas, setSceneIdeas] = useState<SceneIdea[]>(() => book.sceneIdeasList ?? []);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const addScene = () => {
    const newScene: SceneIdea = {
      id: Date.now().toString(),
      title: "",
      description: "",
      notes: "",
      createdAt: new Date().toISOString(),
    };
    setSceneIdeas((prev) => [...prev, newScene]);
    setExpandedId(newScene.id);
    setSaved(false);
  };

  const updateScene = (id: string, patch: Partial<SceneIdea>) => {
    setSceneIdeas((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
    setSaved(false);
  };

  const deleteScene = (id: string) => {
    setSceneIdeas((prev) => prev.filter((s) => s.id !== id));
    setSaved(false);
  };

  const handleSave = async () => {
    const toSave = sceneIdeas.filter((s) => s.title.trim() || s.description.trim());
    await updateSceneIdeasList(book.id, toSave);
    onSaved(toSave);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-silver-400">
          {sceneIdeas.length} {sceneIdeas.length === 1 ? "ideia de cena" : "ideias de cenas"}
        </p>
        <button
          onClick={handleSave}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            saved ? "bg-green-900/40 border border-green-700/50 text-green-400"
              : "gradient-purple text-white hover:shadow-glow-purple"
          }`}
        >
          {saved ? <><Check className="w-3 h-3" /> Salvo</> : <><Save className="w-3 h-3" /> Salvar</>}
        </button>
      </div>

      <div className="bg-purple-900/10 border border-purple-700/30 rounded-xl p-3">
        <p className="text-xs text-silver-300/70 leading-relaxed">
          <span className="text-purple-400 font-medium">Banco de ideias de cenas.</span>{" "}
          Salve aqui cenas que você imaginou mas ainda não sabe em qual capítulo vão entrar.
          Consulte este espaço sempre que precisar de material para desenvolver seu livro.
        </p>
      </div>

      {sceneIdeas.length === 0 && (
        <div className="text-center py-10 bg-ink-800 rounded-xl border border-purple-900/30">
          <p className="text-silver-400 text-sm">Nenhuma ideia de cena ainda.</p>
          <p className="text-silver-400/50 text-xs mt-1">Clique em "Adicionar nova ideia de cena" para começar.</p>
        </div>
      )}

      {sceneIdeas.map((scene, index) => (
        <div key={scene.id} className="bg-ink-800 border border-purple-900/30 rounded-xl overflow-hidden">
          <div
            className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-ink-700 transition-colors"
            onClick={() => setExpandedId(expandedId === scene.id ? null : scene.id)}
          >
            <div className="w-7 h-7 rounded-lg bg-purple-900/40 border border-purple-700/40 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-purple-300">{index + 1}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-frost font-medium truncate">
                {scene.title || "Ideia sem título"}
              </p>
              {scene.description && (
                <p className="text-xs text-silver-400/50 truncate">{scene.description}</p>
              )}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={(e) => { e.stopPropagation(); deleteScene(scene.id); }}
                className="text-silver-400/30 hover:text-red-400 transition-colors p-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <ChevronDown className={`w-4 h-4 text-silver-400 transition-transform ${expandedId === scene.id ? "rotate-180" : ""}`} />
            </div>
          </div>

          {expandedId === scene.id && (
            <div className="px-4 pb-4 pt-2 space-y-3 border-t border-purple-900/30">
              <div>
                <label className="text-xs text-silver-400 mb-1 block">Título da cena</label>
                <input
                  value={scene.title}
                  onChange={(e) => updateScene(scene.id, { title: e.target.value })}
                  placeholder="Ex: O encontro no café, A confissão no hospital, A fuga de madrugada..."
                  className="w-full px-3 py-2 bg-ink-900 border border-purple-900/40 rounded-lg text-sm text-frost placeholder-silver-400/30 focus:outline-none focus:border-purple-600 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-silver-400 mb-1 block">Descrição da cena</label>
                <textarea
                  value={scene.description}
                  onChange={(e) => updateScene(scene.id, { description: e.target.value })}
                  rows={5}
                  placeholder="O que acontece nessa cena? Quem está envolvido, onde é, qual é a tensão ou emoção principal?"
                  className="w-full px-3 py-2 bg-ink-900 border border-purple-900/40 rounded-lg text-sm text-silver-200 placeholder-silver-400/30 focus:outline-none focus:border-purple-600 transition-colors resize-none leading-relaxed"
                />
              </div>
              <div>
                <label className="text-xs text-silver-400 mb-1 block">Observações</label>
                <textarea
                  value={scene.notes}
                  onChange={(e) => updateScene(scene.id, { notes: e.target.value })}
                  rows={2}
                  placeholder="Ideias de diálogo, onde essa cena pode encaixar, referências, notas rápidas..."
                  className="w-full px-3 py-2 bg-ink-900 border border-purple-900/40 rounded-lg text-sm text-silver-200 placeholder-silver-400/30 focus:outline-none focus:border-purple-600 transition-colors resize-none leading-relaxed"
                />
              </div>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={addScene}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-purple-700/40 text-purple-400 hover:bg-purple-900/10 hover:border-purple-600/60 transition-all text-sm font-medium"
      >
        <Plus className="w-4 h-4" /> Adicionar nova ideia de cena
      </button>
    </div>
  );
}

// ─── Anotações tab (structured notes) ────────────────────────────────────────

function AnotacoesTab({ book, onSaved }: {
  book: Book;
  onSaved: (notes: Note[]) => void;
}) {
  const [notes, setNotes] = useState<Note[]>(() => {
    if (book.notesList && book.notesList.length > 0) return book.notesList;
    if (book.notes?.trim()) {
      return [{
        id: "legacy-0",
        title: "Anotações gerais",
        text: book.notes,
        createdAt: book.createdAt,
        updatedAt: book.updatedAt,
      }];
    }
    return [];
  });
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const addNote = () => {
    const now = new Date().toISOString();
    const newNote: Note = { id: Date.now().toString(), title: "", text: "", createdAt: now, updatedAt: now };
    setNotes((prev) => [...prev, newNote]);
    setExpandedId(newNote.id);
    setSaved(false);
  };

  const updateNote = (id: string, patch: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((n) => n.id === id ? { ...n, ...patch, updatedAt: new Date().toISOString() } : n)
    );
    setSaved(false);
  };

  const handleSave = async () => {
    const toSave = notes.filter((n) => n.title.trim() || n.text.trim());
    await updateNotesList(book.id, toSave);
    onSaved(toSave);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-silver-400">{notes.length} {notes.length === 1 ? "anotação" : "anotações"}</p>
        <button
          onClick={handleSave}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            saved ? "bg-green-900/40 border border-green-700/50 text-green-400"
              : "gradient-purple text-white hover:shadow-glow-purple"
          }`}
        >
          {saved ? <><Check className="w-3 h-3" /> Salvo</> : <><Save className="w-3 h-3" /> Salvar</>}
        </button>
      </div>

      {notes.length === 0 && (
        <div className="text-center py-10 bg-ink-800 rounded-xl border border-purple-900/30">
          <p className="text-silver-400 text-sm">Nenhuma anotação ainda. Adicione a primeira!</p>
        </div>
      )}

      {notes.map((note) => (
        <div key={note.id} className="bg-ink-800 border border-purple-900/30 rounded-xl overflow-hidden">
          <div
            className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-ink-700 transition-colors"
            onClick={() => setExpandedId(expandedId === note.id ? null : note.id)}
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm text-frost font-medium truncate">
                {note.title || "Anotação sem título"}
              </p>
              <p className="text-xs text-silver-400/50">
                {new Date(note.updatedAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={(e) => { e.stopPropagation(); setNotes((prev) => prev.filter((n) => n.id !== note.id)); setSaved(false); }}
                className="text-silver-400/30 hover:text-red-400 transition-colors p-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <ChevronDown className={`w-4 h-4 text-silver-400 transition-transform ${expandedId === note.id ? "rotate-180" : ""}`} />
            </div>
          </div>

          {expandedId === note.id && (
            <div className="px-4 pb-4 pt-2 space-y-3 border-t border-purple-900/30">
              <div>
                <label className="text-xs text-silver-400 mb-1 block">Título</label>
                <input
                  value={note.title}
                  onChange={(e) => updateNote(note.id, { title: e.target.value })}
                  placeholder="Título da anotação"
                  className="w-full px-3 py-2 bg-ink-900 border border-purple-900/40 rounded-lg text-sm text-frost placeholder-silver-400/30 focus:outline-none focus:border-purple-600 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-silver-400 mb-1 block">Anotação</label>
                <textarea
                  value={note.text}
                  onChange={(e) => updateNote(note.id, { text: e.target.value })}
                  rows={6}
                  placeholder="Pesquisas, lembretes, referências, reflexões sobre o livro..."
                  className="w-full px-3 py-2 bg-ink-900 border border-purple-900/40 rounded-lg text-sm text-silver-200 placeholder-silver-400/30 focus:outline-none focus:border-purple-600 transition-colors resize-none leading-relaxed"
                />
              </div>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={addNote}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-purple-700/40 text-purple-400 hover:bg-purple-900/10 hover:border-purple-600/60 transition-all text-sm font-medium"
      >
        <Plus className="w-4 h-4" /> Adicionar nova anotação
      </button>
    </div>
  );
}

// ─── Marketing calendar tab ───────────────────────────────────────────────────

const CHANNELS: (MarketingChannel | string)[] = ["Instagram", "TikTok", "Amazon", "E-mail", "Outro"];
const STATUS_MARKETING_LABELS: Record<MarketingStatus, string> = {
  planejado: "Planejado",
  "em-andamento": "Em andamento",
  concluido: "Concluído",
};
const CHANNEL_COLORS: Record<string, string> = {
  Instagram: "bg-pink-900/40 text-pink-400",
  TikTok: "bg-purple-900/40 text-purple-400",
  Amazon: "bg-orange-900/40 text-orange-400",
  "E-mail": "bg-blue-900/40 text-blue-400",
  Outro: "bg-ink-700 text-silver-400",
};
const STATUS_MARKETING_BG: Record<MarketingStatus, string> = {
  planejado: "bg-ink-700 text-silver-400",
  "em-andamento": "bg-blue-900/40 text-blue-400",
  concluido: "bg-green-900/40 text-green-400",
};

function MarketingCalendarTab({ book, onSaved }: {
  book: Book;
  onSaved: (items: MarketingItem[]) => void;
}) {
  const [items, setItems] = useState<MarketingItem[]>(() => book.marketingCalendar ?? []);
  const [showForm, setShowForm] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    title: "",
    description: "",
    channel: "Instagram" as MarketingChannel | string,
    status: "planejado" as MarketingStatus,
    notes: "",
  });

  const patchForm = (p: Partial<typeof form>) => setForm((f) => ({ ...f, ...p }));

  const addItem = () => {
    if (!form.title.trim() || !form.date) return;
    setItems((prev) => [...prev, { id: Date.now().toString(), ...form }].sort((a, b) => a.date.localeCompare(b.date)));
    patchForm({ title: "", description: "" });
    setShowForm(false);
    setSaved(false);
  };

  const toggleStatus = (id: string) => {
    const next: Record<MarketingStatus, MarketingStatus> = {
      planejado: "em-andamento", "em-andamento": "concluido", concluido: "planejado",
    };
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, status: next[i.status] } : i));
    setSaved(false);
  };

  const handleSave = async () => {
    await updateMarketingCalendar(book.id, items);
    onSaved(items);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const grouped = items.reduce<Record<string, MarketingItem[]>>((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {});

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-purple-400" />
          <p className="text-xs text-silver-400">{items.length} {items.length === 1 ? "tarefa" : "tarefas"}</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            saved ? "bg-green-900/40 border border-green-700/50 text-green-400"
              : "gradient-purple text-white hover:shadow-glow-purple"
          }`}
        >
          {saved ? <><Check className="w-3 h-3" /> Salvo</> : <><Save className="w-3 h-3" /> Salvar</>}
        </button>
      </div>

      {showForm && (
        <div className="bg-ink-800 border border-purple-700/50 rounded-xl p-4 space-y-3">
          <h3 className="text-sm font-semibold text-frost">Nova tarefa</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-silver-400 mb-1 block">Data</label>
              <input type="date" value={form.date} onChange={(e) => patchForm({ date: e.target.value })}
                className="w-full px-3 py-2 bg-ink-900 border border-purple-900/40 rounded-lg text-sm text-frost focus:outline-none focus:border-purple-600 transition-colors" />
            </div>
            <div>
              <label className="text-xs text-silver-400 mb-1 block">Canal</label>
              <select value={form.channel} onChange={(e) => patchForm({ channel: e.target.value })}
                className="w-full px-3 py-2 bg-ink-900 border border-purple-900/40 rounded-lg text-sm text-frost focus:outline-none focus:border-purple-600 transition-colors">
                {CHANNELS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-silver-400 mb-1 block">Título da tarefa</label>
            <input value={form.title} onChange={(e) => patchForm({ title: e.target.value })}
              placeholder="Ex: Postar reels, Criar legenda, Subir anúncio..."
              className="w-full px-3 py-2 bg-ink-900 border border-purple-900/40 rounded-lg text-sm text-frost placeholder-silver-400/30 focus:outline-none focus:border-purple-600 transition-colors"
              onKeyDown={(e) => e.key === "Enter" && addItem()} />
          </div>
          <textarea value={form.description} onChange={(e) => patchForm({ description: e.target.value })}
            rows={2} placeholder="Descrição (opcional)"
            className="w-full px-3 py-2 bg-ink-900 border border-purple-900/40 rounded-lg text-sm text-silver-200 placeholder-silver-400/30 focus:outline-none focus:border-purple-600 transition-colors resize-none" />
          <div className="flex gap-2">
            <button onClick={addItem} disabled={!form.title.trim()}
              className="flex items-center gap-1.5 px-4 py-2 gradient-purple text-white text-xs font-medium rounded-lg hover:shadow-glow-purple transition-all disabled:opacity-40">
              <Plus className="w-3 h-3" /> Adicionar
            </button>
            <button onClick={() => setShowForm(false)}
              className="px-3 py-2 text-xs text-silver-400 hover:text-frost border border-purple-900/40 rounded-lg transition-colors">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {Object.keys(grouped).length === 0 && !showForm && (
        <div className="text-center py-10 bg-ink-800 rounded-xl border border-purple-900/30">
          <Calendar className="w-7 h-7 text-purple-500/40 mx-auto mb-3" />
          <p className="text-silver-400 text-sm">Nenhuma tarefa ainda. Planeje sua divulgação!</p>
        </div>
      )}

      {Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([date, dayItems]) => {
        const isToday = date === today;
        const isPast = date < today;
        return (
          <div key={date}>
            <p className={`text-xs font-semibold mb-2 px-1 ${isToday ? "text-purple-400" : isPast ? "text-silver-400/50" : "text-silver-300"}`}>
              {isToday && "Hoje — "}
              {new Date(date + "T12:00:00").toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" })}
            </p>
            <div className="space-y-2">
              {dayItems.map((item) => (
                <div key={item.id} className={`bg-ink-800 border rounded-xl px-4 py-3 flex items-start gap-3 group ${isToday ? "border-purple-700/50" : "border-purple-900/30"}`}>
                  <button onClick={() => toggleStatus(item.id)}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${item.status === "concluido" ? "bg-green-600 border-green-600" : "border-purple-700/50 hover:border-purple-500"}`}>
                    {item.status === "concluido" && <Check className="w-2.5 h-2.5 text-white" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${item.status === "concluido" ? "line-through text-silver-400/40" : "text-frost"}`}>{item.title}</p>
                    {item.description && <p className="text-xs text-silver-400 mt-0.5">{item.description}</p>}
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${CHANNEL_COLORS[item.channel] ?? CHANNEL_COLORS["Outro"]}`}>{item.channel}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full cursor-pointer ${STATUS_MARKETING_BG[item.status]}`} onClick={() => toggleStatus(item.id)}>{STATUS_MARKETING_LABELS[item.status]}</span>
                    </div>
                  </div>
                  <button onClick={() => { setItems((prev) => prev.filter((i) => i.id !== item.id)); setSaved(false); }}
                    className="text-silver-400/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 p-1 shrink-0">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {!showForm && (
        <button onClick={() => setShowForm(true)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-purple-700/40 text-purple-400 hover:bg-purple-900/10 hover:border-purple-600/60 transition-all text-sm font-medium">
          <Plus className="w-4 h-4" /> Adicionar tarefa
        </button>
      )}
    </div>
  );
}

// ─── Publishing tab ───────────────────────────────────────────────────────────

const DEFAULT_PUBLISHING: PublishingInfo = {
  keywords: [], categories: [], price: "", kindleUnlimited: false,
  publishDate: "", coverNotes: "", layoutNotes: "", importantLinks: [], checklist: [], notes: "",
};

function PublishingTab({ book, onSaved }: {
  book: Book;
  onSaved: (info: PublishingInfo) => void;
}) {
  const [info, setInfo] = useState<PublishingInfo>(() => book.publishingInfo ?? DEFAULT_PUBLISHING);
  const [saved, setSaved] = useState(false);
  const [newKeyword, setNewKeyword] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newLink, setNewLink] = useState("");

  const patch = (p: Partial<PublishingInfo>) => { setInfo((i) => ({ ...i, ...p })); setSaved(false); };

  const addKeyword = () => { if (!newKeyword.trim()) return; patch({ keywords: [...info.keywords, newKeyword.trim()] }); setNewKeyword(""); };
  const addCategory = () => { if (!newCategory.trim()) return; patch({ categories: [...info.categories, newCategory.trim()] }); setNewCategory(""); };
  const addLink = () => { if (!newLink.trim()) return; patch({ importantLinks: [...info.importantLinks, newLink.trim()] }); setNewLink(""); };

  const handleSave = async () => {
    await updatePublishingInfo(book.id, info);
    onSaved(info);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={handleSave}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            saved ? "bg-green-900/40 border border-green-700/50 text-green-400" : "gradient-purple text-white hover:shadow-glow-purple"
          }`}>
          {saved ? <><Check className="w-3.5 h-3.5" /> Salvo</> : <><Save className="w-3.5 h-3.5" /> Salvar</>}
        </button>
      </div>

      {/* Categories */}
      <div className="bg-ink-800 border border-purple-900/30 rounded-xl p-4 space-y-3">
        <div><label className="block text-xs text-silver-400 uppercase tracking-wide font-semibold mb-0.5">Categorias da Amazon</label>
          <p className="text-xs text-silver-400/50">Até 2 categorias para posicionar o livro no KDP.</p></div>
        <div className="flex flex-wrap gap-2">
          {info.categories.map((cat, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 text-xs bg-purple-900/40 border border-purple-700/40 text-purple-300 px-3 py-1 rounded-full">
              {cat}<button onClick={() => patch({ categories: info.categories.filter((_, j) => j !== i) })} className="text-purple-400/60 hover:text-red-400 transition-colors"><X className="w-3 h-3" /></button>
            </span>
          ))}
          {info.categories.length === 0 && <span className="text-xs text-silver-400/30 italic">Nenhuma categoria.</span>}
        </div>
        <div className="flex gap-2">
          <input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addCategory()}
            placeholder="Ex: Romance > Contemporâneo"
            className="flex-1 px-3 py-2 bg-ink-900 border border-purple-900/40 rounded-lg text-sm text-frost placeholder-silver-400/30 focus:outline-none focus:border-purple-600 transition-colors" />
          <button onClick={addCategory} disabled={!newCategory.trim()}
            className="px-3 py-2 gradient-purple text-white text-xs rounded-lg hover:shadow-glow-purple transition-all disabled:opacity-40 flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> Adicionar
          </button>
        </div>
      </div>

      {/* Keywords */}
      <div className="bg-ink-800 border border-purple-900/30 rounded-xl p-4 space-y-3">
        <div><label className="block text-xs text-silver-400 uppercase tracking-wide font-semibold mb-0.5">Palavras-chave (KDP)</label>
          <p className="text-xs text-silver-400/50">Até 7 termos que seu leitor pesquisaria na Amazon.</p></div>
        <div className="flex flex-wrap gap-2">
          {info.keywords.map((kw, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 text-xs bg-ink-700 border border-purple-900/40 text-silver-300 px-3 py-1 rounded-full">
              {kw}<button onClick={() => patch({ keywords: info.keywords.filter((_, j) => j !== i) })} className="text-silver-400/60 hover:text-red-400 transition-colors"><X className="w-3 h-3" /></button>
            </span>
          ))}
          {info.keywords.length === 0 && <span className="text-xs text-silver-400/30 italic">Nenhuma palavra-chave.</span>}
        </div>
        <div className="flex gap-2">
          <input value={newKeyword} onChange={(e) => setNewKeyword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addKeyword()}
            placeholder="Ex: romance histórico, saga medieval..."
            className="flex-1 px-3 py-2 bg-ink-900 border border-purple-900/40 rounded-lg text-sm text-frost placeholder-silver-400/30 focus:outline-none focus:border-purple-600 transition-colors" />
          <button onClick={addKeyword} disabled={!newKeyword.trim()}
            className="px-3 py-2 gradient-purple text-white text-xs rounded-lg hover:shadow-glow-purple transition-all disabled:opacity-40 flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> Adicionar
          </button>
        </div>
        <p className={`text-xs ${info.keywords.length > 7 ? "text-red-400" : "text-silver-400/40"}`}>{info.keywords.length} / 7</p>
      </div>

      {/* Positioning */}
      <div className="bg-ink-800 border border-purple-900/30 rounded-xl p-4 space-y-3">
        <div><label className="block text-xs text-silver-400 uppercase tracking-wide font-semibold mb-0.5">Posicionamento e termos estratégicos</label>
          <p className="text-xs text-silver-400/50">Público-alvo, comparáveis, termos de busca estratégicos.</p></div>
        <textarea value={info.notes} onChange={(e) => patch({ notes: e.target.value })} rows={4}
          placeholder="Ex: Para fãs de Colleen Hoover. Público: mulheres 25-45. Comparáveis: It Ends with Us..."
          className="w-full px-3 py-2 bg-ink-900 border border-purple-900/40 rounded-lg text-sm text-silver-200 placeholder-silver-400/30 focus:outline-none focus:border-purple-600 transition-colors resize-none leading-relaxed" />
      </div>

      {/* Price + KU + Date */}
      <div className="bg-ink-800 border border-purple-900/30 rounded-xl p-4 space-y-3">
        <label className="block text-xs text-silver-400 uppercase tracking-wide font-semibold">Publicação</label>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-xs text-silver-400 mb-1 block">Preço (R$)</label>
            <input value={info.price} onChange={(e) => patch({ price: e.target.value })} placeholder="Ex: 14,90"
              className="w-full px-3 py-2 bg-ink-900 border border-purple-900/40 rounded-lg text-sm text-frost placeholder-silver-400/30 focus:outline-none focus:border-purple-600 transition-colors" /></div>
          <div><label className="text-xs text-silver-400 mb-1 block">Data de publicação</label>
            <input type="date" value={info.publishDate} onChange={(e) => patch({ publishDate: e.target.value })}
              className="w-full px-3 py-2 bg-ink-900 border border-purple-900/40 rounded-lg text-sm text-frost focus:outline-none focus:border-purple-600 transition-colors" /></div>
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <div onClick={() => patch({ kindleUnlimited: !info.kindleUnlimited })}
            className={`w-9 h-5 rounded-full transition-all relative cursor-pointer ${info.kindleUnlimited ? "bg-purple-600" : "bg-ink-700 border border-purple-900/50"}`}>
            <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-all ${info.kindleUnlimited ? "left-5" : "left-0.5"}`} />
          </div>
          <span className="text-sm text-silver-200">Kindle Unlimited (KU)</span>
        </label>
      </div>

      {/* Cover + Layout */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-ink-800 border border-purple-900/30 rounded-xl p-4">
          <label className="block text-xs text-silver-400 uppercase tracking-wide font-semibold mb-2">Notas — capa</label>
          <textarea value={info.coverNotes} onChange={(e) => patch({ coverNotes: e.target.value })} rows={4}
            placeholder="Referências, cores, estilo visual..."
            className="w-full px-3 py-2 bg-ink-900 border border-purple-900/40 rounded-lg text-sm text-silver-200 placeholder-silver-400/30 focus:outline-none focus:border-purple-600 transition-colors resize-none leading-relaxed" />
        </div>
        <div className="bg-ink-800 border border-purple-900/30 rounded-xl p-4">
          <label className="block text-xs text-silver-400 uppercase tracking-wide font-semibold mb-2">Notas — layout</label>
          <textarea value={info.layoutNotes} onChange={(e) => patch({ layoutNotes: e.target.value })} rows={4}
            placeholder="Fontes, margens, formatação..."
            className="w-full px-3 py-2 bg-ink-900 border border-purple-900/40 rounded-lg text-sm text-silver-200 placeholder-silver-400/30 focus:outline-none focus:border-purple-600 transition-colors resize-none leading-relaxed" />
        </div>
      </div>

      {/* Links */}
      <div className="bg-ink-800 border border-purple-900/30 rounded-xl p-4 space-y-3">
        <label className="block text-xs text-silver-400 uppercase tracking-wide font-semibold">Links importantes</label>
        <div className="space-y-1.5">
          {info.importantLinks.map((link, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="flex-1 text-xs text-blue-400/80 truncate">{link}</span>
              <button onClick={() => patch({ importantLinks: info.importantLinks.filter((_, j) => j !== i) })} className="text-silver-400/40 hover:text-red-400 transition-colors p-1 shrink-0"><X className="w-3 h-3" /></button>
            </div>
          ))}
          {info.importantLinks.length === 0 && <span className="text-xs text-silver-400/30 italic">Nenhum link.</span>}
        </div>
        <div className="flex gap-2">
          <input value={newLink} onChange={(e) => setNewLink(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addLink()} placeholder="https://kdp.amazon.com/..."
            className="flex-1 px-3 py-2 bg-ink-900 border border-purple-900/40 rounded-lg text-sm text-frost placeholder-silver-400/30 focus:outline-none focus:border-purple-600 transition-colors" />
          <button onClick={addLink} disabled={!newLink.trim()} className="px-3 py-2 gradient-purple text-white text-xs rounded-lg hover:shadow-glow-purple transition-all disabled:opacity-40 flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Adicionar</button>
        </div>
      </div>
    </div>
  );
}

// ─── Checklist tab ────────────────────────────────────────────────────────────

const DEFAULT_CHECKLIST: Omit<ChecklistItem, "id">[] = [
  { label: "Revisar o manuscrito completo", done: false },
  { label: "Criar capa profissional", done: false },
  { label: "Escrever sinopse para a Amazon", done: false },
  { label: "Definir categorias e palavras-chave", done: false },
  { label: "Formatar o arquivo para KDP", done: false },
  { label: "Publicar na Amazon KDP", done: false },
  { label: "Divulgar nas redes sociais", done: false },
];

function ChecklistTab({ book, onSaved }: {
  book: Book;
  onSaved: (items: ChecklistItem[]) => void;
}) {
  const [items, setItems] = useState<ChecklistItem[]>(() => {
    if (book.checklist && book.checklist.length > 0) return book.checklist;
    return DEFAULT_CHECKLIST.map((i, idx) => ({ ...i, id: String(idx + 1) }));
  });
  const [newLabel, setNewLabel] = useState("");
  const [saved, setSaved] = useState(false);

  const toggle = (id: string) => setItems((prev) => prev.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));
  const addItem = () => {
    if (!newLabel.trim()) return;
    setItems((prev) => [...prev, { id: Date.now().toString(), label: newLabel.trim(), done: false }]);
    setNewLabel("");
  };

  const handleSave = async () => {
    await updateBookChecklist(book.id, items);
    onSaved(items);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const done = items.filter((i) => i.done).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-silver-400">{done} de {items.length} {items.length === 1 ? "item concluído" : "itens concluídos"}</p>
        <button onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
            saved ? "bg-green-900/40 border border-green-700/50 text-green-400" : "gradient-purple text-white hover:shadow-glow-purple"
          }`}>
          {saved ? <><Check className="w-3 h-3" /> Salvo</> : <><Save className="w-3 h-3" /> Salvar</>}
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 bg-ink-800 border border-purple-900/30 rounded-xl px-4 py-3 group">
            <button onClick={() => toggle(item.id)}
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${item.done ? "bg-purple-600 border-purple-600" : "border-purple-700/50 hover:border-purple-500"}`}>
              {item.done && <Check className="w-3 h-3 text-white" />}
            </button>
            <span className={`flex-1 text-sm transition-colors ${item.done ? "line-through text-silver-400/40" : "text-silver-200"}`}>{item.label}</span>
            <button onClick={() => setItems((prev) => prev.filter((i) => i.id !== item.id))}
              className="text-silver-400/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addItem()}
          placeholder="Adicionar item..."
          className="flex-1 px-3 py-2 bg-ink-800 border border-purple-900/40 rounded-lg text-sm text-frost placeholder-silver-400/30 focus:outline-none focus:border-purple-600 transition-colors" />
        <button onClick={addItem} disabled={!newLabel.trim()}
          className="px-3 py-2 gradient-purple text-white rounded-lg text-xs font-medium hover:shadow-glow-purple transition-all disabled:opacity-40 flex items-center gap-1.5">
          <Plus className="w-3.5 h-3.5" /> Adicionar
        </button>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function BookPage() {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("Visão geral");
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [editingGenre, setEditingGenre] = useState(false);
  const [genreInput, setGenreInput] = useState("");

  useEffect(() => {
    getBooks().then((all) => {
      const found = all.find((b) => b.id === id) ?? null;
      setBook(found);
      setTitleInput(found?.title ?? "");
      setGenreInput(found?.genre ?? "");
    });
  }, [id]);

  const handlePremissaSaved = useCallback((value: string) => {
    setBook((prev) => prev ? { ...prev, premise: value, updatedAt: new Date().toISOString() } : prev);
  }, []);

  const handleSynopsisSaved = useCallback((short: string, long: string) => {
    setBook((prev) => prev ? { ...prev, shortSynopsis: short, longSynopsis: long, updatedAt: new Date().toISOString() } : prev);
  }, []);

  const handleCharactersSaved = useCallback((characters: Character[]) => {
    setBook((prev) => prev ? { ...prev, charactersList: characters, updatedAt: new Date().toISOString() } : prev);
  }, []);

  const handleEstruturaSaved = useCallback((content: Record<string, Record<string, string>>) => {
    setBook((prev) => prev ? { ...prev, actsContent: content, updatedAt: new Date().toISOString() } : prev);
  }, []);

  const handleChaptersSaved = useCallback((chapters: Chapter[]) => {
    setBook((prev) => prev ? { ...prev, chaptersList: chapters, updatedAt: new Date().toISOString() } : prev);
  }, []);

  const handleSceneIdeasSaved = useCallback((sceneIdeas: SceneIdea[]) => {
    setBook((prev) => prev ? { ...prev, sceneIdeasList: sceneIdeas, updatedAt: new Date().toISOString() } : prev);
  }, []);

  const handleNotesSaved = useCallback((notes: Note[]) => {
    setBook((prev) => prev ? { ...prev, notesList: notes, updatedAt: new Date().toISOString() } : prev);
  }, []);

  const handleMarketingSaved = useCallback((items: MarketingItem[]) => {
    setBook((prev) => prev ? { ...prev, marketingCalendar: items, updatedAt: new Date().toISOString() } : prev);
  }, []);

  const handlePublishingSaved = useCallback((info: PublishingInfo) => {
    setBook((prev) => prev ? { ...prev, publishingInfo: info, updatedAt: new Date().toISOString() } : prev);
  }, []);

  const handleChecklistSaved = useCallback((items: ChecklistItem[]) => {
    setBook((prev) => prev ? { ...prev, checklist: items, updatedAt: new Date().toISOString() } : prev);
  }, []);

  if (!book) {
    return (
      <div className="flex items-center justify-center h-screen text-silver-400">
        Livro não encontrado.{" "}
        <Link href="/meus-livros" className="text-purple-400 ml-2 underline">Voltar</Link>
      </div>
    );
  }

  const saveTitle = async () => {
    if (titleInput.trim() && titleInput.trim() !== book.title) {
      await updateBookTitle(book.id, titleInput.trim());
      setBook((b) => b ? { ...b, title: titleInput.trim() } : b);
    }
    setEditingTitle(false);
  };

  const saveGenre = async () => {
    if (genreInput.trim() && genreInput.trim() !== book.genre) {
      await updateBookGenre(book.id, genreInput.trim());
      setBook((b) => b ? { ...b, genre: genreInput.trim() } : b);
    }
    setEditingGenre(false);
  };

  const tabTitle = activeTab === "Cenas" ? "Ideias de Cenas" : activeTab;

  return (
    <div className="min-h-screen bg-ink-950">
      {/* Top bar */}
      <div className="px-6 py-4 border-b border-purple-900/40 bg-ink-900 flex items-center gap-4">
        <Link href="/meus-livros" className="text-silver-400 hover:text-frost transition-colors shrink-0">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1 min-w-0">
          {editingTitle ? (
            <div className="flex items-center gap-2">
              <input value={titleInput} onChange={(e) => setTitleInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") saveTitle(); if (e.key === "Escape") setEditingTitle(false); }}
                className="bg-ink-800 border border-purple-700/50 rounded-lg px-3 py-1 text-base font-bold text-frost focus:outline-none focus:border-purple-500 w-full max-w-sm" autoFocus />
              <button onClick={saveTitle} className="text-xs text-purple-400 hover:text-purple-300 px-3 py-1 border border-purple-700/50 rounded-lg transition-colors">Salvar</button>
              <button onClick={() => setEditingTitle(false)} className="text-xs text-silver-400 hover:text-frost transition-colors">Cancelar</button>
            </div>
          ) : (
            <div className="flex items-center gap-2 group">
              <h1 className="text-base font-bold text-frost font-serif truncate">{book.title}</h1>
              <button onClick={() => setEditingTitle(true)} className="text-silver-400/40 hover:text-purple-400 transition-colors opacity-0 group-hover:opacity-100">
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          )}

          {editingGenre ? (
            <div className="flex items-center gap-2 mt-0.5">
              <input value={genreInput} onChange={(e) => setGenreInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") saveGenre(); if (e.key === "Escape") setEditingGenre(false); }}
                placeholder="Ex: Romance, Fantasia, Suspense..."
                className="bg-ink-800 border border-purple-700/50 rounded-lg px-2 py-0.5 text-xs text-frost focus:outline-none focus:border-purple-500 w-48" autoFocus />
              <button onClick={saveGenre} className="text-xs text-purple-400 hover:text-purple-300 px-2 py-0.5 border border-purple-700/50 rounded-lg transition-colors">Salvar</button>
              <button onClick={() => setEditingGenre(false)} className="text-xs text-silver-400 hover:text-frost transition-colors">Cancelar</button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 group/genre mt-0.5">
              <p className="text-xs text-silver-400">{book.genre || "Gênero não definido"}</p>
              <button onClick={() => { setGenreInput(book.genre ?? ""); setEditingGenre(true); }}
                className="text-silver-400/40 hover:text-purple-400 transition-colors opacity-0 group-hover/genre:opacity-100">
                <Edit3 className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
        <div className="w-8 h-8 rounded-lg gradient-purple flex items-center justify-center shrink-0">
          <BookOpen className="w-4 h-4 text-white" />
        </div>
      </div>

      <div className="flex">
        {/* Tabs sidebar */}
        <nav className="w-44 shrink-0 border-r border-purple-900/40 min-h-screen bg-ink-900 p-3">
          <ul className="space-y-0.5">
            {TABS.map((tab) => {
              const hasData = getHasData(book, tab);
              const displayLabel = tab === "Cenas" ? "Ideias de Cenas" : tab;
              return (
                <li key={tab}>
                  <button
                    onClick={() => setActiveTab(tab)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center gap-2 ${
                      activeTab === tab
                        ? "bg-purple-700/30 text-frost border border-purple-700/50"
                        : "text-silver-400 hover:text-frost hover:bg-ink-700"
                    }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${hasData ? "bg-purple-400" : "bg-ink-600"}`} />
                    {displayLabel}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Content */}
        <div className="flex-1 p-6 max-w-3xl">
          <h2 className="text-lg font-bold text-frost mb-5 font-serif">{tabTitle}</h2>

          {activeTab === "Visão geral"  && <OverviewTab book={book} />}
          {activeTab === "Premissa"     && <PremissaTab book={book} onSaved={handlePremissaSaved} />}
          {activeTab === "Sinopse"      && <SynopsisTab book={book} onSaved={handleSynopsisSaved} />}
          {activeTab === "Personagens"  && <PersonagensTab book={book} onSaved={handleCharactersSaved} />}
          {activeTab === "Estrutura"    && <EstruturaTab book={book} onSaved={handleEstruturaSaved} />}
          {activeTab === "Capítulos"    && <ChaptersTab book={book} onSaved={handleChaptersSaved} />}
          {activeTab === "Cenas"        && <ScenesBankTab book={book} onSaved={handleSceneIdeasSaved} />}
          {activeTab === "Anotações"    && <AnotacoesTab book={book} onSaved={handleNotesSaved} />}
          {activeTab === "Divulgação"   && <MarketingCalendarTab book={book} onSaved={handleMarketingSaved} />}
          {activeTab === "Publicação"   && <PublishingTab book={book} onSaved={handlePublishingSaved} />}
          {activeTab === "Checklist"    && <ChecklistTab book={book} onSaved={handleChecklistSaved} />}
        </div>
      </div>
    </div>
  );
}
