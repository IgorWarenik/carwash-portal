import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@carwash/db'

interface Props { params: { city: string; type: string } }

// slug → DB enum + human labels
const TYPE_MAP: Record<string, { db: string; label: string; labelRod: string; desc: string }> = {
  samobsluzhivanie: {
    db: 'self_service',
    label: 'Самообслуживание',
    labelRod: 'самообслуживания',
    desc: 'Мойки самообслуживания работают 24/7, не требуют персонала. Средний чек — 80–350 ₽.',
  },
  ruchnaya: {
    db: 'manual',
    label: 'Ручная мойка',
    labelRod: 'ручных моек',
    desc: 'Ручная мойка обеспечивает высокое качество: мойщик вручную обрабатывает все поверхности. Цены — от 400 ₽.',
  },
  avtomaticheskaya: {
    db: 'automatic',
    label: 'Автоматическая мойка',
    labelRod: 'автоматических моек',
    desc: 'Портальные и тоннельные мойки — быстро (5–7 мин) без участия персонала. Цены — от 500 ₽.',
  },
  deteyling: {
    db: 'detailing',
    label: 'Детейлинг',
    labelRod: 'детейлинг-центров',
    desc: 'Детейлинг-центры: химчистка салона, полировка, нанесение керамики. Стоимость — от 2 000 ₽.',
  },
  dlya_gruzovik: {
    db: 'truck',
    label: 'Мойка для грузовых',
    labelRod: 'моек для грузовых',
    desc: 'Специализированные мойки для грузового транспорта, автобусов и спецтехники.',
  },
}

export const revalidate = 3600

export async function generateStaticParams() {
  try {
    const cities = await prisma.city.findMany({ where: { isActive: true }, select: { slug: true } })
    const types = Object.keys(TYPE_MAP)
    return cities.flatMap(c => types.map(t => ({ city: c.slug, type: t })))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const typeInfo = TYPE_MAP[params.type]
  if (!typeInfo) return {}
  try {
    const city = await prisma.city.findUnique({ where: { slug: params.city } })
    if (!city) return {}
    return {
      title: `${typeInfo.label} в ${city.name} — каталог, цены, адреса`,
      description: `Найдите лучшие ${typeInfo.labelRod} в ${city.name}. ${typeInfo.desc} Адреса, режим работы, отзывы.`,
      alternates: { canonical: `/avtomoyki/${params.city}/${params.type}` },
    }
  } catch {
    return {}
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

export default async function CityTypePage({ params }: Props) {
  const typeInfo = TYPE_MAP[params.type]
  if (!typeInfo) notFound()

  let city: { id: string; name: string; slug: string } | null = null
  let carwashes: Array<{
    id: string; name: string; slug: string; address: string
    rating: number | null; reviewCount: number
    priceFrom: number | null; priceTo: number | null
    workingHours: string | null; isOpen24h: boolean; phone: string | null
    description: string | null; featured: boolean
  }> = []
  let total = 0

  try {
    city = await prisma.city.findUnique({ where: { slug: params.city } })
    if (!city) notFound()

    ;[carwashes, total] = await Promise.all([
      prisma.carWash.findMany({
        where: { cityId: city.id, status: 'active', type: typeInfo.db as never },
        orderBy: [{ featured: 'desc' }, { rating: 'desc' }, { reviewCount: 'desc' }],
        take: 24,
        select: {
          id: true, name: true, slug: true, address: true,
          rating: true, reviewCount: true,
          priceFrom: true, priceTo: true,
          workingHours: true, isOpen24h: true, phone: true,
          description: true, featured: true,
        },
      }),
      prisma.carWash.count({
        where: { cityId: city.id, status: 'active', type: typeInfo.db as never },
      }),
    ])
  } catch {
    if (!city) notFound()
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${typeInfo.label} в ${city!.name}`,
    numberOfItems: total,
    itemListElement: carwashes.map((cw, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'LocalBusiness',
        name: cw.name,
        address: { '@type': 'PostalAddress', streetAddress: cw.address, addressLocality: city!.name },
      },
    })),
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Сколько стоит ${typeInfo.label.toLowerCase()} в ${city!.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${typeInfo.desc} Точные цены зависят от конкретной мойки и набора услуг.`,
        },
      },
      {
        '@type': 'Question',
        name: `Сколько ${typeInfo.labelRod} в ${city!.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `В нашем каталоге ${total} ${typeInfo.labelRod} в ${city!.name}. Воспользуйтесь фильтрами для подбора.`,
        },
      },
    ],
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-[#e94560]">Главная</Link>
        <span>›</span>
        <Link href="/avtomoyki" className="hover:text-[#e94560]">Автомойки</Link>
        <span>›</span>
        <Link href={`/avtomoyki/${params.city}`} className="hover:text-[#e94560]">{city!.name}</Link>
        <span>›</span>
        <span className="text-gray-900">{typeInfo.label}</span>
      </nav>

      <h1 className="text-3xl font-bold mb-2">{typeInfo.label} в {city!.name}</h1>
      <p className="text-gray-500 mb-3">{typeInfo.desc}</p>
      <p className="text-gray-400 text-sm mb-8">
        {total} {total % 10 === 1 && total % 100 !== 11 ? 'объект' : 'объектов'} в каталоге
      </p>

      {/* Other types nav */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link href={`/avtomoyki/${params.city}`} className="px-3 py-1.5 rounded-full text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
          Все типы
        </Link>
        {Object.entries(TYPE_MAP).filter(([k]) => k !== params.type).map(([k, v]) => (
          <Link key={k} href={`/avtomoyki/${params.city}/${k}`} className="px-3 py-1.5 rounded-full text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
            {v.label}
          </Link>
        ))}
      </div>

      {carwashes.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">Моек этого типа в каталоге пока нет</p>
          <Link href={`/avtomoyki/${params.city}`} className="mt-4 inline-block text-[#e94560] font-semibold hover:underline">
            Смотреть все мойки →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {carwashes.map(cw => (
            <Link
              key={cw.id}
              href={`/avtomoyki/${params.city}/${cw.slug}`}
              className="group bg-white border border-gray-200 hover:border-[#e94560] rounded-2xl p-5 hover:shadow-md transition-all flex flex-col"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-medium bg-[#e94560]/10 text-[#e94560] px-2 py-1 rounded-full">{typeInfo.label}</span>
                {cw.featured && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">Топ</span>}
              </div>

              <h2 className="font-semibold text-lg mb-1 leading-tight group-hover:text-[#e94560] transition-colors">{cw.name}</h2>
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
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Цена</span>
                    <span className="font-semibold">
                      {cw.priceFrom && `от ${cw.priceFrom} ₽`}
                      {cw.priceTo && !cw.priceFrom && `до ${cw.priceTo} ₽`}
                    </span>
                  </div>
                )}
                {(cw.workingHours || cw.isOpen24h) && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Режим</span>
                    <span className="font-medium text-green-600">{cw.isOpen24h ? 'Круглосуточно' : cw.workingHours}</span>
                  </div>
                )}
              </div>
              <div className="mt-3 text-sm font-semibold text-[#e94560]">Подробнее →</div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
