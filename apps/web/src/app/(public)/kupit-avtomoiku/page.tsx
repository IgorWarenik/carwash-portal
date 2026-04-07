import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@carwash/db'
import { LeadFormBuy } from '@/components/LeadFormBuy'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Купить автомойку — объявления о продаже готового бизнеса',
  description:
    'Покупка автомойки как готового бизнеса: верифицированные объявления с финансовыми показателями. ' +
    'Самообслуживание, ручные мойки, детейлинг. Помощь в сделке.',
  alternates: { canonical: '/kupit-avtomoiku' },
}

const FAQ = [
  { q: 'Сколько стоит купить готовую автомойку?', a: 'Цены варьируются от 800 тыс. ₽ за небольшую ручную мойку до 15–30 млн ₽ за автоматическую или крупный комплекс самообслуживания. Средняя стоимость мойки самообслуживания на 4–6 постов — 3–8 млн ₽.' },
  { q: 'Как проверить мойку перед покупкой?', a: 'Запросите выручку за последние 12 месяцев (Z-отчёты с терминала), договор аренды, документы на оборудование и коммуникации. Наши объявления содержат верифицированные финансовые показатели.' },
  { q: 'Какие документы нужны для сделки?', a: 'Договор купли-продажи бизнеса или оборудования, акт приёма-передачи, выписка из ЕГРЮЛ/ЕГРИП продавца, договор аренды с согласием арендодателя на переуступку.' },
  { q: 'Сколько времени занимает сделка?', a: 'В среднем 2–4 недели: 3–5 дней на проверку документов, 1–2 недели на переговоры и оформление, 3–5 дней на передачу бизнеса.' },
  { q: 'Можно ли взять кредит на покупку?', a: 'Да. Сбербанк, ВТБ и Альфа-Банк кредитуют покупку готового бизнеса по программам для малого бизнеса под 12–18% годовых при наличии залога или поручителя.' },
  { q: 'Окупится ли вложение?', a: 'Мойки самообслуживания при правильной локации окупаются за 1,5–3 года. Используйте наш калькулятор ROI для расчёта конкретного объекта.' },
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

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Купить автомойку — готовый бизнес',
  description: 'Объявления о продаже автомоечного бизнеса в России с верифицированными данными',
}

function formatRub(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} млн ₽`
  return `${Math.round(n / 1000)} тыс. ₽`
}

const TYPE_LABELS: Record<string, string> = {
  self_service: 'Самообслуживание',
  automatic: 'Автоматическая',
  manual: 'Ручная',
  detailing: 'Детейлинг',
  truck: 'Для грузовых',
}

export default async function BuyCarwashPage() {
  const listings = await prisma.businessListing.findMany({
    where: { status: 'active', listingType: 'SELL' },
    include: { city: { select: { name: true } } },
    orderBy: [{ price: 'asc' }],
    take: 20,
  })

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-[#e94560]">Главная</Link>
        <span>›</span>
        <span className="text-gray-900">Купить автомойку</span>
      </nav>

      <h1 className="text-3xl font-bold mb-3">Купить автомойку — готовый бизнес</h1>
      <p className="text-gray-500 text-lg mb-6 max-w-2xl">
        Верифицированные объявления о продаже автомоечного бизнеса в России.
        Реальные финансовые показатели, помощь в проверке сделки.
      </p>

      {/* City links */}
      <div className="flex flex-wrap gap-2 mb-10">
        {[
          { slug: 'moskva', name: 'Москва' },
          { slug: 'sankt-peterburg', name: 'Санкт-Петербург' },
          { slug: 'ekaterinburg', name: 'Екатеринбург' },
          { slug: 'krasnodar', name: 'Краснодар' },
          { slug: 'kazan', name: 'Казань' },
          { slug: 'novosibirsk', name: 'Новосибирск' },
          { slug: 'ufa', name: 'Уфа' },
          { slug: 'tyumen', name: 'Тюмень' },
        ].map(c => (
          <Link key={c.slug} href={`/kupit-avtomoiku/${c.slug}`}
            className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-[#e94560] hover:text-white transition-colors">
            {c.name}
          </Link>
        ))}
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔜</div>
          <h2 className="text-2xl font-bold mb-3">Объявления скоро появятся</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Мы верифицируем каждое объявление перед публикацией. Первые листинги появятся в ближайшее время.
          </p>

          {/* Lead capture while no listings */}
          <div className="max-w-lg mx-auto bg-blue-50 border border-blue-100 rounded-2xl p-8 text-left">
            <h3 className="font-bold text-lg mb-2">Хотите купить автомойку?</h3>
            <p className="text-gray-600 text-sm mb-6">
              Оставьте заявку — подберём варианты из закрытых предложений и объявлений до публикации.
            </p>
            <Link
              href="#lead-form"
              className="block text-center px-6 py-3 bg-[#e94560] text-white rounded-xl font-semibold hover:bg-[#c73652] transition-colors"
            >
              Оставить заявку на покупку
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {listings.map((listing) => (
              <div key={listing.id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {TYPE_LABELS[listing.carwashType] ?? listing.carwashType}
                  </span>
                  {listing.verifiedAt && (
                    <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      ✓ Верифицировано
                    </span>
                  )}
                </div>

                <h2 className="font-semibold text-lg mb-1">{listing.title}</h2>
                <p className="text-sm text-gray-500 mb-3">{listing.city.name}</p>

                {listing.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">{listing.description}</p>
                )}

                <div className="mt-auto space-y-2 text-sm">
                  {listing.price && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Цена</span>
                      <span className="font-bold text-lg text-[#e94560]">{formatRub(listing.price)}</span>
                    </div>
                  )}
                  {listing.profit && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Прибыль/мес</span>
                      <span className="font-semibold text-green-700">{formatRub(listing.profit)}</span>
                    </div>
                  )}
                  {listing.revenue && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Выручка/мес</span>
                      <span className="font-semibold">{formatRub(listing.revenue)}</span>
                    </div>
                  )}
                  {listing.price && listing.profit && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Окупаемость</span>
                      <span className="font-semibold">{Math.round(listing.price / listing.profit)} мес.</span>
                    </div>
                  )}
                </div>

                <a href="#lead-form" className="mt-4 block w-full py-2.5 bg-[#e94560] text-white rounded-xl text-sm font-semibold hover:bg-[#c73652] transition-colors text-center">
                  Узнать подробности
                </a>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Why buy here */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Почему покупать через Портал Автомоек?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              icon: '✅',
              title: 'Верифицированные данные',
              text: 'Проверяем реальную выручку и прибыль. Не как на Авито — без самодекларации.',
            },
            {
              icon: '🧮',
              title: 'Финансовая прозрачность',
              text: 'Каждое объявление содержит P&L: выручка, расходы, чистая прибыль, оборудование.',
            },
            {
              icon: '🤝',
              title: 'Помощь в сделке',
              text: 'Юридическое сопровождение, проверка документов, помощь с переоформлением.',
            },
          ].map((item) => (
            <div key={item.title} className="bg-gray-50 rounded-2xl p-5">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Lead form */}
      <section id="lead-form" className="bg-[#1a1a2e] text-white rounded-2xl p-8">
        <div className="max-w-xl">
          <h2 className="text-2xl font-bold mb-3">Найдём автомойку под ваш бюджет</h2>
          <p className="text-gray-300 mb-8">
            Оставьте заявку — наш менеджер свяжется в течение 2 часов и расскажет о доступных объектах в вашем регионе.
          </p>
          <LeadFormBuy />
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Частые вопросы о покупке автомойки</h2>
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

      {/* Related */}
      <section className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link href="/otkryt-avtomoiku" className="bg-gray-50 rounded-2xl p-5 hover:bg-gray-100 transition-colors">
          <div className="text-2xl mb-2">🚀</div>
          <div className="font-semibold mb-1">Открыть с нуля</div>
          <div className="text-sm text-gray-500">Гайд по самостоятельному запуску</div>
        </Link>
        <Link href="/franshizy" className="bg-gray-50 rounded-2xl p-5 hover:bg-gray-100 transition-colors">
          <div className="text-2xl mb-2">🤝</div>
          <div className="font-semibold mb-1">Купить франшизу</div>
          <div className="text-sm text-gray-500">6 проверенных франшиз с ROI</div>
        </Link>
        <Link href="/tools/roi-calculator" className="bg-gray-50 rounded-2xl p-5 hover:bg-gray-100 transition-colors">
          <div className="text-2xl mb-2">🧮</div>
          <div className="font-semibold mb-1">Калькулятор ROI</div>
          <div className="text-sm text-gray-500">Считайте окупаемость перед покупкой</div>
        </Link>
      </section>
    </main>
  )
}
