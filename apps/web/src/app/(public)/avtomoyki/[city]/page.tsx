import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@carwash/db'

interface Props {
  params: { city: string }
  searchParams: { type?: string; page?: string }
}

const TYPE_LABELS: Record<string, string> = {
  self_service: 'Самообслуживание',
  automatic: 'Автоматическая',
  manual: 'Ручная',
  detailing: 'Детейлинг',
  truck: 'Для грузовых',
}

const TYPE_FILTERS = [
  { value: '', label: 'Все типы' },
  { value: 'self_service', label: 'Самообслуживание' },
  { value: 'manual', label: 'Ручная' },
  { value: 'automatic', label: 'Автоматическая' },
  { value: 'detailing', label: 'Детейлинг' },
]

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = await prisma.city.findUnique({ where: { slug: params.city } })
  if (!city) return {}
  return {
    title: `Автомойки в ${city.name} — каталог, цены, отзывы`,
    description: `Найдите лучшие автомойки в ${city.name}. Самообслуживание, автоматические, ручные, детейлинг. Цены, адреса, режим работы, отзывы.`,
    alternates: { canonical: `/avtomoyki/${params.city}` },
  }
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      <span className="text-sm font-medium">{rating.toFixed(1)}</span>
    </div>
  )
}

export default async function CityCarwashesPage({ params, searchParams }: Props) {
  const city = await prisma.city.findUnique({ where: { slug: params.city } })
  if (!city) notFound()

  const page = Number(searchParams.page ?? 1)
  const perPage = 12
  const typeFilter = searchParams.type as 'self_service' | 'automatic' | 'manual' | 'detailing' | 'truck' | undefined

  // Noindex for many filter combinations
  const hasFilters = Object.keys(searchParams).length > 1

  const [carwashes, total] = await Promise.all([
    prisma.carWash.findMany({
      where: {
        cityId: city.id,
        status: 'active',
        ...(typeFilter ? { type: typeFilter } : {}),
      },
      orderBy: [{ featured: 'desc' }, { rating: 'desc' }, { reviewCount: 'desc' }],
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.carWash.count({
      where: {
        cityId: city.id,
        status: 'active',
        ...(typeFilter ? { type: typeFilter } : {}),
      },
    }),
  ])

  const totalPages = Math.ceil(total / perPage)

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Автомойки в ${city.name}`,
    numberOfItems: total,
    itemListElement: carwashes.map((cw, i) => ({
      '@type': 'ListItem',
      position: (page - 1) * perPage + i + 1,
      item: {
        '@type': 'LocalBusiness',
        name: cw.name,
        address: { '@type': 'PostalAddress', streetAddress: cw.address, addressLocality: city.name },
        telephone: cw.phone,
        aggregateRating: cw.rating ? {
          '@type': 'AggregateRating',
          ratingValue: cw.rating,
          reviewCount: cw.reviewCount,
        } : undefined,
      },
    })),
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      {hasFilters && <meta name="robots" content="noindex, follow" />}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-[#e94560]">Главная</Link>
        <span>›</span>
        <Link href="/avtomoyki" className="hover:text-[#e94560]">Автомойки</Link>
        <span>›</span>
        <span className="text-gray-900">{city.name}</span>
      </nav>

      <h1 className="text-3xl font-bold mb-2">
        Автомойки в {city.name}
      </h1>
      <p className="text-gray-500 mb-8">
        {total} {total % 10 === 1 && total % 100 !== 11 ? 'мойка' : 'моек'} в каталоге
      </p>

      {/* Type filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {TYPE_FILTERS.map((f) => {
          const isActive = (f.value === '' && !typeFilter) || f.value === typeFilter
          const href = f.value
            ? `/avtomoyki/${params.city}?type=${f.value}`
            : `/avtomoyki/${params.city}`
          return (
            <Link
              key={f.value}
              href={href}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#e94560] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f.label}
            </Link>
          )
        })}
      </div>

      {carwashes.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">Автомоек по выбранному фильтру пока нет</p>
          <Link href={`/avtomoyki/${params.city}`} className="mt-4 inline-block text-[#e94560] font-semibold hover:underline">
            Показать все
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {carwashes.map((cw) => (
            <div key={cw.id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {TYPE_LABELS[cw.type] ?? cw.type}
                </span>
                {cw.featured && (
                  <span className="text-xs font-medium bg-[#e94560]/10 text-[#e94560] px-2 py-1 rounded-full">
                    Топ
                  </span>
                )}
              </div>

              <h2 className="font-semibold text-lg mb-1 leading-tight">{cw.name}</h2>
              <p className="text-sm text-gray-500 mb-3">{cw.address}</p>

              {cw.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">{cw.description}</p>
              )}

              <div className="mt-auto space-y-2">
                {cw.rating !== null && cw.rating > 0 && (
                  <div className="flex items-center justify-between">
                    <StarRating rating={cw.rating} />
                    <span className="text-xs text-gray-400">{cw.reviewCount} отзывов</span>
                  </div>
                )}

                {(cw.priceFrom || cw.priceTo) && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Цена</span>
                    <span className="font-semibold">
                      {cw.priceFrom && `от ${cw.priceFrom} ₽`}
                      {cw.priceFrom && cw.priceTo && ' '}
                      {cw.priceTo && `до ${cw.priceTo} ₽`}
                    </span>
                  </div>
                )}

                {cw.workingHours && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Режим</span>
                    <span className="font-medium text-green-600">{cw.workingHours}</span>
                  </div>
                )}

                {cw.phone && (
                  <a href={`tel:${cw.phone}`} className="block text-sm text-[#e94560] font-medium hover:underline mt-2">
                    {cw.phone}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-12">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/avtomoyki/${params.city}?${typeFilter ? `type=${typeFilter}&` : ''}page=${p}`}
              className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                p === page ? 'bg-[#e94560] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}

      {/* B2B CTA */}
      <div className="mt-16 bg-gray-50 rounded-2xl p-8 text-center">
        <h2 className="text-xl font-bold mb-3">Хотите открыть автомойку в {city.name}?</h2>
        <p className="text-gray-500 mb-6">
          Рынок {city.name} вырос на +40% за 2 года. Рассчитайте окупаемость для вашего формата.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/tools/roi-calculator" className="px-6 py-3 bg-[#e94560] text-white rounded-xl font-semibold hover:bg-[#c73652] transition-colors">
            Калькулятор ROI
          </Link>
          <Link href="/otkryt-avtomoiku" className="px-6 py-3 bg-[#1a1a2e] text-white rounded-xl font-semibold hover:bg-[#0f0f20] transition-colors">
            Гайд по открытию
          </Link>
        </div>
      </div>
    </main>
  )
}
