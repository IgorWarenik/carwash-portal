# Модель данных — Портал Автомоек

**Версия:** 1.0
**Дата:** 2026-03-25
**ORM:** Prisma (packages/db)

---

## 1. Географические сущности

### Region (Регион/Область)

```prisma
model Region {
  id          String   @id @default(cuid())
  name        String   // «Москва», «Московская область»
  slug        String   @unique // «moscow-region»
  federalDistrict String? // «Центральный федеральный округ»

  // SEO
  seoTitle       String?
  seoDescription String?

  // Системные
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Связи
  cities      City[]
}
```

### City (Город)

```prisma
model City {
  id          String   @id @default(cuid())
  name        String   // «Москва»
  slug        String   @unique // «moscow»
  regionId    String
  region      Region   @relation(fields: [regionId], references: [id])

  population  Int?     // Для определения приоритета индексации
  latitude    Float?
  longitude   Float?

  // SEO
  seoTitle       String?
  seoDescription String?
  seoH1          String?
  seoIntroText   String? // Уникальный вводный абзац для городской страницы

  // Статус
  isIndexed   Boolean  @default(false) // Достаточно данных для публикации
  priority    Int      @default(0)     // Приоритет обогащения (0–10)

  // Системные
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Связи
  carWashes   CarWash[]
  districts   District[]
  businessListings BusinessListingForSale[]
}
```

### District (Район/Округ)

```prisma
model District {
  id      String @id @default(cuid())
  name    String // «Таганский район»
  slug    String // «tagansky»
  cityId  String
  city    City   @relation(fields: [cityId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  carWashes CarWash[]

  @@unique([cityId, slug])
}
```

---

## 2. Автомойки

### CarWashType (Тип автомойки)

```prisma
model CarWashType {
  id          String  @id @default(cuid())
  name        String  // «Контактная», «Бесконтактная»
  slug        String  @unique // «contactnaya»
  description String? // Краткое описание типа

  // SEO
  seoTitle       String?
  seoDescription String?

  sortOrder   Int     @default(0)

  carWashes   CarWash[]
}
```

### CarWash (Автомойка)

```prisma
model CarWash {
  id          String @id @default(cuid())

  // Основные данные
  name        String
  slug        String @unique
  description String? @db.Text

  // Местоположение
  cityId      String
  city        City   @relation(fields: [cityId], references: [id])
  districtId  String?
  district    District? @relation(fields: [districtId], references: [id])
  address     String
  latitude    Float?
  longitude   Float?
  yandexMapsUrl String?
  googleMapsUrl  String?

  // Тип
  typeId      String
  type        CarWashType @relation(fields: [typeId], references: [id])

  // Контакты
  phone       String?
  phoneFormatted String? // +7 (495) 123-45-67
  website     String?
  email       String?

  // Бизнес-данные
  priceRangeMin Int?   // Минимальная цена услуги в рублях
  priceRangeMax Int?
  priceRangeLabel String? // «от 200 руб.»

  // Медиа
  coverImageUrl String?
  images        CarWashImage[]

  // Связи
  services      CarWashService[]
  features      CarWashFeature[]
  openingHours  OpeningHours[]

  // SEO
  seoTitle       String?
  seoDescription String?
  canonicalUrl   String?

  // Статус и модерация
  status        CarWashStatus @default(DRAFT)
  isVerified    Boolean @default(false)
  isFeatured    Boolean @default(false)  // Платный топ
  isPro         Boolean @default(false)  // Pro-тариф
  moderatedAt   DateTime?
  moderatedBy   String?
  moderationNote String?

  // Источник данных
  dataSource    String? // «manual» | «2gis» | «yandex» | «owner»
  externalId    String? // ID в источнике

  // Системные
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  publishedAt   DateTime?

  @@index([cityId, status])
  @@index([typeId, status])
  @@index([slug])
}

enum CarWashStatus {
  DRAFT
  REVIEW
  PUBLISHED
  SUSPENDED
  DELETED
}
```

### Service (Услуга)

```prisma
model Service {
  id    String @id @default(cuid())
  name  String @unique // «Мойка кузова», «Химчистка салона»
  slug  String @unique
  icon  String? // Имя иконки из design system

  carWashServices CarWashService[]
}

model CarWashService {
  carWashId String
  serviceId String
  price     Int?    // Цена в рублях
  priceLabel String? // «от 500 руб.»

  carWash   CarWash @relation(fields: [carWashId], references: [id])
  service   Service @relation(fields: [serviceId], references: [id])

  @@id([carWashId, serviceId])
}
```

### Feature (Особенность/Удобство)

```prisma
model Feature {
  id   String @id @default(cuid())
  name String @unique // «Круглосуточно», «Кафе», «Зона ожидания»
  slug String @unique
  icon String?

  carWashFeatures CarWashFeature[]
}

model CarWashFeature {
  carWashId String
  featureId String

  carWash   CarWash @relation(fields: [carWashId], references: [id])
  feature   Feature @relation(fields: [featureId], references: [id])

  @@id([carWashId, featureId])
}
```

### OpeningHours (Часы работы)

```prisma
model OpeningHours {
  id          String  @id @default(cuid())
  carWashId   String
  carWash     CarWash @relation(fields: [carWashId], references: [id])

  dayOfWeek   Int     // 0 = Вс, 1 = Пн, ..., 6 = Сб
  openTime    String? // «09:00»
  closeTime   String? // «21:00»
  isOpen      Boolean @default(true)
  isTwentyFourHours Boolean @default(false)

  @@unique([carWashId, dayOfWeek])
}
```

### CarWashImage

```prisma
model CarWashImage {
  id        String @id @default(cuid())
  carWashId String
  carWash   CarWash @relation(fields: [carWashId], references: [id])

  url       String
  alt       String?
  sortOrder Int    @default(0)
  isCover   Boolean @default(false)

  createdAt DateTime @default(now())
}
```

---

## 3. Поставщики и франшизы

### SupplierCategory

```prisma
model SupplierCategory {
  id          String @id @default(cuid())
  name        String // «Оборудование», «Химия», «Автоматика»
  slug        String @unique
  description String?
  icon        String?
  sortOrder   Int @default(0)

  // SEO
  seoTitle       String?
  seoDescription String?

  suppliers   Supplier[]
}
```

### Supplier (Поставщик)

```prisma
model Supplier {
  id          String @id @default(cuid())
  name        String
  slug        String @unique

  categoryId  String
  category    SupplierCategory @relation(fields: [categoryId], references: [id])

  // Описания
  shortDescription String? // До 200 символов, для карточки
  description      String? @db.Text // Полное описание

  // Контакты
  website     String?
  phone       String?
  email       String?
  address     String?

  // Медиа
  logoUrl     String?
  coverImageUrl String?

  // Коммерческие условия
  deliveryRegions String? // «Вся Россия», «Москва и МО»
  minOrderAmount  Int?

  // Продукты (массив JSON или отдельная таблица)
  productsJson    Json? // [{name, description, priceFrom}]

  // Размещение (тариф)
  plan          SupplierPlan @default(FREE)
  planExpiresAt DateTime?

  // SEO
  seoTitle       String?
  seoDescription String?
  canonicalUrl   String?

  // Статус
  status        ContentStatus @default(DRAFT)
  isVerified    Boolean @default(false)
  isFeatured    Boolean @default(false)

  // Системные
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  publishedAt   DateTime?
}

enum SupplierPlan {
  FREE
  STANDARD
  PREMIUM
  EXCLUSIVE
}
```

### Franchise (Франшиза)

```prisma
model Franchise {
  id    String @id @default(cuid())
  name  String
  slug  String @unique

  // Описание
  shortDescription String?
  description      String? @db.Text

  // Финансовые условия
  investmentMin    Int?   // Минимальные инвестиции в рублях
  investmentMax    Int?
  royalty          Float? // % роялти
  lumpSum          Int?   // Паушальный взнос
  paybackMonthsMin Int?
  paybackMonthsMax Int?

  // Контакты и ссылки
  website   String?
  phone     String?
  email     String?

  // Медиа
  logoUrl      String?
  coverImageUrl String?
  imagesJson    Json?

  // Условия
  supportDescription String? @db.Text
  requirementsJson   Json? // {area: 200, investment: 3000000}
  citiesCount        Int? // В скольких городах работает
  franchiseesCount   Int?

  // SEO
  seoTitle       String?
  seoDescription String?

  // Статус
  status    ContentStatus @default(DRAFT)
  isFeatured Boolean @default(false)
  plan      SupplierPlan @default(FREE)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  publishedAt DateTime?
}
```

---

## 4. Инвестиционные сущности

### BusinessListingForSale (Объявление о продаже бизнеса)

```prisma
model BusinessListingForSale {
  id     String @id @default(cuid())
  slug   String @unique

  // Основные данные
  title       String
  description String @db.Text

  // Местоположение
  cityId   String
  city     City @relation(fields: [cityId], references: [id])
  address  String?

  // Финансовые данные
  askingPrice    Int    // Цена в рублях
  annualRevenue  Int?   // Годовая выручка
  annualProfit   Int?   // Годовая прибыль
  paybackMonths  Int?   // Расчётная окупаемость для нового владельца

  // Характеристики объекта
  carWashType    String? // Тип автомойки
  areaM2         Int?    // Площадь в кв.м.
  postsCount     Int?    // Количество постов
  leaseMonthly   Int?    // Арендная плата
  leaseEndsAt    DateTime?
  staffCount     Int?

  // Причина продажи
  saleReason     String?

  // Медиа
  images         BusinessListingImage[]

  // Контакты продавца
  sellerName     String?
  sellerPhone    String?
  sellerEmail    String?
  isAgency       Boolean @default(false)

  // Статус
  status        ListingStatus @default(PENDING)
  isFeatured    Boolean @default(false)
  isVerified    Boolean @default(false)
  moderationNote String?

  // SEO
  seoTitle       String?
  seoDescription String?

  // Системные
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  publishedAt   DateTime?
  expiresAt     DateTime? // Дата окончания размещения
}

enum ListingStatus {
  PENDING
  PUBLISHED
  SOLD
  EXPIRED
  REJECTED
}
```

---

## 5. Лиды

### Lead (Лид)

```prisma
model Lead {
  id       String @id @default(cuid())

  // Данные пользователя
  name     String
  phone    String
  email    String?
  comment  String? @db.Text

  // Классификация
  type     LeadType
  subtype  String?  // Уточнение: «портальная», «франшиза Х»

  // Источник
  sourcePage    String // URL страницы
  sourceSection String? // Секция страницы (CTA ID)
  utmSource     String?
  utmMedium     String?
  utmCampaign   String?
  utmContent    String?
  utmTerm       String?

  // Атрибуция партнёра
  partnerId    String?  // ID поставщика/франшизы/партнёра
  partnerType  String?  // «supplier» | «franchise» | «bank»

  // Статус
  status       LeadStatus @default(NEW)
  isValid      Boolean @default(true)
  invalidReason String?

  // Обработка
  assignedTo   String? // Email партнёра, которому передан лид
  sentAt       DateTime? // Когда передан партнёру
  respondedAt  DateTime? // Когда партнёр ответил
  convertedAt  DateTime? // Когда стал клиентом (если известно)

  // Системные
  ipAddress    String?
  userAgent    String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

enum LeadType {
  OPEN_CARWASH      // Открыть автомойку
  BUY_BUSINESS      // Купить готовый бизнес
  SELL_BUSINESS     // Продать бизнес
  BUY_EQUIPMENT     // Купить оборудование
  BUY_FRANCHISE     // Купить франшизу
  BUY_CHEMISTRY     // Купить химию
  CONSULTATION      // Консультация
  AUDIT             // Аудит бизнеса
}

enum LeadStatus {
  NEW
  SENT        // Передан партнёру
  CONTACTED   // Партнёр связался
  CONVERTED   // Конверсия
  LOST        // Не конвертировался
  INVALID     // Невалидный
  DUPLICATE   // Дубль
}
```

---

## 6. Контентные сущности

### Article / Guide

```prisma
model Article {
  id     String @id @default(cuid())
  slug   String @unique

  // Контент
  title       String
  subtitle    String?
  body        String @db.Text // MDX или HTML
  excerpt     String? // Краткое описание, до 300 символов

  // Классификация
  category    ArticleCategory
  subcategory String?
  tags        String[] // Массив тегов

  // SEO
  seoTitle       String?
  seoDescription String?
  canonicalUrl   String?
  ogImageUrl     String?

  // Schema.org
  schemaType   String? // «HowTo» | «Article» | «FAQPage»
  faqJson      Json?   // [{question, answer}]
  howToJson    Json?   // [{name, text}]

  // Метаданные
  author         String?
  readingTimeMin Int?
  wordCount      Int?

  // Связи
  relatedArticleIds String[] // Слаги связанных статей
  relatedToolSlugs  String[]

  // Обновление
  contentVersion Int @default(1)
  updateNote     String? // Что изменилось при обновлении

  // Статус
  status      ContentStatus @default(DRAFT)
  isFeatured  Boolean @default(false)

  // Системные
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  publishedAt DateTime?
}

enum ArticleCategory {
  COMMERCIAL    // Коммерческие гайды
  OPERATIONAL   // Операционные гайды
  LEGAL         // Правовые вопросы
  ANALYTICS     // Аналитика рынка
  NEWS          // Новости
  COMPARISON    // Сравнения
}

enum ContentStatus {
  DRAFT
  REVIEW
  APPROVED
  PUBLISHED
  UPDATE_NEEDED
  ARCHIVED
}
```

### ComparisonPage

```prisma
model ComparisonPage {
  id   String @id @default(cuid())
  slug String @unique

  title    String
  subtitle String?
  body     String @db.Text

  // Сравниваемые объекты
  comparisonType  String // «formats» | «franchises» | «suppliers»
  itemsJson       Json   // [{id, name, pros, cons, score}]
  comparisonTableJson Json // Таблица сравнения

  // SEO
  seoTitle       String?
  seoDescription String?
  faqJson        Json?

  status    ContentStatus @default(DRAFT)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  publishedAt DateTime?
}
```

### FAQ (Часто задаваемый вопрос)

```prisma
model FAQ {
  id       String @id @default(cuid())
  question String
  answer   String @db.Text

  category  String? // Привязка к разделу сайта
  pageSlug  String? // Привязка к конкретной странице
  sortOrder Int @default(0)

  isGlobal Boolean @default(false) // Показывается на главной

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## 7. SEO и технические сущности

### SEOMetadata (Переопределение метаданных)

```prisma
model SEOMetadata {
  id    String @id @default(cuid())
  path  String @unique // URL-path, например «/catalog/moscow/»

  title       String?
  description String?
  canonical   String?
  robots      String? // «noindex,nofollow» | «index,follow»
  ogTitle     String?
  ogDescription String?
  ogImage     String?

  // Schema.org override
  schemaJson  Json?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Redirect

```prisma
model Redirect {
  id     String @id @default(cuid())
  from   String @unique // Исходный путь
  to     String          // Целевой путь
  type   Int @default(301) // 301 | 302 | 308

  reason    String? // Причина редиректа
  isActive  Boolean @default(true)

  createdAt DateTime @default(now())
}
```

### BenchmarkMetric (Рыночные бенчмарки)

```prisma
model BenchmarkMetric {
  id       String @id @default(cuid())

  // Ключ метрики
  metricKey String // «avg_investment_contact», «avg_payback_months»

  // Контекст
  cityId   String?
  typeSlug String? // Тип автомойки

  // Значение
  value      Float
  unit       String? // «руб.», «мес.», «%»
  valueMin   Float?
  valueMax   Float?

  // Источник
  dataSource String? // «market_research» | «portal_data» | «manual»
  period     String  // «2025» | «2025-Q1»

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([metricKey, cityId, typeSlug, period])
}
```

### DownloadableAsset (Загружаемый актив)

```prisma
model DownloadableAsset {
  id   String @id @default(cuid())
  slug String @unique

  title       String
  description String? @db.Text
  fileType    String  // «pdf» | «xlsx» | «docx»
  fileUrl     String
  fileSizeKb  Int?

  // Превью
  previewImageUrl String?

  // Захват лида
  requiresEmail Boolean @default(true)

  // SEO посадочной страницы
  seoTitle       String?
  seoDescription String?

  // Статистика
  downloadCount Int @default(0)

  status    ContentStatus @default(DRAFT)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  publishedAt DateTime?
}
```

---

## 8. Индексы производительности

```prisma
// Критически важные индексы для производительности каталога

@@index([status, publishedAt])           // Листинговые страницы
@@index([cityId, typeId, status])        // Фильтрация каталога
@@index([isFeatured, status])            // Премиум-карточки
@@index([slug])                          // Детальные страницы
@@index([createdAt])                     // Сортировка по дате
@@index([type, status, createdAt])       // Лиды по типу
```
