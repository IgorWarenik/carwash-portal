# TECH_STACK.md — Портал Автомоек

## Решение: Next.js App Router Monorepo

**ADR**: [001-nextjs-monorepo.md](./adr/001-nextjs-monorepo.md)

## Frontend

| Технология | Версия | Назначение |
|-----------|--------|-----------|
| Next.js | 14 | App Router, ISR, SSG, Server Actions |
| React | 18 | UI компоненты |
| TypeScript | 5 | Типизация |
| Tailwind CSS | 3 | Стилизация (Neo-Swiss дизайн) |
| Framer Motion | 11 | Анимации |
| Zustand | 4 | Клиентский стейт |
| React Hook Form | 7 | Формы |
| Zod | 3 | Валидация |

## Backend (встроен в Next.js)

| Технология | Версия | Назначение |
|-----------|--------|-----------|
| Next.js Server Actions | 14 | Мутации данных |
| Next.js API Routes | 14 | REST endpoints где нужно |
| Prisma | 5 | ORM + миграции |
| PostgreSQL | 16 | База данных (Neon) |
| NextAuth.js | 4 | Аутентификация (admin) |

## Инфраструктура

| Сервис | Назначение |
|--------|-----------|
| Vercel | Хостинг Next.js |
| Neon | PostgreSQL (serverless) |
| GitHub | Код + CI/CD |
| GitHub Actions | CI: lint, typecheck, tests |

## Monorepo структура

```
carwash-portal/
├── apps/
│   ├── web/          # Next.js App Router (основное приложение)
│   └── agents/       # Claude Agent SDK система агентов
├── packages/
│   ├── db/           # Prisma schema + migrations + seed
│   ├── ui/           # Shared React компоненты
│   ├── config/       # Shared конфиги (eslint, tailwind, tsconfig)
│   ├── seo/          # SEO утилиты (metadata, JSON-LD, sitemap)
│   └── content/      # Контент модели, калькуляторы, гайды
└── docs/             # Документация
```

## SEO стратегия (технически)

- **ISR** (revalidate: 3600) для каталоговых страниц
- **SSG** (`generateStaticParams`) для статичных городов/типов
- **Server Components** — нет гидратации там, где не нужна
- **Dynamic sitemap** из БД
- **JSON-LD** через `packages/seo/src/jsonld.ts`
- **Robots.txt** с noindex для admin, search, filter-combinations > 3

## Агентная система

| Компонент | Технология |
|-----------|-----------|
| Claude Agent SDK | `@anthropic-ai/claude-agent-sdk` |
| Model | `claude-opus-4-6` |
| Оркестратор | `apps/agents/src/orchestrator.ts` |
| Агенты | 13 employee-agents |
| Skills | 9 skills в `.claude/skills/` |

## Решения НЕ использовать

- **NestJS** — избыточен для SEO-портала; Next.js Server Actions закрывают 90% потребностей
- **Vite** — заменён Next.js для унификации стека
- **Redis** — Neon достаточно для начального трафика
- **Elasticsearch** — pg_trgm в PostgreSQL достаточно для v1
