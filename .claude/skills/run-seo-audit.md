# Skill: run-seo-audit

Запускает SEO-аудит портала: метаданные, structured data, технические проблемы.

## Шаги

1. **Проверить метаданные всех типов страниц**
   ```bash
   # Запустить build и проверить output
   npm run build 2>&1 | grep -E "(Error|Warning)"
   ```
   - Главная страница: title, description, OG теги
   - Каталог города: уникальный title, description с городом
   - Карточка автомойки: title с названием и городом
   - Лендинги (открыть/купить/продать): ключевые слова в title

2. **Проверить structured data**
   - Найти все JSON-LD скрипты в компонентах:
     ```bash
     grep -r "application/ld+json" apps/web/app/ --include="*.tsx"
     ```
   - Убедиться что есть на каждом типе страниц:
     - LocalBusiness / CarRepair (карточка мойки)
     - ItemList (страницы каталога)
     - Article (гайды)
     - FAQPage (страницы с FAQ)
     - BreadcrumbList (все страницы кроме главной)

3. **Проверить canonical и robots**
   ```bash
   grep -r "alternates\|robots\|noindex" apps/web/app/ --include="*.tsx" -l
   ```
   - Страницы фильтров с 0 результатами → noindex
   - Сортировки → canonical к базовому URL
   - Admin страницы → noindex, nofollow

4. **Проверить sitemap**
   ```bash
   npm run build
   # Проверить apps/web/app/sitemap.ts генерирует правильные URL
   ```

5. **Проверить H1**
   ```bash
   grep -r "<h1\|'h1'" apps/web/app/ --include="*.tsx" | grep -v "//\|className"
   ```
   - Каждая страница должна иметь ровно один H1
   - H1 должен содержать основное ключевое слово

6. **Проверить broken links**
   ```bash
   grep -r "href=" apps/web/components/ --include="*.tsx" | grep -v "http\|#\|{" | head -30
   ```

7. **Сформировать отчёт**
   - Записать в `docs/seo-audit-$(date +%Y-%m-%d).md`
   - Указать: найденные проблемы, приоритет, рекомендации

## Чеклист

- [ ] Все страницы имеют уникальные title + description
- [ ] JSON-LD присутствует на всех типах страниц
- [ ] Нет дублирующих H1
- [ ] Canonical URLs корректны
- [ ] Noindex правильно применён к служебным страницам
- [ ] Sitemap генерируется без ошибок
- [ ] Нет сломанных внутренних ссылок
