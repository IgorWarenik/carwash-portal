import type { Metadata } from 'next'
import Link from 'next/link'
import { OwnerLeadForm } from './OwnerLeadForm'

export const metadata: Metadata = {
  title: 'Для владельцев автомоек — разместите мойку на портале',
  description:
    'Привлекайте новых клиентов через Портал Автомоек. Бесплатное базовое размещение или Pro-тариф с приоритетом и лидами. Верифицированные карточки получают больше доверия.',
  alternates: { canonical: '/dlya-vladeltcev' },
}

const PLANS = [
  {
    name: 'Базовый',
    price: 'Бесплатно',
    period: 'навсегда',
    color: 'border-gray-200',
    features: [
      'Карточка в каталоге по городу',
      'Адрес, телефон, режим работы',
      'До 5 услуг',
      'Подтверждение через email (claim-flow)',
      'Отображение в поиске',
    ],
    cta: 'Добавить мойку',
    ctaHref: '/avtomoyki',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '2 990 ₽',
    period: 'в месяц',
    color: 'border-[#e94560]',
    features: [
      'Всё из Базового',
      'Приоритет в выдаче каталога',
      'Бейдж «Топ» на карточке',
      'До 20 фотографий',
      'Лиды из формы портала напрямую',
      'Статистика просмотров еженедельно',
      'Поддержка менеджера',
    ],
    cta: 'Подключить Pro',
    ctaHref: '#owner-form',
    highlight: true,
  },
  {
    name: 'Premium',
    price: '7 900 ₽',
    period: 'в месяц',
    color: 'border-[#1a1a2e]',
    features: [
      'Всё из Pro',
      'Позиция #1 в городе по типу мойки',
      'Баннер на главной каталога города',
      'Интеграция с Google / Яндекс отзывами',
      'Персональный менеджер',
      'Ежемесячный отчёт по ROI',
    ],
    cta: 'Обсудить Premium',
    ctaHref: '#owner-form',
    highlight: false,
  },
]

const BENEFITS = [
  { icon: '👥', title: 'Целевой трафик', text: 'Только люди, которые прямо сейчас ищут автомойку в вашем городе' },
  { icon: '📊', title: 'Прозрачная статистика', text: 'Видите сколько раз просмотрели карточку, кликнули по телефону, перешли на сайт' },
  { icon: '✅', title: 'Верификация доверия', text: 'Бейдж «Верифицировано владельцем» повышает конверсию карточки на 35%' },
  { icon: '🔗', title: 'SEO-ссылка', text: 'Ссылка с портала передаёт вес вашему сайту и улучшает позиции в Яндексе' },
]

const FAQ = [
  { q: 'Как добавить мойку бесплатно?', a: 'Найдите вашу мойку в каталоге и нажмите «Владелец этой мойки?» — введите email и получите ссылку для подтверждения. Если мойки нет, заполните форму ниже.' },
  { q: 'Когда видна отдача от Pro-тарифа?', a: 'Первые дополнительные просмотры — в течение 48 часов после подключения. Полный эффект — через 2–3 недели (индексация Яндексом обновлённой карточки).' },
  { q: 'Можно ли отменить подписку?', a: 'Да, в любой момент. Карточка переходит на бесплатный тариф, оставаясь в каталоге.' },
  { q: 'Как формируется позиция в поиске?', a: 'Pro-карточки всегда показываются выше базовых. Внутри одного тарифа — по рейтингу и количеству отзывов.' },
]

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}

export default function ForOwnersPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <nav className="text-sm text-gray-500 mb-8 flex items-center gap-2">
        <Link href="/" className="hover:text-[#e94560]">Главная</Link>
        <span>›</span>
        <span className="text-gray-900">Для владельцев</span>
      </nav>

      {/* Hero */}
      <div className="text-center mb-14">
        <span className="inline-block text-xs font-semibold bg-[#e94560]/10 text-[#e94560] px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
          Для владельцев автомоек
        </span>
        <h1 className="text-4xl font-bold mb-4 leading-tight">
          Привлекайте клиентов через<br className="hidden sm:block" /> Портал Автомоек
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Более 50 000 человек в месяц ищут автомойку на нашем портале.
          Разместите карточку — бесплатно или с Pro-приоритетом.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <a href="#owner-form" className="px-8 py-3 bg-[#e94560] text-white rounded-xl font-semibold hover:bg-[#c73652] transition-colors">
            Подключить Pro →
          </a>
          <Link href="/avtomoyki" className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
            Найти мою мойку
          </Link>
        </div>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
        {BENEFITS.map(b => (
          <div key={b.title} className="bg-gray-50 rounded-2xl p-5">
            <div className="text-3xl mb-3">{b.icon}</div>
            <h3 className="font-semibold mb-2">{b.title}</h3>
            <p className="text-sm text-gray-600">{b.text}</p>
          </div>
        ))}
      </div>

      {/* Pricing */}
      <h2 className="text-2xl font-bold mb-8 text-center">Выберите тариф</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {PLANS.map(plan => (
          <div
            key={plan.name}
            className={`relative border-2 ${plan.color} rounded-2xl p-6 flex flex-col ${plan.highlight ? 'shadow-lg' : ''}`}
          >
            {plan.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#e94560] text-white text-xs font-bold px-4 py-1 rounded-full">
                ПОПУЛЯРНЫЙ
              </div>
            )}
            <div className="mb-6">
              <h3 className="font-bold text-xl mb-1">{plan.name}</h3>
              <div className="text-3xl font-bold text-[#e94560]">{plan.price}</div>
              <div className="text-sm text-gray-400">{plan.period}</div>
            </div>
            <ul className="space-y-2.5 flex-1 mb-6">
              {plan.features.map(f => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <a
              href={plan.ctaHref}
              className={`block text-center py-3 rounded-xl font-semibold transition-colors ${
                plan.highlight
                  ? 'bg-[#e94560] text-white hover:bg-[#c73652]'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {plan.cta}
            </a>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Частые вопросы</h2>
        <div className="space-y-3">
          {FAQ.map(({ q, a }) => (
            <details key={q} className="group bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <summary className="flex justify-between items-center px-6 py-4 cursor-pointer font-semibold text-gray-900 hover:text-[#e94560] transition-colors list-none">
                {q}
                <span className="ml-4 flex-shrink-0 text-gray-400 group-open:rotate-180 transition-transform text-xl leading-none">›</span>
              </summary>
              <p className="px-6 pb-4 text-gray-600 text-sm leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Lead form */}
      <section id="owner-form" className="bg-[#1a1a2e] text-white rounded-2xl p-8">
        <div className="max-w-xl">
          <h2 className="text-2xl font-bold mb-3">Подключить Pro или добавить мойку</h2>
          <p className="text-gray-300 mb-8">
            Оставьте заявку — менеджер свяжется в течение 2 часов, поможет создать или верифицировать карточку.
          </p>
          <OwnerLeadForm />
        </div>
      </section>
    </main>
  )
}
