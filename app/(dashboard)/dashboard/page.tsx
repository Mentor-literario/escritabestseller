"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, BookOpen, ChevronRight, BookMarked } from "lucide-react";
import { getBooks, getUserProfile, getBookProgress, type Book } from "@/lib/supabase-storage";

function BookCard({ book }: { book: Book }) {
  const progress = getBookProgress(book);
  return (
    <Link
      href={`/meus-livros/${book.id}`}
      className="bg-ink-900 border border-purple-900/40 rounded-xl p-5 hover:border-purple-700/60 hover:shadow-glow-purple transition-all group flex flex-col"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-lg gradient-purple flex items-center justify-center shrink-0">
          <BookOpen className="w-4 h-4 text-white" />
        </div>
        <span className="text-xs text-purple-400 bg-purple-900/30 border border-purple-800/40 px-2 py-0.5 rounded-full">
          {book.genre || "Sem gênero"}
        </span>
      </div>
      <h3 className="font-bold text-frost font-serif mb-1 leading-tight flex-1">{book.title}</h3>
      <div className="mt-3">
        <div className="flex justify-between text-xs text-silver-400/60 mb-1">
          <span>Preenchimento</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full h-1 bg-ink-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-purple-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className="flex items-center justify-between mt-3">
        <span className="text-xs text-silver-400/50">
          {new Date(book.updatedAt).toLocaleDateString("pt-BR")}
        </span>
        <ChevronRight className="w-4 h-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [name, setName] = useState("");

  useEffect(() => {
    const load = async () => {
      const [profile, all] = await Promise.all([getUserProfile(), getBooks()]);
      if (profile?.name) setName(profile.name);
      const sorted = [...all].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      setBooks(sorted.slice(0, 6));
    };
    load();
  }, []);

  const greeting = name ? `Olá, ${name.split(" ")[0]}` : "Bem-vinda";

  return (
    <div className="min-h-screen bg-ink-950">
      <div className="px-6 py-4 border-b border-purple-900/40 bg-ink-900">
        <h1 className="text-base font-semibold text-frost">{greeting}</h1>
        <p className="text-xs text-silver-400">Aqui estão seus projetos literários.</p>
      </div>

      <div className="p-6 max-w-5xl mx-auto space-y-8">

        {/* Quick actions */}
        <div className="flex flex-wrap gap-3">
          <Link
            href="/meus-livros"
            className="flex items-center gap-2 gradient-purple text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:shadow-glow-purple transition-all"
          >
            <Plus className="w-4 h-4" /> Novo Livro
          </Link>
          <Link
            href="/meus-livros"
            className="flex items-center gap-2 bg-ink-800 border border-purple-900/40 text-silver-200 text-sm px-5 py-2.5 rounded-lg hover:border-purple-700/60 transition-all"
          >
            <BookMarked className="w-4 h-4 text-purple-400" /> Ver todos os livros
          </Link>
        </div>

        {/* Recent books */}
        {books.length > 0 ? (
          <div>
            <h2 className="text-sm font-semibold text-frost mb-4">Projetos recentes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
            {books.length >= 6 && (
              <div className="mt-4 text-center">
                <Link href="/meus-livros" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                  Ver todos os projetos →
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full gradient-purple-subtle border border-purple-800/40 flex items-center justify-center mb-5">
              <BookOpen className="w-8 h-8 text-purple-500" />
            </div>
            <h2 className="text-xl font-bold text-frost font-serif mb-2">Nenhum projeto ainda</h2>
            <p className="text-silver-400 text-sm max-w-sm mb-6 leading-relaxed">
              Crie seu primeiro livro e comece a organizar suas ideias, personagens, capítulos e muito mais.
            </p>
            <Link
              href="/meus-livros"
              className="inline-flex items-center gap-2 gradient-purple text-white font-semibold px-6 py-3 rounded-lg text-sm hover:shadow-glow-purple transition-all"
            >
              <Plus className="w-4 h-4" /> Criar primeiro livro
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
