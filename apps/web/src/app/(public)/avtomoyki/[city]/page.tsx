import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@carwash/db'
import { CitySearchInput } from '@/components/CitySearchInput'

interface Props {
  params: { city: string }
  searchParams: { type?: string; page?: string; q?: string }
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

export const revalidate = 3600

export async function generateStaticParams() {
  try {
    const cities = await prisma.city.findMany({ where: { isActive: true }, select: { slug: true } })
    return cities.map((c) => ({ city: c.slug }))
  } catch {
    return []
  }
}

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
  const q = searchParams.q?.trim()

  const baseWhere = {
    cityId: city.id,
    status: 'active' as const,
    ...(typeFilter ? { type: typeFilter } : {}),
    ...(q ? {
      OR: [
        { name: { contains: q, mode: 'insensitive' as const } },
        { address: { contains: q, mode: 'insensitive' as const } },
      ],
    } : {}),
  }

  const [carwashes, total, benchmarks, districtRows] = await Promise.all([
    prisma.carWash.findMany({
      where: baseWhere,
      orderBy: [{ featured: 'desc' }, { rating: 'desc' }, { reviewCount: 'desc' }],
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.carWash.count({ where: baseWhere }),
    prisma.benchmark.findMany({
      where: {
        metric: 'avg_check',
        OR: [{ city: params.city }, { city: null }],
      },
      orderBy: { city: 'desc' }, // city-specific rows first (non-null > null)
    }),
    prisma.carWash.findMany({
      where: { cityId: city.id, status: 'active', district: { not: null } },
      select: { district: true },
      distinct: ['district'],
      take: 8,
    }),
  ])

  const districts = districtRows.map(r => r.district).filter(Boolean) as string[]

  const totalPages = Math.ceil(total / perPage)

  // FAQ data
  const selfServiceBenchmark = benchmarks.find(b => b.carwashType === 'self_service')
  const manualBenchmark = benchmarks.find(b => b.carwashType === 'manual')
  const priceAnswer = selfServiceBenchmark || manualBenchmark
    ? `В ${city.name} средний чек: ${selfServiceBenchmark ? `самообслуживание — ${Math.round(selfServiceBenchmark.value)} ₽` : ''}${selfServiceBenchmark && manualBenchmark ? ', ' : ''}${manualBenchmark ? `ручная мойка — ${Math.round(manualBenchmark.value)} ₽` : ''}. Цены зависят от класса автомобиля и набора услуг.`
    : `В ${city.name} цены варьируются от 200 до 2000 ₽ в зависимости от типа мойки и класса автомобиля.`

  const faqItems = [
    {
      q: `Сколько стоит помыть машину в ${city.name}?`,
      a: priceAnswer,
    },
    {
      q: `Где найти автомойку рядом в ${city.name}?`,
      a: `Воспользуйтесь каталогом на этой странице — здесь собраны все автомойки ${city.name} с адресами и режимом работы. Используйте фильтры по типу или поиск по адресу.`,
    },
    {
      q: 'Какой тип автомойки лучше выбрать?',
      a: 'Самообслуживание — бюджетно и быстро (150–400 ₽). Ручная мойка — тщательная чистка (от 500 ₽). Автоматическая — скорость без участия мойщика. Детейлинг — глубокая полировка и защита кузова.',
    },
    {
      q: `Работают ли автомойки в ${city.name} круглосуточно?`,
      a: `Часть автомоек ${city.name} работает 24/7, особенно мойки самообслуживания. Режим работы каждой точки указан в карточке.`,
    },
    {
      q: 'Как оставить отзыв об автомойке?',
      a: 'Откройте карточку любой автомойки в каталоге и перейдите в раздел «Отзывы». Там можно поставить оценку и написать комментарий — это помогает другим автовладельцам сделать выбор.',
    },
  ]

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

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

      <CitySearchInput defaultValue={q} citySlug={params.city} />

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

      {/* Цены и рейтинг */}
      <div className="flex flex-wrap gap-3 mb-8 text-sm">
        <Link href={`/avtomoyki/${params.city}/ceny`} className="text-[#e94560] hover:underline font-medium">
          Цены на мойку в {city.name} →
        </Link>
        <span className="text-gray-300">|</span>
        <Link href={`/avtomoyki/${params.city}/rejting`} className="text-gray-500 hover:text-[#e94560] transition-colors">
          Рейтинг лучших →
        </Link>
        <span className="text-gray-300">|</span>
        <Link href={`/avtomoyki/${params.city}/deshevo`} className="text-gray-500 hover:text-[#e94560] transition-colors">
          Дёшево →
        </Link>
        <span className="text-gray-300">|</span>
        <Link href={`/avtomoyki/${params.city}/kruglosutochno`} className="text-gray-500 hover:text-[#e94560] transition-colors">
          Круглосуточные →
        </Link>
        <span className="text-gray-300">|</span>
        <Link href="/avtomoyki/reyting" className="text-gray-500 hover:text-[#e94560] transition-colors">
          Общий рейтинг →
        </Link>
        {districts.length > 0 && (
          <>
            <span className="text-gray-300">|</span>
            <span className="text-gray-500">По районам:</span>
            {districts.slice(0, 4).map(d => (
              <Link
                key={d}
                href={`/avtomoyki/${params.city}/rayon/${d.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-gray-500 hover:text-[#e94560] transition-colors"
              >
                {d}
              </Link>
            ))}
          </>
        )}
      </div>

      {/* Benchmark avg_check strip */}
      {benchmarks.length > 0 && (() => {
        // Prefer city-specific row, fall back to national (city: null)
        const seen = new Set<string>()
        const best = benchmarks.filter(b => {
          if (seen.has(b.carwashType)) return false
          seen.add(b.carwashType)
          return true
        })
        const typeOrder = ['self_service', 'manual', 'automatic', 'detailing']
        const ordered = typeOrder.map(t => best.find(b => b.carwashType === t)).filter(Boolean) as typeof best
        if (ordered.length === 0) return null
        return (
          <div className="mb-8 bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4">
            <p className="text-xs text-blue-500 font-medium mb-3 uppercase tracking-wide">Средний чек в {city.name}</p>
            <div className="flex flex-wrap gap-4">
              {ordered.map(b => (
                <div key={b.carwashType} className="text-sm">
                  <span className="text-gray-500">{TYPE_LABELS[b.carwashType]}:</span>{' '}
                  <span className="font-semibold text-gray-900">{Math.round(b.value)} ₽</span>
                  {b.city === null && <span className="text-xs text-gray-400 ml-1">(средн. по РФ)</span>}
                </div>
              ))}
            </div>
          </div>
        )
      })()}

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
            <Link key={cw.id} href={`/avtomoyki/${params.city}/${cw.slug}`} className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-[#e94560] hover:shadow-md transition-all flex flex-col group">
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
              <div className="mt-3 text-sm font-semibold text-[#e94560] group-hover:underline">Подробнее →</div>
            </Link>
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

      {/* FAQ */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Частые вопросы</h2>
        <div className="space-y-3">
          {faqItems.map((item) => (
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
