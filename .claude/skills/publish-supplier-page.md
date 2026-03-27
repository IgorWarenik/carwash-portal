# Skill: publish-supplier-page

Публикует страницу поставщика оборудования для автомоек.

## Шаги

1. **Создать запись в БД**
   - Через admin panel: `/admin/suppliers/new`
   - Или через seed: добавить в `packages/db/prisma/seeds/suppliers.ts`
   - Обязательные поля:
     ```
     name, slug, description, category, city, phone, website?,
     email?, logo?, services[], productTypes[], priceRange,
     status: 'active'
     ```

2. **Загрузить медиа**
   - Логотип: WebP, 200×200px минимум
   - Фото продукции: WebP, минимум 3 штуки
   - Загрузить через `/admin/suppliers/<id>/media`

3. **Проверить страницу**
   - URL: `/postavshchiki/<slug>`
   - Компонент: `apps/web/app/(public)/postavshchiki/[slug]/page.tsx`
   - Убедиться что страница отдаёт 200, не 404

4. **SEO**
   - Title: `<Название> — поставщик оборудования для автомоек`
   - Description: 150-160 символов с ключевыми словами
   - JSON-LD: `LocalBusiness` или `Organization`
   - Canonical: корректный

5. **CTA элементы**
   - Кнопка "Получить КП" или "Связаться" — ведёт к лид-форме
   - `click_supplier_contact` событие трекается при клике

6. **Статус публикации**
   - Установить `status: 'active'` в БД
   - Убедиться что страница не noindex

## Чеклист

- [ ] Запись создана в БД со статусом active
- [ ] Медиа загружено (логотип + фото)
- [ ] Страница доступна по /postavshchiki/<slug>
- [ ] SEO метаданные заполнены
- [ ] JSON-LD валиден
- [ ] CTA кнопка работает
- [ ] Аналитика трекается
