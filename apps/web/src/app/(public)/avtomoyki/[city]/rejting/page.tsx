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

const MEDALS = ['🥇', '🥈', '🥉']

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = await prisma.city.findUnique({ where: { slug: params.city } }).catch(() => null)
  if (!city) return {}
  return {
    title: `Лучшие автомойки ${city.name} — рейтинг топ-10 по отзывам`,
    description: `Рейтинг лучших автомоек ${city.name} по оценкам клиентов. Топ-10: самообслуживание, ручная мойка, детейлинг. Реальные отзывы, адреса, цены.`,
    alternates: { canonical: `/avtomoyki/${params.city}/rejting` },
  }
}

export default async function CityRatingPage({ params }: Props) {
  const city = await prisma.city.findUnique({ where: { slug: params.city } }).catch(() => null)
  if (!city) notFound()

  const carwashes = await prisma.carWash.findMany({
    where: { cityId: city.id, status: 'active', rating: { gt: 0 }, reviewCount: { gte: 3 } },
    orderBy: [{ rating: 'desc' }, { reviewCount: 'desc' }],
    take: 10,
  })

  if (carwashes.length === 0) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Лучшие автомойки ${city.name} — рейтинг топ-10`,
    numberOfItems: carwashes.length,
    itemListElement: carwashes.map((cw, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'LocalBusiness',
        name: cw.name,
        address: { '@type': 'PostalAddress', streetAddress: cw.address, addressLocality: city.name },
        telephone: cw.phone,
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: cw.rating,
          reviewCount: cw.reviewCount,
          bestRating: 5,
        },
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
      { '@type': 'ListItem', position: 4, name: 'Рейтинг', item: `https://www.businessmoyka.ru/avtomoyki/${params.city}/rejting` },
    ],
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Какая автомойка лучшая в ${city.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `По оценкам клиентов, лучшая автомойка в ${city.name} — ${carwashes[0].name} с рейтингом ${carwashes[0].rating?.toFixed(1)} на основе ${carwashes[0].reviewCount} отзывов.`,
        },
      },
      {
        '@type': 'Question',
        name: `Как составляется рейтинг автомоек?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Рейтинг формируется на основе реальных оценок клиентов (от 1 до 5 звёзд). Учитываются только мойки с минимум 3 отзывами для достоверности.`,
        },
      },
      {
        '@type': 'Question',
        name: `Где найти автомойку с высоким рейтингом рядом со мной?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Воспользуйтесь каталогом на этой странице — все мойки отсортированы по рейтингу. Нажмите на карточку, чтобы увидеть адрес и маршрут.`,
        },
      },
    ],
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
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
        <span className="text-gray-900">Рейтинг</span>
      </nav>

      <h1 className="text-3xl font-bold mb-2">
        Лучшие автомойки {city.name}
      </h1>
      <p className="text-gray-500 mb-10">
        Топ-{carwashes.length} по оценкам клиентов — только мойки с реальными отзывами
      </p>

      <div className="space-y-4 mb-12">
        {carwashes.map((cw, i) => (
          <Link
            key={cw.id}
            href={`/avtomoyki/${params.city}/${cw.slug}`}
            className="flex items-start gap-5 bg-white border border-gray-200 rounded-2xl p-5 hover:border-[#e94560] hover:shadow-md transition-all group"
          >
            {/* Position */}
            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
              {i < 3 ? (
                <span className="text-3xl">{MEDALS[i]}</span>
              ) : (
                <span className="text-xl font-bold text-gray-300">#{i + 1}</span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 mb-1">
                <h2 className="font-semibold text-lg leading-tight group-hover:text-[#e94560] transition-colors">
                  {cw.name}
                </h2>
                <span className="flex-shrink-0 text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {TYPE_LABELS[cw.type] ?? cw.type}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-2">{cw.address}</p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(s => (
                    <span key={s} className={s <= Math.round(cw.rating ?? 0) ? 'text-yellow-400' : 'text-gray-200'}>★</span>
                  ))}
                  <span className="font-bold text-gray-900 ml-1">{cw.rating?.toFixed(1)}</span>
                  <span className="text-gray-400 ml-1">{cw.reviewCount} отзывов</span>
                </div>
                {cw.priceFrom && (
                  <span className="text-gray-500">от <span className="font-semibold text-gray-800">{cw.priceFrom} ₽</span></span>
                )}
                {cw.isOpen24h && (
                  <span className="text-green-600 font-medium">24/7</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* FAQ */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-5">Частые вопросы о рейтинге</h2>
        <div className="space-y-3">
          {[
            { q: `Какая автомойка лучшая в ${city.name}?`, a: `По оценкам клиентов, лучшая автомойка в ${city.name} — ${carwashes[0].name} с рейтингом ${carwashes[0].rating?.toFixed(1)} на основе ${carwashes[0].reviewCount} отзывов.` },
            { q: 'Как составляется рейтинг автомоек?', a: 'Рейтинг формируется на основе реальных оценок клиентов от 1 до 5 звёзд. Учитываются только мойки с минимум 3 отзывами для достоверности.' },
            { q: 'Где найти автомойку с высоким рейтингом рядом?', a: 'Все мойки на странице отсортированы по рейтингу. Нажмите на карточку, чтобы увидеть адрес и детали.' },
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
        <Link href={`/avtomoyki/${params.city}/kruglosutochno`} className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-sm">
          Круглосуточные →
        </Link>
      </div>
    </main>
  )
}
