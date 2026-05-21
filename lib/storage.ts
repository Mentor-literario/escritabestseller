// ─── User ────────────────────────────────────────────────────────────────────

export interface UserProfile {
  name: string;
  email?: string;
  genre: string;
  currentObjective: string;
  divulgationPreference: "aparecer" | "nao-aparecer";
  password?: string;
}

// ─── Shared primitives ────────────────────────────────────────────────────────

export interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

// ─── Characters ───────────────────────────────────────────────────────────────

export interface Character {
  id: string;
  name: string;
  role: string;
  age: string;
  // Physical appearance
  hairColor?: string;
  skinColor?: string;
  eyeColor?: string;
  height?: string;
  appearance: string;
  distinctiveFeatures?: string;
  // Personality
  personality: string;
  sign?: string;
  // Narrative function
  narrativeRole?: string;
  objective: string;
  internalConflict: string;
  externalConflict: string;
  relationships: string;
  impactOnProtagonist?: string;
  reasonToExist?: string;
  backstory: string;
  arc: string;
  notes: string;
}

// ─── Chapters / Structure / Scenes ───────────────────────────────────────────

export interface Scene {
  id: string;
  title: string;
  summary: string;
  characters: string;
  location: string;
  emotionalGoal: string;
  conflict: string;
  mainEvent: string;
  hookOrConsequence: string;
  notes: string;
}

export interface StructureItem {
  id: string;
  type: string;
  label: string;
  scenes: Scene[];
}

export type ChapterStatus = "rascunho" | "em-escrita" | "revisao" | "concluido";

export type ActId = "ato1" | "ato2" | "ato3";

export interface Chapter {
  id: string;
  number: number;
  title: string;
  summary: string;
  dramaticGoal: string;
  finalHook: string;
  content?: string;
  status: ChapterStatus;
  act?: ActId;
  scenesList?: Scene[];
  structureItems: StructureItem[];
}

// ─── Notes ────────────────────────────────────────────────────────────────────

export interface Note {
  id: string;
  title: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Ideas ────────────────────────────────────────────────────────────────────

export interface Idea {
  id: string;
  text: string;
  createdAt: string;
}

// ─── Scene ideas bank ─────────────────────────────────────────────────────────

export interface SceneIdea {
  id: string;
  title: string;
  description: string;
  notes: string;
  createdAt: string;
}

// ─── Marketing calendar ───────────────────────────────────────────────────────

export type MarketingChannel = "Instagram" | "TikTok" | "Amazon" | "E-mail" | "Outro";
export type MarketingStatus = "planejado" | "em-andamento" | "concluido";

export interface MarketingItem {
  id: string;
  date: string;
  title: string;
  description: string;
  channel: MarketingChannel | string;
  status: MarketingStatus;
  notes: string;
}

// ─── Publishing info ──────────────────────────────────────────────────────────

export interface PublishingInfo {
  keywords: string[];
  categories: string[];
  price: string;
  kindleUnlimited: boolean;
  publishDate: string;
  coverNotes: string;
  layoutNotes: string;
  importantLinks: string[];
  checklist: ChecklistItem[];
  notes: string;
}

// ─── Book ─────────────────────────────────────────────────────────────────────

export interface Book {
  id: string;
  title: string;
  genre: string;
  currentPhase: string;
  progress: number;
  lastSavedSection: string;
  // Simple text fields (still in menu)
  premise?: string;
  notes?: string;
  // Synopsis (split into short + long)
  shortSynopsis?: string;
  longSynopsis?: string;
  // Structured data
  charactersList?: Character[];
  chaptersList?: Chapter[];
  marketingCalendar?: MarketingItem[];
  publishingInfo?: PublishingInfo;
  // Ideas list
  ideasList?: Idea[];
  // Scene ideas bank
  sceneIdeasList?: SceneIdea[];
  // Notes list
  notesList?: Note[];
  // Acts structure content: { ato1: { "Situação inicial": "...", ... }, ... }
  actsContent?: Record<string, Record<string, string>>;
  // Legacy fields — preserved for compat, not shown in menu
  synopsis?: string;
  characters?: string;
  chapters?: string;
  scenes?: string;
  looseIdeas?: string;
  promotionMaterials?: string;
  checklist?: ChecklistItem[];
  createdAt: string;
  updatedAt: string;
}

export type BookTextField = "premise" | "notes" | "scenes" | "characters";

export const BOOK_SECTION_LABELS: Record<BookTextField, string> = {
  premise: "Premissa",
  notes: "Anotações",
  scenes: "Cenas",
  characters: "Personagens",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getLocal(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}
function setLocal(key: string, value: string): void {
  try { localStorage.setItem(key, value); } catch { /* noop */ }
}
function parseLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}

function patchBook(bookId: string, patch: Partial<Book>): void {
  const books = getBooks();
  const idx = books.findIndex((b) => b.id === bookId);
  if (idx === -1) return;
  books[idx] = { ...books[idx], ...patch, updatedAt: new Date().toISOString() };
  saveBooks(books);
}

// ─── User profile ─────────────────────────────────────────────────────────────

export const getUserProfile = (): UserProfile | null =>
  parseLocal<UserProfile | null>("userProfile", null);

export const saveUserProfile = (profile: UserProfile): void =>
  setLocal("userProfile", JSON.stringify(profile));

// ─── Books ────────────────────────────────────────────────────────────────────

export const getBooks = (): Book[] => parseLocal<Book[]>("books", []);
export const saveBooks = (books: Book[]): void =>
  setLocal("books", JSON.stringify(books));

export const getCurrentBookId = (): string | null => getLocal("currentBookId");
export const saveCurrentBookId = (id: string): void =>
  setLocal("currentBookId", id);

export const createBook = (title: string, genre: string): Book => {
  const book: Book = {
    id: Date.now().toString(),
    title,
    genre,
    currentPhase: "ideia",
    progress: 0,
    lastSavedSection: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const books = getBooks();
  books.push(book);
  saveBooks(books);
  saveCurrentBookId(book.id);
  return book;
};

export const updateBookTitle = (bookId: string, title: string): void =>
  patchBook(bookId, { title });

export const updateBookGenre = (bookId: string, genre: string): void =>
  patchBook(bookId, { genre });

export const deleteBook = (bookId: string): void =>
  saveBooks(getBooks().filter((b) => b.id !== bookId));

// ─── Generic text field (Premissa, Anotações) ─────────────────────────────────

export const updateBookTextField = (
  bookId: string,
  field: BookTextField,
  value: string
): void => {
  patchBook(bookId, {
    [field]: value,
    lastSavedSection: BOOK_SECTION_LABELS[field],
    progress: calcProgress({ ...getBooks().find((b) => b.id === bookId)!, [field]: value }),
  });
};

// ─── Synopsis ─────────────────────────────────────────────────────────────────

export const updateSynopses = (
  bookId: string,
  shortSynopsis: string,
  longSynopsis: string
): void => {
  const book = getBooks().find((b) => b.id === bookId);
  if (!book) return;
  patchBook(bookId, {
    shortSynopsis,
    longSynopsis,
    lastSavedSection: "Sinopse",
    progress: calcProgress({ ...book, shortSynopsis, longSynopsis }),
  });
};

// ─── Characters ───────────────────────────────────────────────────────────────

export const updateCharacters = (bookId: string, charactersList: Character[]): void => {
  const book = getBooks().find((b) => b.id === bookId);
  if (!book) return;
  patchBook(bookId, {
    charactersList,
    lastSavedSection: "Personagens",
    progress: calcProgress({ ...book, charactersList }),
  });
};

// ─── Chapters ─────────────────────────────────────────────────────────────────

export const updateChapters = (bookId: string, chaptersList: Chapter[]): void => {
  const book = getBooks().find((b) => b.id === bookId);
  if (!book) return;
  patchBook(bookId, {
    chaptersList,
    lastSavedSection: "Capítulos",
    progress: calcProgress({ ...book, chaptersList }),
  });
};

// ─── Marketing calendar ───────────────────────────────────────────────────────

export const updateMarketingCalendar = (bookId: string, marketingCalendar: MarketingItem[]): void => {
  const book = getBooks().find((b) => b.id === bookId);
  if (!book) return;
  patchBook(bookId, {
    marketingCalendar,
    lastSavedSection: "Divulgação",
    progress: calcProgress({ ...book, marketingCalendar }),
  });
};

// ─── Publishing info ──────────────────────────────────────────────────────────

export const updatePublishingInfo = (bookId: string, publishingInfo: PublishingInfo): void => {
  const book = getBooks().find((b) => b.id === bookId);
  if (!book) return;
  patchBook(bookId, {
    publishingInfo,
    lastSavedSection: "Publicação",
    progress: calcProgress({ ...book, publishingInfo }),
  });
};

// ─── Notes list ───────────────────────────────────────────────────────────────

export const updateNotesList = (bookId: string, notesList: Note[]): void => {
  const book = getBooks().find((b) => b.id === bookId);
  if (!book) return;
  patchBook(bookId, {
    notesList,
    lastSavedSection: "Anotações",
    progress: calcProgress({ ...book, notesList }),
  });
};

// ─── Scene ideas list ─────────────────────────────────────────────────────────

export const updateSceneIdeasList = (bookId: string, sceneIdeasList: SceneIdea[]): void => {
  const book = getBooks().find((b) => b.id === bookId);
  if (!book) return;
  patchBook(bookId, {
    sceneIdeasList,
    lastSavedSection: "Ideias de Cenas",
    progress: calcProgress({ ...book, sceneIdeasList }),
  });
};

// ─── Acts structure ───────────────────────────────────────────────────────────

export const updateActsContent = (
  bookId: string,
  actsContent: Record<string, Record<string, string>>
): void => {
  const book = getBooks().find((b) => b.id === bookId);
  if (!book) return;
  patchBook(bookId, {
    actsContent,
    lastSavedSection: "Estrutura",
    progress: calcProgress({ ...book, actsContent }),
  });
};

// ─── Checklist ────────────────────────────────────────────────────────────────

export const updateBookChecklist = (bookId: string, checklist: ChecklistItem[]): void => {
  const book = getBooks().find((b) => b.id === bookId);
  if (!book) return;
  patchBook(bookId, {
    checklist,
    lastSavedSection: "Checklist",
    progress: calcProgress({ ...book, checklist }),
  });
};

// ─── Progress ─────────────────────────────────────────────────────────────────

export function calcProgress(book: Book): number {
  const hasActsContent = book.actsContent
    ? Object.values(book.actsContent).some((act) => Object.values(act).some((v) => v.trim()))
    : false;
  const checks = [
    !!book.premise?.trim(),
    !!(book.shortSynopsis?.trim() || book.longSynopsis?.trim()),
    (book.charactersList?.length ?? 0) > 0 || !!book.characters?.trim(),
    hasActsContent,
    (book.chaptersList?.length ?? 0) > 0,
    (book.notesList?.length ?? 0) > 0 || !!book.notes?.trim(),
    (book.sceneIdeasList?.length ?? 0) > 0 || !!book.scenes?.trim(),
    (book.marketingCalendar?.length ?? 0) > 0,
    !!(book.publishingInfo?.keywords?.length || book.publishingInfo?.publishDate),
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export const getBookProgress = (book: Book): number => calcProgress(book);

// ─── Clear all ────────────────────────────────────────────────────────────────

export const clearAll = (): void => {
  if (typeof window === "undefined") return;
  ["userProfile", "books", "currentBookId"].forEach((k) => localStorage.removeItem(k));
};
