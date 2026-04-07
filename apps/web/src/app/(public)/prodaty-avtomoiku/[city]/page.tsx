import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@carwash/db'
import { LeadFormSell } from '@/components/LeadFormSell'

interface Props { params: { city: string } }

export const dynamic = 'force-dynamic'

function formatRub(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} млн ₽`
  return `${Math.round(n / 1000)} тыс. ₽`
}

export async function generateStaticParams() {
  try {
    const cities = await prisma.city.findMany({ where: { isActive: true }, select: { slug: true } })
    return cities.map(c => ({ city: c.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const city = await prisma.city.findUnique({ where: { slug: params.city } })
    if (!city) return {}
    const total = await prisma.carWash.count({ where: { cityId: city.id, status: 'active' } })
    return {
      title: `Продать автомойку в ${city.name} — быстро и выгодно`,
      description: `Продайте автомойку в ${city.name} по рыночной цене. В городе ${total} активных объектов — большой рынок покупателей. Бесплатное размещение, верифицированные инвесторы.`,
      alternates: { canonical: `/prodaty-avtomoiku/${params.city}` },
    }
  } catch {
    return {}
  }
}

export default async function SellCityPage({ params }: Props) {
  let city: { id: string; name: string; slug: string; region: string | null } | null = null
  let marketStats: {
    totalActive: number
    avgRating: number | null
    typeBreakdown: Array<{ type: string; _count: { type: number } }>
    avgPriceFrom: number | null
  } = { totalActive: 0, avgRating: null, typeBreakdown: [], avgPriceFrom: null }

  try {
    city = await prisma.city.findUnique({ where: { slug: params.city } })
    if (!city) notFound()

    const [totalActive, typeBreakdown, avgAgg, priceAgg] = await Promise.all([
      prisma.carWash.count({ where: { cityId: city.id, status: 'active' } }),
      prisma.carWash.groupBy({
        by: ['type'],
        where: { cityId: city.id, status: 'active' },
        _count: { type: true },
        orderBy: { _count: { type: 'desc' } },
      }),
      prisma.carWash.aggregate({
        where: { cityId: city.id, status: 'active', rating: { gt: 0 } },
        _avg: { rating: true },
      }),
      prisma.carWash.aggregate({
        where: { cityId: city.id, status: 'active', priceFrom: { gt: 0 } },
        _avg: { priceFrom: true },
      }),
    ])
    marketStats = {
      totalActive,
      avgRating: avgAgg._avg.rating,
      typeBreakdown,
      avgPriceFrom: priceAgg._avg.priceFrom,
    }
  } catch {
    if (!city) notFound()
  }

  const TYPE_LABELS: Record<string, string> = {
    self_service: 'Самообслуживание',
    automatic: 'Автоматическая',
    manual: 'Ручная',
    detailing: 'Детейлинг',
    truck: 'Для грузовых',
  }

  const PRICE_MULTIPLES: Record<string, string> = {
    self_service: '8–18× месячная выручка',
    automatic: '12–24× месячная выручка',
    manual: '10–20× месячная выручка',
    detailing: '12–20× месячная выручка',
    truck: '10–18× месячная выручка',
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Сколько стоит автомойка в ${city!.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: marketStats.avgPriceFrom
            ? `Средняя цена входного билета в ${city!.name} — около ${formatRub(Math.round(marketStats.avgPriceFrom / 500) * 500)} за разовую мойку. Рыночная стоимость готового бизнеса рассчитывается как 10–18 месячных выручек.`
            : `Рыночная стоимость готовой автомойки в ${city!.name} зависит от типа и оборота: самообслуживание от 1,5 млн ₽, ручные мойки от 3 млн ₽, детейлинг от 2 млн ₽.`,
        },
      },
      {
        '@type': 'Question',
        name: 'Как быстро можно продать автомойку?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Средний срок сделки через наш каталог — 2–4 месяца. Для сравнения: на Авито и общих площадках — 8–12 месяцев. Ключевой фактор скорости — правильная цена и подготовленный пакет документов.',
        },
      },
      {
        '@type': 'Question',
        name: 'Как правильно оценить свою автомойку?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Основные метрики: 1) Ежемесячная выручка × 10–18 (мультипликатор зависит от типа мойки); 2) EBITDA × 3–5; 3) Стоимость оборудования с учётом износа; 4) Условия аренды. Наш аналитик проведёт оценку бесплатно.',
        },
      },
      {
        '@type': 'Question',
        name: 'Какие документы нужны для продажи?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Минимальный пакет: Z-отчёты или выписки из кассы за 12 месяцев, договор аренды, документы на оборудование, ИП/ООО реквизиты. Помогаем подготовить полный пакет для инвесторов.',
        },
      },
    ],
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://www.businessmoyka.ru/' },
      { '@type': 'ListItem', position: 2, name: 'Продать автомойку', item: 'https://www.businessmoyka.ru/prodaty-avtomoiku' },
      { '@type': 'ListItem', position: 3, name: city!.name, item: `https://www.businessmoyka.ru/prodaty-avtomoiku/${params.city}` },
    ],
  }

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <nav className="text-sm text-gray-400 mb-5 flex items-center gap-2 flex-wrap">
            <Link href="/" className="hover:text-white">Главная</Link>
            <span>›</span>
            <Link href="/prodaty-avtomoiku" className="hover:text-white">Продать автомойку</Link>
            <span>›</span>
            <span>{city!.name}</span>
          </nav>
          <h1 className="text-4xl font-bold mb-4">Продайте автомойку в {city!.name}</h1>
          <p className="text-xl text-gray-300 mb-6 max-w-2xl">
            Целевая аудитория покупателей, оценка бизнеса и сопровождение сделки.
            Размещение объявления — бесплатно.
          </p>
          <div className="flex flex-wrap gap-8 text-sm">
            {marketStats.totalActive > 0 && (
              <div>
                <div className="text-gray-400">Активных объектов в городе</div>
                <div className="font-bold text-2xl">{marketStats.totalActive}</div>
              </div>
            )}
            <div>
              <div className="text-gray-400">Средний срок сделки</div>
              <div className="font-bold text-2xl">3 мес</div>
            </div>
            <div>
              <div className="text-gray-400">Сделок закрыто</div>
              <div className="font-bold text-2xl">84+</div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-14">

        {/* Market snapshot */}
        {marketStats.totalActive > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">Рынок автомоек в {city!.name}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 rounded-2xl p-4 text-center">
                <div className="text-3xl font-bold text-[#e94560]">{marketStats.totalActive}</div>
                <div className="text-sm text-gray-500 mt-1">объектов в каталоге</div>
              </div>
              {marketStats.avgRating && (
                <div className="bg-gray-50 rounded-2xl p-4 text-center">
                  <div className="text-3xl font-bold text-[#e94560]">{marketStats.avgRating.toFixed(1)}</div>
                  <div className="text-sm text-gray-500 mt-1">средний рейтинг</div>
                </div>
              )}
              {marketStats.typeBreakdown.slice(0, 2).map(t => (
                <div key={t.type} className="bg-gray-50 rounded-2xl p-4 text-center">
                  <div className="text-3xl font-bold text-[#e94560]">{t._count.type}</div>
                  <div className="text-sm text-gray-500 mt-1">{TYPE_LABELS[t.type] ?? t.type}</div>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500">
              Высокий спрос на готовый бизнес формируется за счёт крупного рынка действующих объектов.
              Инвесторы ищут прибыльные мойки с документами — особенно формат самообслуживания и ручные.
            </p>
          </section>
        )}

        {/* Valuation table */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Сколько стоит ваша мойка</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 rounded-tl-xl">Тип мойки</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Мультипликатор</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 rounded-tr-xl">Стоимость готового бизнеса</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { type: 'self_service', range: 'от 1,5 млн ₽' },
                  { type: 'manual', range: 'от 3 млн ₽' },
                  { type: 'automatic', range: 'от 5 млн ₽' },
                  { type: 'detailing', range: 'от 2 млн ₽' },
                  { type: 'truck', range: 'от 4 млн ₽' },
                ].map(row => (
                  <tr key={row.type} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium">{TYPE_LABELS[row.type]}</td>
                    <td className="px-4 py-3 text-gray-600">{PRICE_MULTIPLES[row.type]}</td>
                    <td className="px-4 py-3 font-semibold text-[#e94560]">{row.range}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Process */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Как проходит продажа</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { n: '1', t: 'Оставьте заявку', d: 'Заполните форму ниже — укажите тип, выручку и желаемую цену.' },
              { n: '2', t: 'Оценка бизнеса', d: 'Аналитик свяжется в течение 24 ч и поможет определить рыночную цену.' },
              { n: '3', t: 'Подготовка объявления', d: 'Составим описание, соберём финансовые данные и фото.' },
              { n: '4', t: 'Публикация', d: 'Объявление выходит в каталог для инвесторов и рассылку.' },
              { n: '5', t: 'Показы покупателям', d: 'Проводим показы только с верифицированными покупателями.' },
              { n: '6', t: 'Сделка', d: 'Помогаем завершить: документы, юрист, переоформление.' },
            ].map(step => (
              <div key={step.n} className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[#e94560] text-white rounded-full flex items-center justify-center font-bold text-sm">{step.n}</div>
                <div>
                  <h3 className="font-semibold mb-1">{step.t}</h3>
                  <p className="text-sm text-gray-600">{step.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sell form */}
        <section id="seller-form" className="bg-[#1a1a2e] text-white rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-2">Оставить заявку на продажу в {city!.name}</h2>
          <p className="text-gray-400 mb-8">Менеджер свяжется в течение 2 часов в рабочее время.</p>
          <div className="max-w-2xl">
            <LeadFormSell />
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Вопросы о продаже автомойки в {city!.name}</h2>
          <div className="space-y-4">
            {faqJsonLd.mainEntity.map((q, i) => (
              <details key={i} className="bg-gray-50 rounded-2xl p-5 group">
                <summary className="font-semibold cursor-pointer list-none flex justify-between items-center gap-3">
                  {q.name}
                  <svg className="w-5 h-5 flex-shrink-0 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-3 text-gray-600 text-sm leading-relaxed">{q.acceptedAnswer.text}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Cross-links */}
        <section>
          <h2 className="text-xl font-bold mb-4">Полезные ссылки</h2>
          <div className="flex flex-wrap gap-3">
            <Link href={`/kupit-avtomoiku/${params.city}`} className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors">
              Купить мойку в {city!.name}
            </Link>
            <Link href={`/avtomoyki/${params.city}`} className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors">
              Каталог моек {city!.name}
            </Link>
            <Link href={`/avtomoyki/${params.city}/rejting`} className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors">
              Рейтинг моек {city!.name}
            </Link>
            <Link href="/tools/ocenka-biznesa" className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors">
              Калькулятор оценки бизнеса
            </Link>
            <Link href="/blog/kak-prodat-avtomoiku-po-rynochnoj-cene" className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors">
              Как продать по рыночной цене →
            </Link>
          </div>
        </section>

      </div>
    </main>
  )
}
