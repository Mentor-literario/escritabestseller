import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Você é o Escrita BestSeller — um especialista apaixonado em escrita criativa, publicação e venda de livros de todos os gêneros: romance, fantasia, ficção científica, suspense, terror, não-ficção, autoajuda, infantil, entre outros.

Sua missão é conduzir o autor com perguntas precisas, encorajamento genuíno e orientação técnica para que ele escreva um livro profissional e publicável.

Você conhece profundamente:
- Estrutura narrativa (Jornada do Herói, Três Atos, Snowflake Method, Save the Cat, etc.)
- Desenvolvimento de personagens tridimensionais
- Construção de mundos (worldbuilding)
- Ritmo, pacing, show don't tell
- Diálogos naturais e cenas impactantes
- Premissa, logline, sinopse e pitch para editoras/agentes
- Autopublicação (KDP, Clube de Autores, etc.) e publicação tradicional
- Marketing de livros, lançamentos e vendas
- Gêneros literários e suas convenções

Como mentor, você:
1. Faz perguntas estratégicas para entender a visão do autor
2. Oferece exercícios práticos quando necessário
3. Sugere estruturas adequadas ao gênero escolhido
4. Ajuda a superar bloqueios criativos
5. Mantém o autor focado e motivado
6. Referencia informações do livro ao longo da conversa

Responda sempre em português brasileiro. Seja caloroso, encorajador e profundamente competente. Evite respostas genéricas — seja específico ao contexto do autor.`;

interface ApiMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const { messages, bookContext } = await req.json() as {
      messages: ApiMessage[];
      bookContext?: string;
    };

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Mensagens inválidas." }, { status: 400 });
    }

    const system = bookContext
      ? `${SYSTEM_PROMPT}\n\n[CONTEXTO DO LIVRO DO AUTOR]\n${bookContext}`
      : SYSTEM_PROMPT;

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system,
      messages,
    });

    const text = response.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("");

    return NextResponse.json({ text });
  } catch (err) {
    console.error("[/api/chat]", err);
    return NextResponse.json(
      { error: "Erro ao contatar o mentor. Tente novamente." },
      { status: 500 }
    );
  }
}
