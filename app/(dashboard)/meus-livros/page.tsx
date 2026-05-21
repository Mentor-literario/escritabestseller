"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, Plus, X, ChevronRight } from "lucide-react";
import { getBooks, createBook, getBookProgress, type Book } from "@/lib/supabase-storage";

const GENRES = [
  "Romance", "Suspense / Thriller", "Fantasia", "Romance Contemporâneo",
  "Romance Histórico", "Dark Romance", "Ficção Científica", "Outro",
];

function NewBookModal({ onClose, onCreate }: {
  onClose: () => void;
  onCreate: (title: string, genre: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate(title.trim(), genre);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-ink-900 border border-purple-700/50 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-frost">Novo livro</h3>
          <button onClick={onClose} className="text-silver-400/50 hover:text-silver-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-silver-400 mb-1.5">Título provisório</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: O Segredo da Última Página"
              className="w-full px-3 py-2.5 bg-ink-800 border border-purple-900/50 rounded-lg text-sm text-frost placeholder-silver-400/30 focus:outline-none focus:border-purple-600 transition-colors"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs text-silver-400 mb-1.5">Gênero <span className="text-silver-400/40">(opcional)</span></label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full px-3 py-2.5 bg-ink-800 border border-purple-900/50 rounded-lg text-sm text-frost focus:outline-none focus:border-purple-600 transition-colors cursor-pointer"
            >
              <option value="">Selecione o gênero...</option>
              {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={!title.trim()}
              className="flex-1 gradient-purple text-white text-sm font-semibold py-2.5 rounded-lg hover:shadow-glow-purple transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Criar livro
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm text-silver-400 hover:text-frost border border-purple-900/40 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function BookCard({ book }: { book: Book }) {
  const progress = getBookProgress(book);
  return (
    <div className="bg-ink-900 border border-purple-900/40 rounded-xl p-5 hover:border-purple-700/60 hover:shadow-glow-purple transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg gradient-purple flex items-center justify-center shrink-0">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        {book.genre && (
          <span className="text-xs text-purple-400 bg-purple-900/30 border border-purple-800/40 px-2 py-0.5 rounded-full">
            {book.genre}
          </span>
        )}
      </div>

      <h3 className="font-bold text-frost font-serif mb-1 leading-tight">{book.title}</h3>
      <p className="text-xs text-silver-400/50 mb-4">
        {new Date(book.updatedAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
      </p>

      <div className="mb-4">
        <div className="flex justify-between text-xs text-silver-400/60 mb-1">
          <span>Preenchimento</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full h-1.5 bg-ink-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-purple-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <Link
        href={`/meus-livros/${book.id}`}
        className="w-full flex items-center justify-center gap-2 text-xs py-2 rounded-lg border border-purple-700/50 text-purple-300 hover:bg-purple-700/20 transition-all font-medium"
      >
        Abrir livro <ChevronRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

export default function MeusLivrosPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getBooks().then((all) =>
      setBooks([...all].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()))
    );
  }, []);

  const handleCreate = async (title: string, genre: string) => {
    const book = await createBook(title, genre);
    setShowModal(false);
    router.push(`/meus-livros/${book.id}`);
  };

  return (
    <div className="min-h-screen bg-ink-950">
      {showModal && (
        <NewBookModal onClose={() => setShowModal(false)} onCreate={handleCreate} />
      )}

      <div className="px-6 py-4 border-b border-purple-900/40 bg-ink-900 flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold text-frost">Meus Livros</h1>
          <p className="text-xs text-silver-400">Todos os seus projetos literários</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 gradient-purple text-white text-xs font-medium px-4 py-2 rounded-lg hover:shadow-glow-purple transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> Novo livro
        </button>
      </div>

      <div className="p-6 max-w-5xl mx-auto">
        {books.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full gradient-purple-subtle border border-purple-800/40 flex items-center justify-center mb-5">
              <BookOpen className="w-8 h-8 text-purple-500" />
            </div>
            <h2 className="text-xl font-bold text-frost font-serif mb-2">Nenhum livro ainda</h2>
            <p className="text-silver-400 text-sm max-w-sm mb-6 leading-relaxed">
              Crie seu primeiro projeto e comece a organizar tudo em um só lugar.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 gradient-purple text-white font-semibold px-6 py-3 rounded-lg text-sm hover:shadow-glow-purple transition-all"
            >
              <Plus className="w-4 h-4" /> Criar primeiro livro
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-silver-400 mb-6">
              {books.length} {books.length === 1 ? "projeto" : "projetos"}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
