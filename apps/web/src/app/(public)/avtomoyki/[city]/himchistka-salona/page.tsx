import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@carwash/db'

interface Props { params: { city: string } }

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = await prisma.city.findUnique({ where: { slug: params.city } }).catch(() => null)
  if (!city) return {}
  return {
    title: `Химчистка салона автомобиля в ${city.name} — цены, адреса, отзывы`,
    description: `Химчистка автомобиля в ${city.name}: детейлинг-центры с профессиональной чисткой салона, полировкой, нанесением керамики. Цены, адреса, рейтинг.`,
    alternates: { canonical: `/avtomoyki/${params.city}/himchistka-salona` },
  }
}

const TYPE_LABELS: Record<string, string> = {
  self_service: 'Самообслуживание',
  automatic: 'Автоматическая',
  manual: 'Ручная',
  detailing: 'Детейлинг',
  truck: 'Для грузовых',
}

export default async function HimchistkaPage({ params }: Props) {
  const city = await prisma.city.findUnique({ where: { slug: params.city } }).catch(() => null)
  if (!city) notFound()

  // Detailing centres first, then manual carwashes (often offer interior cleaning too)
  const [detailing, manual] = await Promise.all([
    prisma.carWash.findMany({
      where: { cityId: city.id, status: 'active', type: 'detailing' },
      orderBy: [{ featured: 'desc' }, { rating: 'desc' }, { reviewCount: 'desc' }],
    }),
    prisma.carWash.findMany({
      where: { cityId: city.id, status: 'active', type: 'manual' },
      orderBy: [{ featured: 'desc' }, { rating: 'desc' }],
      take: 6,
    }),
  ])

  const carwashes = [...detailing, ...manual]
  if (carwashes.length === 0) notFound()

  const detailingBenchmark = await prisma.benchmark.findFirst({
    where: { metric: 'avg_check', carwashType: 'detailing', OR: [{ city: params.city }, { city: null }] },
    orderBy: { city: 'desc' },
  }).catch(() => null)

  const avgCheck = detailingBenchmark ? Math.round(detailingBenchmark.value) : 3000

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная',   item: 'https://www.businessmoyka.ru/' },
      { '@type': 'ListItem', position: 2, name: 'Автомойки', item: 'https://www.businessmoyka.ru/avtomoyki' },
      { '@type': 'ListItem', position: 3, name: city.name,   item: `https://www.businessmoyka.ru/avtomoyki/${params.city}` },
      { '@type': 'ListItem', position: 4, name: 'Химчистка салона', item: `https://www.businessmoyka.ru/avtomoyki/${params.city}/himchistka-salona` },
    ],
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Сколько стоит химчистка салона в ${city.name}?`,
        acceptedAnswer: { '@type': 'Answer', text: `Средняя стоимость химчистки салона в ${city.name} — от ${avgCheck} ₽. Цена зависит от класса автомобиля и объёма работ: частичная химчистка — от 2 000 ₽, полная — от 5 000 ₽, комплексный детейлинг — от 15 000 ₽.` },
      },
      {
        '@type': 'Question',
        name: 'Чем химчистка отличается от обычной мойки?',
        acceptedAnswer: { '@type': 'Answer', text: 'Химчистка — глубокая очистка обивки сидений, потолка и ковриков профессиональной химией с экстракторной машиной. Обычная мойка салона — поверхностная протирка. После химчистки пятна, запахи и загрязнения удаляются полностью.' },
      },
      {
        '@type': 'Question',
        name: `Как долго сохнет салон после химчистки?`,
        acceptedAnswer: { '@type': 'Answer', text: 'Салон сохнет 4–12 часов в зависимости от температуры и влажности. Профессиональные центры используют промышленные осушители, сокращая время до 2–4 часов.' },
      },
      {
        '@type': 'Question',
        name: 'Что входит в комплексный детейлинг?',
        acceptedAnswer: { '@type': 'Answer', text: 'Комплексный детейлинг включает: химчистку салона, полировку кузова, нанесение защитного покрытия (воск, керамика или PPF), химчистку двигателя. Стоимость — от 15 000 ₽.' },
      },
    ],
  }

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Химчистка салона автомобиля в ${city.name}`,
    numberOfItems: carwashes.length,
    itemListElement: carwashes.map((cw, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'LocalBusiness',
        name: cw.name,
        address: { '@type': 'PostalAddress', streetAddress: cw.address, addressLocality: city.name },
        telephone: cw.phone,
        priceRange: cw.priceFrom ? `от ${cw.priceFrom} ₽` : undefined,
        ...(cw.rating && cw.rating > 0 ? {
          aggregateRating: { '@type': 'AggregateRating', ratingValue: cw.rating, reviewCount: cw.reviewCount },
        } : {}),
      },
    })),
  }

  const SERVICES = [
    { name: 'Химчистка сидений', price: 'от 2 000 ₽' },
    { name: 'Химчистка потолка', price: 'от 1 500 ₽' },
    { name: 'Химчистка ковриков', price: 'от 800 ₽' },
    { name: 'Полировка кузова', price: 'от 5 000 ₽' },
    { name: 'Нанесение керамики', price: 'от 15 000 ₽' },
    { name: 'Комплексный детейлинг', price: 'от 15 000 ₽' },
  ]

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-[#e94560]">Главная</Link>
        <span>›</span>
        <Link href="/avtomoyki" className="hover:text-[#e94560]">Автомойки</Link>
        <span>›</span>
        <Link href={`/avtomoyki/${params.city}`} className="hover:text-[#e94560]">{city.name}</Link>
        <span>›</span>
        <span className="text-gray-900">Химчистка салона</span>
      </nav>

      <h1 className="text-3xl font-bold mb-2">
        Химчистка салона автомобиля в {city.name}
      </h1>
      <p className="text-gray-500 mb-8">
        {carwashes.length} детейлинг-центров и студий — профессиональная чистка, полировка, керамика
      </p>

      {/* Price guide strip */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4 mb-8">
        <p className="text-xs text-blue-500 font-semibold uppercase tracking-wide mb-3">Ориентировочные цены в {city.name}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SERVICES.map(s => (
            <div key={s.name} className="text-sm">
              <span className="text-gray-500">{s.name}:</span>{' '}
              <span className="font-semibold text-gray-900">{s.price}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Carwash grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {carwashes.map((cw, i) => (
          <Link
            key={cw.id}
            href={`/avtomoyki/${params.city}/${cw.slug}`}
            className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-[#e94560] hover:shadow-md transition-all flex flex-col group"
          >
            <div className="flex items-start justify-between mb-3">
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                cw.type === 'detailing'
                  ? 'bg-purple-50 text-purple-700'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {TYPE_LABELS[cw.type] ?? cw.type}
              </span>
              {i === 0 && detailing.length > 0 && (
                <span className="text-xs font-semibold bg-[#e94560]/10 text-[#e94560] px-2 py-1 rounded-full">Топ</span>
              )}
            </div>
            <h2 className="font-semibold text-lg mb-1 leading-tight group-hover:text-[#e94560] transition-colors">{cw.name}</h2>
            <p className="text-sm text-gray-500 mb-3">{cw.address}</p>
            <div className="mt-auto space-y-1.5 text-sm">
              {cw.rating !== null && cw.rating > 0 && (
                <div className="flex items-center gap-1 text-yellow-500">
                  <span>★</span>
                  <span className="font-medium text-gray-900">{cw.rating.toFixed(1)}</span>
                  <span className="text-gray-400">({cw.reviewCount})</span>
                </div>
              )}
              {cw.priceFrom && (
                <p className="text-gray-600">от <span className="font-semibold">{cw.priceFrom} ₽</span></p>
              )}
              {cw.phone && <p className="text-[#e94560] font-medium">{cw.phone}</p>}
            </div>
            <div className="mt-3 text-sm font-semibold text-[#e94560] group-hover:underline">Подробнее →</div>
          </Link>
        ))}
      </div>

      {/* FAQ */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-5">Частые вопросы о химчистке</h2>
        <div className="space-y-3">
          {[
            { q: `Сколько стоит химчистка салона в ${city.name}?`, a: `Средняя стоимость в ${city.name} — от ${avgCheck} ₽. Частичная химчистка — от 2 000 ₽, полная — от 5 000 ₽, комплексный детейлинг — от 15 000 ₽.` },
            { q: 'Чем химчистка отличается от обычной мойки?', a: 'Химчистка — глубокая очистка обивки профессиональной химией с экстрактором. После неё полностью уходят пятна, запахи, аллергены. Обычная мойка салона — поверхностная протирка.' },
            { q: 'Как долго сохнет салон после химчистки?', a: 'Обычно 4–12 часов. В профессиональных центрах с промышленными осушителями — 2–4 часа.' },
            { q: 'Что входит в комплексный детейлинг?', a: 'Химчистка салона, полировка кузова, нанесение защитного покрытия (воск/керамика), химчистка двигателя. От 15 000 ₽.' },
          ].map(item => (
            <details key={item.q} className="group bg-white border border-gray-200 rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-medium text-gray-900 hover:text-[#e94560] transition-colors list-none">
                {item.q}
                <span className="ml-4 text-[#e94560] text-lg group-open:rotate-45 transition-transform inline-block">+</span>
              </summary>
              <p className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-4">
        <Link href={`/avtomoyki/${params.city}/deteyling`} className="px-6 py-3 bg-[#e94560] text-white rounded-xl font-semibold hover:bg-[#c73652] transition-colors text-sm">
          Все детейлинги →
        </Link>
        <Link href={`/avtomoyki/${params.city}`} className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-sm">
          Все мойки в {city.name}
        </Link>
        <Link href={`/avtomoyki/${params.city}/ceny`} className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-sm">
          Цены →
        </Link>
      </div>
    </main>
  )
}
