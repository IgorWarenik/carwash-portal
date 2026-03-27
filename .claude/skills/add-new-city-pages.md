# Skill: add-new-city-pages

Добавляет новый город в портал: создаёт все необходимые страницы, обновляет sitemap и конфигурацию.

## Шаги

1. **Добавить город в БД**
   - Открыть `packages/db/prisma/seeds/cities.ts`
   - Добавить запись: `{ name, slug, region, population, isActive: true }`
   - Запустить: `npm run db:seed -- --city=<slug>`

2. **Создать страницы города**
   - `apps/web/app/(public)/avtomoyki/<city-slug>/page.tsx` — каталог мойки в городе
   - `apps/web/app/(public)/avtomoyki/<city-slug>/[type]/page.tsx` — по типу мойки
   - `apps/web/app/(public)/kupit-avtomoiku/<city-slug>/page.tsx` — купить в городе
   - `apps/web/app/(public)/prodat-avtomoiku/<city-slug>/page.tsx` — продать в городе

3. **Проверить SEO-метаданные**
   - Убедиться, что каждая страница экспортирует `generateMetadata()`
   - Title: `Автомойки в <Городе> — каталог, цены, отзывы | АвтомойкиПортал`
   - Description: уникальное для каждого города
   - Canonical: абсолютный URL
   - JSON-LD: `LocalBusiness` или `ItemList`

4. **Обновить sitemap**
   - `apps/web/app/sitemap.ts` автоматически генерирует из БД
   - Проверить что новый город появился: `npm run build && curl /sitemap.xml | grep <city-slug>`

5. **Добавить в навигацию**
   - Обновить `apps/web/lib/config/cities.ts` (список городов для меню)

6. **Валидация**
   - `npm run lint`
   - `npm run typecheck`
   - Проверить страницы в браузере

## Чеклист

- [ ] Город добавлен в БД
- [ ] Все страницы созданы
- [ ] Метаданные уникальны
- [ ] JSON-LD валиден
- [ ] Sitemap обновлён
- [ ] Навигация обновлена
- [ ] Нет сломанных ссылок
