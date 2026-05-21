# Mentor Literário BestSeller

Plataforma SaaS para autoras independentes que desejam escrever, publicar e vender livros de ficção na Amazon KDP.

## Objetivo

Guiar escritoras iniciantes e autoras independentes da ideia à publicação, unindo escrita criativa, Amazon KDP e marketing literário em uma jornada clara e personalizada.

## Stack

- **Next.js 15** com App Router
- **TypeScript**
- **Tailwind CSS** (paleta literária personalizada)
- **Lucide React** (ícones)
- **Local state** (sem banco de dados real nesta versão)

## Como instalar

```bash
npm install
```

## Como rodar localmente

```bash
npm run dev
```

Acesse: http://localhost:3000

## Estrutura de páginas

### Área pública
| Rota | Descrição |
|------|-----------|
| `/` | Página inicial com hero, dores, pilares e planos |
| `/login` | Login simulado |
| `/cadastro` | Cadastro simulado |
| `/planos` | Página de planos pública |

### Área logada (layout com Sidebar)
| Rota | Descrição |
|------|-----------|
| `/dashboard` | Dashboard com progresso, tarefas e acesso rápido |
| `/diagnostico` | Formulário de diagnóstico literário (10 perguntas) |
| `/meu-livro` | Caderno central do projeto literário |
| `/jornada` | Jornada guiada com 10 etapas |
| `/mentor` | Chat com Mentor BestSeller |
| `/autoria/*` | 8 módulos de criação literária |
| `/amazon/*` | 6 módulos de publicação na Amazon |
| `/autonomia/*` | 7 módulos de lançamento e marketing |
| `/biblioteca` | 12 templates prontos |
| `/planos` | Planos dentro da área logada |
| `/configuracoes` | Configurações de perfil |

## Funcionalidades simuladas

- Login e cadastro redirecionam para o dashboard sem autenticação real
- Chat do Mentor BestSeller usa respostas pré-definidas (sem IA real)
- Todos os módulos geram resultados mockados ao clicar em "Gerar resultado"
- Progresso e dados salvos em estado local (localStorage não implementado nesta versão)
- Checklist KDP com estado interativo

## Próximos passos

### Supabase (banco de dados e autenticação)
- Substituir estado local por chamadas ao Supabase
- Autenticação real com `@supabase/auth-helpers-nextjs`
- Salvar diagnóstico, meu livro e entregáveis por usuário

### IA real (Claude / OpenAI)
- Conectar módulos ao endpoint de IA
- O Mentor BestSeller passa a usar contexto real do usuário
- Resultados gerados dinamicamente

### Pagamentos (Stripe)
- Integrar Stripe com planos mensais
- Middleware de proteção de rotas por plano
- Webhook para ativação/cancelamento

## Identidade visual

Paleta: creme, vinho, dourado suave, marrom café, preto elegante, bege claro.
Tipografia: Georgia (serif) para títulos, Inter (sans) para corpo.
Tom: escritório editorial premium, mentoria literária estratégica.
