# CHANGELOG

Все значимые изменения в проекте документируются здесь.

Формат основан на [Keep a Changelog](https://keepachangelog.com/ru/1.0.0/).

## [Unreleased]

### Добавлено
- Монорепо структура с npm workspaces (apps/*, packages/*)
- 13 специализированных агентов-сотрудников на Claude Agent SDK
- 9 skills для автономной разработки
- 12 стратегических документов (PRD, SEO, IA, Data Model и др.)
- ADR-001: переход на Next.js App Router
- Базовая структура packages/db, packages/ui, packages/seo, packages/content

## [0.1.0] — 2025-01-15

### Добавлено
- Инициализация монорепо
- apps/api: NestJS + Prisma + PostgreSQL (базовая структура)
- apps/web: Vite + React 18 (заменяется на Next.js в v0.2.0)
- apps/agents: Claude Agent SDK оркестратор + 6 начальных агентов
- Базовая Prisma schema: User, Carwash, Lead, SiteSettings, BlogPost
- GitHub репозиторий: igorgurbamov/carwash-portal
