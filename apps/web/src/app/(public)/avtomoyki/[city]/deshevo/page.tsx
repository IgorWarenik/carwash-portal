import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@carwash/db'

interface Props { params: { city: string } }

export const dynamic = 'force-dynamic'

const TYPE_LABELS: Record<string, string> = {
  self_service: 'Самообслуживание',
  automatic: 'Автоматическая',
  manual: 'Ручная',
  detailing: 'Детейлинг',
  truck: 'Для грузовых',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = await prisma.city.findUnique({ where: { slug: params.city } }).catch(() => null)
  if (!city) return {}
  return {
    title: `Дешёвые автомойки в ${city.name} — недорогая мойка от 80 ₽`,
    description: `Самые дешёвые автомойки ${city.name}: цены от 80 ₽. Мойки самообслуживания и бюджетные ручные — адреса, режим работы, отзывы.`,
    alternates: { canonical: `/avtomoyki/${params.city}/deshevo` },
  }
}

export default async function DeshevoPage({ params }: Props) {
  const city = await prisma.city.findUnique({ where: { slug: params.city } }).catch(() => null)
  if (!city) notFound()

  const [byPrice, selfService] = await Promise.all([
    // Carwashes with explicit price, sorted cheapest first
    prisma.carWash.findMany({
      where: { cityId: city.id, status: 'active', priceFrom: { gt: 0 } },
      orderBy: [{ priceFrom: 'asc' }, { rating: 'desc' }],
      take: 15,
    }),
    // Self-service carwashes without price (typically cheapest type)
    prisma.carWash.findMany({
      where: { cityId: city.id, status: 'active', type: 'self_service', priceFrom: null },
      orderBy: [{ rating: 'desc' }, { reviewCount: 'desc' }],
      take: 6,
    }),
  ])

  // Merge: priced first, then unpriced self-service
  const seen = new Set<string>()
  const carwashes = [...byPrice, ...selfService].filter(cw => {
    if (seen.has(cw.id)) return false
    seen.add(cw.id)
    return true
  }).slice(0, 15)

  if (carwashes.length === 0) notFound()

  const minPrice = byPrice[0]?.priceFrom ?? 80

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Дешёвые автомойки ${city.name}`,
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

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://www.businessmoyka.ru/' },
      { '@type': 'ListItem', position: 2, name: 'Автомойки', item: 'https://www.businessmoyka.ru/avtomoyki' },
      { '@type': 'ListItem', position: 3, name: city.name, item: `https://www.businessmoyka.ru/avtomoyki/${params.city}` },
      { '@type': 'ListItem', position: 4, name: 'Дёшево', item: `https://www.businessmoyka.ru/avtomoyki/${params.city}/deshevo` },
    ],
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Где самая дешёвая автомойка в ${city.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Самые дешёвые автомойки в ${city.name} — мойки самообслуживания, цены от ${minPrice} ₽. Список с адресами на этой странице.`,
        },
      },
      {
        '@type': 'Question',
        name: 'Почему мойки самообслуживания дешевле?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'На мойках самообслуживания нет персонала — вы моете машину сами. Это снижает стоимость до 80–350 ₽ за сеанс. При этом качество мойки зависит только от вас.',
        },
      },
      {
        '@type': 'Question',
        name: `Сколько стоит помыть машину дёшево в ${city.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Минимальная цена мойки в ${city.name} — от ${minPrice} ₽ на мойках самообслуживания. Ручная мойка обойдётся дороже — от 400 ₽.`,
        },
      },
    ],
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-[#e94560]">Главная</Link>
        <span>›</span>
        <Link href="/avtomoyki" className="hover:text-[#e94560]">Автомойки</Link>
        <span>›</span>
        <Link href={`/avtomoyki/${params.city}`} className="hover:text-[#e94560]">{city.name}</Link>
        <span>›</span>
        <span className="text-gray-900">Дёшево</span>
      </nav>

      <div className="flex items-center gap-3 mb-3">
        <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 text-sm font-semibold px-3 py-1.5 rounded-full">
          от {minPrice} ₽
        </span>
      </div>

      <h1 className="text-3xl font-bold mb-2">
        Дешёвые автомойки в {city.name}
      </h1>
      <p className="text-gray-500 mb-8">
        {carwashes.length} моек — отсортированы от дешёвых к дорогим
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {carwashes.map((cw, i) => (
          <Link
            key={cw.id}
            href={`/avtomoyki/${params.city}/${cw.slug}`}
            className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-[#e94560] hover:shadow-md transition-all flex flex-col group"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {TYPE_LABELS[cw.type] ?? cw.type}
              </span>
              {i === 0 && (
                <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full">Дешевле всех</span>
              )}
              {cw.isOpen24h && i !== 0 && (
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">24/7</span>
              )}
            </div>

            <h2 className="font-semibold text-lg mb-1 leading-tight group-hover:text-[#e94560] transition-colors">{cw.name}</h2>
            <p className="text-sm text-gray-500 mb-3">{cw.address}</p>

            <div className="mt-auto space-y-1.5 text-sm">
              {cw.priceFrom ? (
                <p className="text-lg font-bold text-green-700">от {cw.priceFrom} ₽
                  {cw.priceTo && <span className="text-sm font-normal text-gray-400"> — до {cw.priceTo} ₽</span>}
                </p>
              ) : (
                <p className="text-sm text-gray-400">Цена не указана</p>
              )}
              {cw.rating !== null && cw.rating > 0 && (
                <div className="flex items-center gap-1 text-yellow-500">
                  <span>★</span>
                  <span className="font-medium text-gray-900">{cw.rating.toFixed(1)}</span>
                  <span className="text-gray-400">({cw.reviewCount})</span>
                </div>
              )}
              {cw.phone && (
                <p className="text-[#e94560] font-medium">{cw.phone}</p>
              )}
            </div>
            <div className="mt-3 text-sm font-semibold text-[#e94560] group-hover:underline">Подробнее →</div>
          </Link>
        ))}
      </div>

      {/* FAQ */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-5">Частые вопросы</h2>
        <div className="space-y-3">
          {[
            { q: `Где самая дешёвая автомойка в ${city.name}?`, a: `Самые дешёвые автомойки в ${city.name} — мойки самообслуживания, цены от ${minPrice} ₽. Список выше отсортирован от дешёвых к дорогим.` },
            { q: 'Почему мойки самообслуживания дешевле?', a: 'На мойках самообслуживания нет персонала — вы моете машину сами. Это снижает стоимость до 80–350 ₽ за сеанс.' },
            { q: `Сколько стоит помыть машину дёшево в ${city.name}?`, a: `Минимальная цена мойки в ${city.name} — от ${minPrice} ₽ на мойках самообслуживания. Ручная мойка обойдётся от 400 ₽.` },
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
        <Link href={`/avtomoyki/${params.city}`} className="px-6 py-3 bg-[#e94560] text-white rounded-xl font-semibold hover:bg-[#c73652] transition-colors text-sm">
          Все мойки в {city.name}
        </Link>
        <Link href={`/avtomoyki/${params.city}/ceny`} className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-sm">
          Прайс-лист →
        </Link>
        <Link href={`/avtomoyki/${params.city}/rejting`} className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-sm">
          Рейтинг лучших →
        </Link>
      </div>
    </main>
  )
}
