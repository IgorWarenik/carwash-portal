# Skill: validate-structured-data

Валидирует JSON-LD разметку на всех типах страниц портала.

## Шаги

1. **Найти все JSON-LD компоненты**
   ```bash
   grep -r "application/ld+json" apps/web/ packages/seo/ --include="*.tsx" --include="*.ts" -l
   ```

2. **Проверить TypeScript типизацию**
   ```bash
   npm run typecheck
   ```
   - Все JSON-LD объекты должны быть типизированы через `packages/seo/src/types.ts`
   - Нет `as any` в JSON-LD объектах

3. **Проверить обязательные поля по типу**

   **LocalBusiness / CarRepair** (карточка мойки):
   ```json
   {
     "@type": "AutoWash",
     "name": "required",
     "address": { "@type": "PostalAddress", "addressLocality": "required" },
     "geo": { "latitude": "number", "longitude": "number" },
     "telephone": "optional but recommended",
     "openingHours": "optional"
   }
   ```

   **ItemList** (каталог):
   ```json
   {
     "@type": "ItemList",
     "name": "required",
     "numberOfItems": "number",
     "itemListElement": [{ "@type": "ListItem", "position": "number", "url": "required" }]
   }
   ```

   **Article** (гайды):
   ```json
   {
     "@type": "Article",
     "headline": "required (max 110 chars)",
     "datePublished": "ISO 8601",
     "dateModified": "ISO 8601",
     "author": { "@type": "Organization" }
   }
   ```

   **FAQPage**:
   ```json
   {
     "@type": "FAQPage",
     "mainEntity": [{ "@type": "Question", "name": "required", "acceptedAnswer": { "text": "required" } }]
   }
   ```

4. **Проверить JSON валидность**
   ```bash
   # Найти JSON-LD строки и проверить парсинг
   grep -r "JSON.stringify\|dangerouslySetInnerHTML" apps/web/app/ --include="*.tsx" -A2
   ```

5. **Проверить что нет HTML в JSON-LD**
   - `text` поля в JSON-LD не должны содержать HTML теги
   - Использовать `stripHtml()` если данные приходят из CMS

6. **Логировать результат**
   ```
   ✅ LocalBusiness: 47 страниц — OK
   ✅ ItemList: 23 страницы — OK
   ⚠️ Article: 3 страницы без dateModified
   ❌ FAQPage: 1 страница — невалидный JSON
   ```

## Чеклист

- [ ] Все типы страниц имеют соответствующий JSON-LD
- [ ] JSON синтаксически корректен (парсится без ошибок)
- [ ] Обязательные поля присутствуют для каждого @type
- [ ] Нет HTML тегов в текстовых полях
- [ ] Типизация через TypeScript без any
- [ ] Breadcrumbs присутствуют на всех страницах кроме главной
