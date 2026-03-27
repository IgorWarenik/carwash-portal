# Skill: publish-commercial-guide

Публикует коммерческий гайд (статья + лид-форма + CTA) в разделе /guides/.

## Шаги

1. **Создать контент файл**
   - Путь: `packages/content/src/guides/<slug>.mdx`
   - Обязательные поля фронтматтера:
     ```yaml
     title: "Заголовок гайда (50-60 символов)"
     description: "Описание для SEO (150-160 символов)"
     slug: "url-friendly-slug"
     category: "open|buy|sell|franchise|supplier|general"
     city: "moscow" # или null если общий
     publishedAt: "2025-01-15"
     updatedAt: "2025-01-15"
     author: "editorial"
     leadType: "OPEN|BUY|SELL|FRANCHISE|GENERAL"
     ctaTitle: "Текст кнопки CTA"
     ctaDescription: "Подзаголовок CTA"
     featured: false
     ```

2. **Структура контента**
   - H1: один, совпадает с title
   - Intro: 2-3 абзаца, ключевые слова естественно
   - Основные разделы: H2 с LSI-ключевыми словами
   - FAQ блок: минимум 5 вопросов (для FAQ schema)
   - CTA блок в середине и конце: `<LeadForm type="<leadType>" />`

3. **Создать страницу**
   - `apps/web/app/(public)/guides/[slug]/page.tsx` уже существует (динамический маршрут)
   - Убедиться что `generateStaticParams()` берёт данные из content пакета

4. **Добавить JSON-LD**
   - `Article` schema с author, datePublished, dateModified
   - `FAQPage` schema если есть FAQ секция
   - `BreadcrumbList` schema

5. **Проверить CTA**
   - Лид-форма присутствует в первом экране или сразу после intro
   - Финальный CTA блок в конце статьи
   - `lead_form_start` / `lead_form_submit` события трекаются

6. **Запустить валидацию**
   - `npm run lint`
   - `npm run typecheck`
   - Проверить JSON-LD: вставить URL в Google Rich Results Test

## Чеклист

- [ ] Фронтматтер заполнен полностью
- [ ] H1 уникален, один на странице
- [ ] CTA лид-форма присутствует
- [ ] JSON-LD Article + FAQPage валиден
- [ ] Canonical URL корректен
- [ ] Нет console.log в коде
- [ ] Страница доступна по /guides/<slug>
