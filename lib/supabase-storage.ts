import { createClient } from "@/lib/supabase/client";
import { BOOK_SECTION_LABELS } from "@/lib/storage";

// Re-export all types and pure helpers so pages only need one import
export type {
  Book, BookTextField, ChecklistItem, Character, Chapter, ChapterStatus,
  ActId, Scene, StructureItem, Idea, SceneIdea, Note, MarketingItem,
  MarketingChannel, MarketingStatus, PublishingInfo, UserProfile,
} from "@/lib/storage";
export { getBookProgress, BOOK_SECTION_LABELS } from "@/lib/storage";

import type {
  Book, Character, Chapter, ChecklistItem, MarketingItem,
  Note, PublishingInfo, SceneIdea, BookTextField, UserProfile,
} from "@/lib/storage";

// ─── Row ↔ Book mapping ───────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToBook(row: any): Book {
  return {
    id: row.id,
    title: row.title,
    genre: row.genre ?? "",
    currentPhase: row.current_phase ?? "ideia",
    progress: row.progress ?? 0,
    lastSavedSection: row.last_saved_section ?? "",
    premise: row.premise,
    notes: row.notes,
    shortSynopsis: row.short_synopsis,
    longSynopsis: row.long_synopsis,
    charactersList: row.characters_list ?? [],
    chaptersList: row.chapters_list ?? [],
    marketingCalendar: row.marketing_calendar ?? [],
    publishingInfo: row.publishing_info ?? undefined,
    ideasList: row.ideas_list ?? [],
    sceneIdeasList: row.scene_ideas_list ?? [],
    notesList: row.notes_list ?? [],
    actsContent: row.acts_content ?? {},
    checklist: row.checklist ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function patchBook(bookId: string, dbPatch: Record<string, any>): Promise<void> {
  const supabase = createClient();
  await supabase.from("books").update(dbPatch).eq("id", bookId);
}

// ─── User profile ─────────────────────────────────────────────────────────────

export async function getUserProfile(): Promise<UserProfile | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (!data) return null;
  return {
    name: data.name ?? "",
    email: user.email ?? "",
    genre: data.genre ?? "",
    currentObjective: data.current_objective ?? "",
    divulgationPreference: data.divulgation_preference ?? "nao-aparecer",
  };
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("profiles").upsert({
    id: user.id,
    name: profile.name,
    genre: profile.genre,
    current_objective: profile.currentObjective,
    divulgation_preference: profile.divulgationPreference,
    updated_at: new Date().toISOString(),
  });
}

// ─── Books ────────────────────────────────────────────────────────────────────

export async function getBooks(): Promise<Book[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("books")
    .select("*")
    .order("updated_at", { ascending: false });
  return (data ?? []).map(rowToBook);
}

export async function createBook(title: string, genre: string): Promise<Book> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data } = await supabase
    .from("books")
    .insert({ title, genre, user_id: user!.id })
    .select()
    .single();
  return rowToBook(data);
}

export async function deleteBook(bookId: string): Promise<void> {
  const supabase = createClient();
  await supabase.from("books").delete().eq("id", bookId);
}

// ─── Field updates ────────────────────────────────────────────────────────────

export async function updateBookTitle(bookId: string, title: string): Promise<void> {
  await patchBook(bookId, { title });
}

export async function updateBookGenre(bookId: string, genre: string): Promise<void> {
  await patchBook(bookId, { genre });
}

export async function updateBookTextField(bookId: string, field: BookTextField, value: string): Promise<void> {
  const dbField: Record<BookTextField, string> = {
    premise: "premise",
    notes: "notes",
    scenes: "notes",
    characters: "characters_list",
  };
  await patchBook(bookId, { [dbField[field]]: value, last_saved_section: BOOK_SECTION_LABELS[field] });
}

export async function updateSynopses(bookId: string, shortSynopsis: string, longSynopsis: string): Promise<void> {
  await patchBook(bookId, { short_synopsis: shortSynopsis, long_synopsis: longSynopsis, last_saved_section: "Sinopse" });
}

export async function updateCharacters(bookId: string, charactersList: Character[]): Promise<void> {
  await patchBook(bookId, { characters_list: charactersList, last_saved_section: "Personagens" });
}

export async function updateChapters(bookId: string, chaptersList: Chapter[]): Promise<void> {
  await patchBook(bookId, { chapters_list: chaptersList, last_saved_section: "Capítulos" });
}

export async function updateMarketingCalendar(bookId: string, marketingCalendar: MarketingItem[]): Promise<void> {
  await patchBook(bookId, { marketing_calendar: marketingCalendar, last_saved_section: "Divulgação" });
}

export async function updatePublishingInfo(bookId: string, publishingInfo: PublishingInfo): Promise<void> {
  await patchBook(bookId, { publishing_info: publishingInfo, last_saved_section: "Publicação" });
}

export async function updateNotesList(bookId: string, notesList: Note[]): Promise<void> {
  await patchBook(bookId, { notes_list: notesList, last_saved_section: "Anotações" });
}

export async function updateSceneIdeasList(bookId: string, sceneIdeasList: SceneIdea[]): Promise<void> {
  await patchBook(bookId, { scene_ideas_list: sceneIdeasList, last_saved_section: "Ideias de Cenas" });
}

export async function updateActsContent(bookId: string, actsContent: Record<string, Record<string, string>>): Promise<void> {
  await patchBook(bookId, { acts_content: actsContent, last_saved_section: "Estrutura" });
}

export async function updateBookChecklist(bookId: string, checklist: ChecklistItem[]): Promise<void> {
  await patchBook(bookId, { checklist, last_saved_section: "Checklist" });
}
