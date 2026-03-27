# ANALYTICS_PLAN.md — Портал Автомоек

## Цели аналитики

1. Отслеживать конверсии лидов (заявки, звонки, подписки)
2. Измерять вовлечённость с контентом и инструментами
3. Оптимизировать воронку через CRO
4. Оценивать SEO-трафик и его качество

## Инструменты

- **Yandex.Metrika** — основной инструмент (РФ аудитория)
- **Server-side events** — надёжный трекинг без блокировщиков рекламы
- **Prisma / PostgreSQL** — хранение attribution данных в Lead модели

## Event Taxonomy

### Просмотры
| Event | Параметры |
|-------|-----------|
| `page_view` | page_type, city, category, slug, device, referrer |
| `search_performed` | query, city, filters_used, results_count |

### Вовлечённость
| Event | Параметры |
|-------|-----------|
| `directory_filter_use` | filter_name, filter_value, city |
| `compare_page_engagement` | compare_type, time_on_page |
| `download_asset` | asset_type, city, page_url |
| `map_view_opened` | city, carwash_slug |

### Калькуляторы (ключевые)
| Event | Параметры |
|-------|-----------|
| `calculator_start` | calculator_type |
| `calculator_step_complete` | calculator_type, step_number |
| `calculator_complete` | calculator_type, result_summary |
| `calculator_cta_click` | calculator_type, cta_type |

### Лиды (конверсии)
| Event | Параметры |
|-------|-----------|
| `lead_form_start` | lead_type, page_url, city |
| `lead_form_submit` | lead_type, city, has_phone, has_email |
| `click_phone` | carwash_slug, city, source_page |
| `click_supplier_contact` | supplier_slug, contact_type |
| `click_premium_profile` | entity_type, entity_slug |

### Подписки
| Event | Параметры |
|-------|-----------|
| `newsletter_signup` | source_page |
| `telegram_signup` | source_page |

## Attribution поля в Lead модели

```prisma
model Lead {
  utm_source    String?
  utm_medium    String?
  utm_campaign  String?
  utm_content   String?
  landing_page  String?
  page_type     String?
  lead_type     LeadType
  city          String?
  category      String?
  device        String?
  referrer      String?
}
```

## CRO Стратегия

- Калькулятор всегда заканчивается CTA блоком
- Каждая карточка автомойки: кнопка "Записаться" или "Позвонить"
- Страницы "открыть/купить/продать": лид-форма в первом экране
- Exit intent popup с CTA на гайдах (только desktop)
- A/B тест: заголовок лид-формы (минимум 2 варианта)

## Воронки в Метрике

1. **Воронка заявки на покупку**: page_view → lead_form_start → lead_form_submit
2. **Воронка калькулятора**: calculator_start → calculator_complete → calculator_cta_click → lead_form_submit
3. **Воронка звонка**: page_view (карточка) → click_phone

## Реализация

```typescript
// apps/web/lib/analytics/index.ts
export function trackEvent(name: string, params: Record<string, unknown>) {
  // Client-side: Yandex.Metrika
  if (typeof window !== 'undefined' && window.ym) {
    window.ym(METRIKA_ID, 'reachGoal', name, params)
  }
}

export function trackLead(lead: LeadData) {
  trackEvent('lead_form_submit', {
    lead_type: lead.type,
    city: lead.city,
    has_phone: !!lead.phone,
    has_email: !!lead.email,
  })
}
```
