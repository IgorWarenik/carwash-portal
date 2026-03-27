# Skill: import-directory-data

Импортирует данные об автомойках из CSV/JSON файла через ETL pipeline с модерацией.

## Шаги

1. **Подготовить файл данных**
   - CSV формат: `name,address,city,type,phone,website,lat,lng,services`
   - JSON формат: массив объектов с теми же полями
   - Шаблон: `packages/db/scripts/templates/carwash-import-template.csv`

2. **Запустить валидацию файла**
   ```bash
   npm run db:validate-import -- --file=./import-data.csv
   ```
   - Проверяет формат CSV/JSON
   - Проверяет обязательные поля: name, city, type
   - Проверяет что city есть в базе городов
   - Выводит список ошибок до импорта

3. **Запустить импорт**
   ```bash
   npm run db:import -- --file=./import-data.csv --source=manual --dry-run
   ```
   - `--dry-run`: показать что будет импортировано без записи в БД
   - Убрать `--dry-run` для реального импорта

4. **Dedupe логика**
   - По связке `name + city`: если существует — пропустить (не обновлять)
   - По `phone`: предупредить о дубликате
   - Логировать все пропущенные записи

5. **Provenance поля (обязательно)**
   ```typescript
   {
     source: 'import',
     sourceUrl: null,        // или URL откуда взяты данные
     importedAt: new Date(),
     verifiedAt: null,       // null до ручной проверки
     verifiedBy: null,
   }
   ```

6. **Модерация**
   - Все импортированные записи → `status: 'pending_review'`
   - Открыть `/admin/carwashes/pending` для проверки
   - После проверки каждой записи → `status: 'active'`
   - Никогда не делать auto-publish без модерации!

7. **Проверить результат**
   ```bash
   # Посмотреть pending записи
   npm run db:studio
   # или через admin panel /admin/carwashes?status=pending_review
   ```

## Формат CSV

```csv
name,address,city,type,phone,website,lat,lng,services
"АвтоМойка Звезда","ул. Ленина 15","moscow","self_service","+7 495 123-45-67","","55.7558","37.6173","wash,vacuum"
```

Допустимые значения `type`: `self_service`, `automatic`, `manual`, `detailing`, `truck`

## Чеклист

- [ ] Файл прошёл валидацию без критических ошибок
- [ ] Dry-run показал ожидаемые результаты
- [ ] Дубликаты обработаны (пропущены с логом)
- [ ] Provenance поля заполнены
- [ ] Все записи в статусе pending_review
- [ ] Модератор уведомлён о новых записях на проверку
