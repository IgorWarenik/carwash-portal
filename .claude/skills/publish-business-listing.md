# Skill: publish-business-listing

Публикует объявление о продаже/покупке автомойки как бизнеса.

## Шаги

1. **Создать листинг в БД**
   - Через admin: `/admin/listings/new`
   - Тип листинга: `BUY` (ищу купить) | `SELL` (продаю)
   - Обязательные поля:
     ```
     title, slug, description, listingType,
     city, address, carwashType,
     price (или priceRange для BUY),
     revenue?, profit?, posts?,
     landStatus: OWNED|LEASE,
     equipmentAge?, photos[],
     contactPhone, contactName,
     status: 'pending_review'
     ```

2. **Модерация**
   - Все новые листинги создаются со статусом `pending_review`
   - Проверить в `/admin/listings/pending`
   - Проверить: реальность данных, отсутствие спама, корректность цены
   - После проверки: установить `status: 'active'`

3. **SEO**
   - Title: `Продам автомойку в <Городе> — <тип> за <цена>₽`
   - Description: краткое описание объекта
   - JSON-LD: `RealEstateListing` или кастомный `Offer`
   - Canonical: `/kupit-avtomoiku/<city>/<slug>` или `/prodat-avtomoiku/<city>/<slug>`

4. **Медиа**
   - Минимум 1 фото (обязательно)
   - Фото должны быть WebP или JPEG, < 2MB каждое
   - Alt текст для каждого фото

5. **CTA**
   - Кнопка "Узнать подробности" → лид-форма с типом BUY/SELL
   - Кнопка "Позвонить" → `tel:` ссылка с трекингом `click_phone`

6. **Проверить страницу**
   - SELL: `/prodat-avtomoiku/<city>/<slug>`
   - BUY: `/kupit-avtomoiku/<city>/<slug>`

## Чеклист

- [ ] Листинг прошёл модерацию
- [ ] Статус установлен в active
- [ ] Фото загружены (минимум 1)
- [ ] SEO метаданные корректны
- [ ] JSON-LD валиден
- [ ] CTA кнопки работают
- [ ] Страница индексируется (не noindex)
