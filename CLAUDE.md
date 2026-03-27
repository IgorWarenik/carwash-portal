# CLAUDE.md — Портал Автомоек

## О проекте

Вертикальный портал-справочник по автомойкам для российского рынка.
Направления: каталог, покупка/продажа бизнеса, открытие, поставщики, франшизы, инструменты.
SEO-стратегия: Яндекс-first, программатический SEO, матрица город×тип.

## Архитектура

**Монорепо** (npm workspaces):
- `apps/web` — Next.js 14 App Router (основное приложение)
- `apps/agents` — Claude Agent SDK (13 агентов-сотрудников)
- `apps/api` — NestJS (deprecated, заменён Next.js Server Actions)
- `packages/db` — Prisma 5 + PostgreSQL schema
- `packages/ui` — Shared React компоненты
- `packages/seo` — JSON-LD, metadata утилиты
- `packages/content` — Калькуляторы, контент-модели
- `packages/config` — Shared configs (tailwind, tsconfig, eslint)

**ADR**: [docs/adr/001-nextjs-monorepo.md](docs/adr/001-nextjs-monorepo.md)

## Команды

```bash
npm run dev          # запустить apps/web в dev режиме
npm run build        # собрать все пакеты
npm run lint         # eslint
npm run typecheck    # tsc --noEmit
npm run test         # vitest
npm run db:migrate   # применить миграции
npm run db:seed      # загрузить seed данные
npm run db:studio    # Prisma Studio
npm run agents       # запустить агента (npm run agents -- --agent=employee-orchestrator)
```

## Стек

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion, Zustand
- **Backend**: Next.js Server Actions, Prisma 5, PostgreSQL (Neon)
- **Auth**: NextAuth.js (admin только)
- **Формы**: React Hook Form + Zod
- **Агенты**: Claude Agent SDK (`claude-opus-4-6`)
- **Деплой**: Vercel (web) + Neon (DB)

## SEO правила (строго соблюдать)

- Каждая страница экспортирует `generateMetadata()` с уникальным title + description
- Canonical URL обязателен на всех страницах
- JSON-LD обязателен: тип зависит от страницы (LocalBusiness, Article, FAQPage, ItemList)
- `BreadcrumbList` на всех страницах кроме главной
- Страницы с 0 результатов → `robots: noindex`
- Admin, API → `noindex, nofollow`
- Не создавать дублирующих URL (slug должен быть уникален)

## Типы страниц и URL структура

| Тип | URL паттерн |
|-----|-------------|
| Каталог города | `/avtomoyki/[city]` |
| Каталог город+тип | `/avtomoyki/[city]/[type]` |
| Карточка автомойки | `/avtomoyki/[city]/[slug]` |
| Открыть автомойку | `/otkryt-avtomoiku` |
| Купить автомойку | `/kupit-avtomoiku/[city]` |
| Продать автомойку | `/prodat-avtomoiku/[city]` |
| Поставщики | `/postavshchiki/[slug]` |
| Франшизы | `/franshizy/[slug]` |
| Гайды | `/guides/[slug]` |
| Инструменты | `/tools/[slug]` |
| Сравнения | `/sravnenie/[slug]` |
| Admin | `/admin/*` |

## Агенты-сотрудники

Запуск: `npm run agents -- --agent=<name>`

| Агент | Ответственность |
|-------|----------------|
| `employee-orchestrator` | Координация всех агентов |
| `employee-product-manager` | PRD, скоуп, метрики |
| `employee-information-architect` | Sitemap, URL таксономия |
| `employee-seo-strategist` | SEO архитектура, схема, программатик |
| `employee-content-systems-editor` | Контент-модели, редполитика |
| `employee-frontend-engineer` | Next.js UI, Server Components |
| `employee-backend-engineer` | Prisma, Server Actions, Admin CRUD |
| `employee-directory-search-engineer` | Поиск, фильтры, фасетная навигация |
| `employee-calculator-engineer` | 3 калькулятора + wizard |
| `employee-data-ingestion-specialist` | Seed, ETL, дедупликация |
| `employee-analytics-cro-specialist` | Аналитика, события, CRO |
| `employee-qa-security-engineer` | Тесты, lint, безопасность |
| `employee-devops-release-engineer` | CI/CD, скрипты, деплой |

## Skills (slash-команды)

| Skill | Назначение |
|-------|-----------|
| `/add-new-city-pages` | Добавить новый город |
| `/publish-commercial-guide` | Опубликовать гайд |
| `/publish-supplier-page` | Опубликовать поставщика |
| `/publish-business-listing` | Опубликовать листинг |
| `/create-comparison-page` | Страница сравнения |
| `/run-seo-audit` | SEO аудит |
| `/validate-structured-data` | Валидация JSON-LD |
| `/import-directory-data` | Импорт данных CSV |
| `/release-checklist` | Чеклист релиза |

## Guardrails (что нельзя)

- Никаких секретов в коде (ANTHROPIC_API_KEY, DATABASE_URL и т.д.)
- Никаких `console.log` в production коде `apps/web/app/`
- Никаких листингов/автомоек в статусе `active` без прохождения модерации
- Никаких `dangerouslySetInnerHTML` без sanitization
- Никаких `as any` в типах Prisma / JSON-LD объектах
- Не создавать страницы без `generateMetadata()` и canonical

## Переменные окружения (обязательные)

```
DATABASE_URL=          # Neon connection string
ANTHROPIC_API_KEY=     # Anthropic API
NEXTAUTH_SECRET=       # openssl rand -base64 32
NEXTAUTH_URL=          # http://localhost:3000 (dev)
NEXT_PUBLIC_SITE_URL=  # https://avtomoyki-portal.ru (prod)
YANDEX_METRIKA_ID=     # (prod only)
```

## Документация

- [Стратегия портала](docs/PORTAL_STRATEGY.md)
- [PRD](docs/PRD.md)
- [Информационная архитектура](docs/INFORMATION_ARCHITECTURE.md)
- [SEO стратегия](docs/SEO_STRATEGY.md)
- [Контент-система](docs/CONTENT_SYSTEM.md)
- [Модель данных](docs/DATA_MODEL.md)
- [Монетизация](docs/MONETIZATION.md)
- [Аналитика](docs/ANALYTICS_PLAN.md)
- [Технический стек](docs/TECH_STACK.md)
- [Деплой](docs/DEPLOYMENT.md)
- [ADR-001: Next.js Monorepo](docs/adr/001-nextjs-monorepo.md)
