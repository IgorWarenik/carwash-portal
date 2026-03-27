# Skill: release-checklist

Чеклист для проверки перед каждым релизом в production.

## Pre-release проверки

### 1. Код и качество
```bash
npm run lint          # ESLint — нет критических ошибок
npm run typecheck     # tsc --noEmit — нет TypeScript ошибок
npm run test          # Vitest — все тесты проходят
npm run build         # Next.js build — успешно без ошибок
```

### 2. База данных
```bash
npx prisma migrate status   # Все миграции применены
npx prisma validate         # Schema валидна
```

### 3. SEO и structured data
- [ ] `npm run validate:structured-data` — нет ошибок JSON-LD
- [ ] Sitemap генерируется: `curl /sitemap.xml | head -50`
- [ ] Robots.txt актуален
- [ ] Нет новых noindex на важных страницах

### 4. Безопасность
- [ ] `git grep -r "ANTHROPIC_API_KEY\|DATABASE_URL\|SECRET"` — нет секретов в коде
- [ ] `.env.example` актуален (все новые переменные добавлены)
- [ ] Нет `console.log` в production коде: `grep -r "console\.log" apps/web/app/ --include="*.ts" --include="*.tsx"`
- [ ] Нет `dangerouslySetInnerHTML` без sanitization

### 5. Производительность
- [ ] Bundle size не вырос > 10% без обоснования
- [ ] Новые изображения в WebP/AVIF формате
- [ ] Нет импортов которые ломают tree-shaking

### 6. Контент и данные
- [ ] Нет Lorem ipsum в production данных
- [ ] Seed данные актуальны
- [ ] Admin panel работает

### 7. Маршруты
- [ ] Нет сломанных ссылок на главных страницах
- [ ] Редиректы для изменённых URL настроены
- [ ] 404 страница работает корректно

## Staging smoke test

После деплоя на staging проверить вручную:
- [ ] Главная страница загружается
- [ ] Каталог мойки в одном городе работает (фильтры, поиск)
- [ ] Карточка автомойки открывается
- [ ] Лид-форма отправляется (тестовые данные)
- [ ] Admin panel доступен
- [ ] Калькулятор считает

## Production deploy

```bash
# 1. Применить миграции
DATABASE_URL=<prod_url> npx prisma migrate deploy

# 2. Деплой
npx vercel --prod

# 3. Проверить
curl -I https://avtomoyki-portal.ru  # 200 OK
curl https://avtomoyki-portal.ru/sitemap.xml | head -20
```

## Post-release

- [ ] Обновить CHANGELOG.md
- [ ] Создать git tag: `git tag v0.X.Y && git push --tags`
- [ ] Уведомить команду

## Rollback (если нужен)

```bash
npx vercel rollback
# БД: создать новую миграцию для отката изменений схемы
```
