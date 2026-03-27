# DEPLOYMENT.md — Портал Автомоек

## Окружения

| Окружение | URL | Ветка | БД |
|-----------|-----|-------|----|
| Development | localhost:3000 | любая | локальный PostgreSQL |
| Preview | vercel-preview-url | PR ветки | Neon staging branch |
| Production | avtomoyki-portal.ru | main | Neon production |

## Быстрый старт (разработка)

```bash
# 1. Клонировать и установить зависимости
git clone https://github.com/igorgurbamov/carwash-portal.git
cd carwash-portal
npm install

# 2. Настроить переменные окружения
cp .env.example .env.local
# Заполнить .env.local реальными значениями

# 3. Применить миграции и seed
npm run db:migrate
npm run db:seed

# 4. Запустить dev сервер
npm run dev
```

## Переменные окружения

| Переменная | Описание | Обязательна |
|-----------|---------|-------------|
| `DATABASE_URL` | Neon connection string | Да |
| `ANTHROPIC_API_KEY` | API ключ Anthropic | Да (для агентов) |
| `NEXTAUTH_SECRET` | Секрет NextAuth (openssl rand -base64 32) | Да |
| `NEXTAUTH_URL` | Базовый URL приложения | Да |
| `NEXT_PUBLIC_SITE_URL` | Публичный URL (для canonical, sitemap) | Да |
| `YANDEX_METRIKA_ID` | ID счётчика Метрики | Нет (для prod) |

## Деплой на Production

### Автоматически (через GitHub Actions)
```yaml
# .github/workflows/deploy.yml
# Триггер: push в main ветку
# Действие: vercel --prod
```

### Вручную
```bash
# Убедиться что в main ветке
git checkout main
git pull

# Запустить проверки
npm run lint
npm run typecheck
npm run test

# Деплой через Vercel CLI
npx vercel --prod
```

## Миграции БД

```bash
# Создать новую миграцию (разработка)
npm run db:migrate:dev -- --name description_of_change

# Применить миграции (production/staging)
npm run db:migrate

# Проверить статус
npx prisma migrate status
```

**Важно**: всегда применяй миграции ДО деплоя нового кода.

## Rollback

```bash
# Откат к предыдущему деплою через Vercel dashboard
# или через CLI:
npx vercel rollback

# Откат миграции БД (если нужно):
# Создать новую миграцию которая отменяет изменения
# НЕ использовать prisma migrate reset на production!
```

## Мониторинг

- **Vercel Analytics**: Core Web Vitals, трафик
- **Vercel Logs**: ошибки серверных компонентов и API routes
- **Neon Dashboard**: метрики БД, slow queries
- **Yandex.Metrika**: поведение пользователей, конверсии

## Checklist перед деплоем

```
□ npm run lint — без ошибок
□ npm run typecheck — без ошибок
□ npm run test — все тесты проходят
□ npm run build — сборка успешна
□ .env.example актуален
□ Миграции применены на staging
□ Smoke test на staging прошёл
□ CHANGELOG.md обновлён
```
