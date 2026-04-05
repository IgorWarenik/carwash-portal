import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@carwash/db'
import { LeadFormBuy } from '@/components/LeadFormBuy'
import { OwnerClaimBlock } from '@/components/OwnerClaimBlock'
import { ReviewForm } from '@/components/ReviewForm'

interface Props { params: { city: string; slug: string } }

const TYPE_LABELS: Record<string, string> = {
  self_service: 'Самообслуживание',
  automatic: 'Автоматическая',
  manual: 'Ручная мойка',
  detailing: 'Детейлинг',
  truck: 'Для грузовых',
}

// Type-SEO slugs (formerly [type] segment — merged here to avoid Next.js parallel dynamic segment conflict)
const TYPE_MAP: Record<string, { db: string; label: string; labelRod: string; desc: string }> = {
  samobsluzhivanie: { db: 'self_service', label: 'Самообслуживание', labelRod: 'самообслуживания', desc: 'Мойки самообслуживания работают 24/7, не требуют персонала. Средний чек — 80–350 ₽.' },
  ruchnaya: { db: 'manual', label: 'Ручная мойка', labelRod: 'ручных моек', desc: 'Ручная мойка обеспечивает высокое качество: мойщик вручную обрабатывает все поверхности. Цены — от 400 ₽.' },
  avtomaticheskaya: { db: 'automatic', label: 'Автоматическая мойка', labelRod: 'автоматических моек', desc: 'Портальные и тоннельные мойки — быстро (5–7 мин) без участия персонала. Цены — от 500 ₽.' },
  deteyling: { db: 'detailing', label: 'Детейлинг', labelRod: 'детейлинг-центров', desc: 'Детейлинг-центры: химчистка салона, полировка, нанесение керамики. Стоимость — от 2 000 ₽.' },
  dlya_gruzovik: { db: 'truck', label: 'Мойка для грузовых', labelRod: 'моек для грузовых', desc: 'Специализированные мойки для грузового транспорта, автобусов и спецтехники.' },
}

export const revalidate = 3600
export const dynamicParams = true

export async function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Type-SEO page
  const typeInfo = TYPE_MAP[params.slug]
  if (typeInfo) {
    try {
      const city = await prisma.city.findUnique({ where: { slug: params.city } })
      if (!city) return {}
      return {
        title: `${typeInfo.label} в ${city.name} — каталог, цены, адреса`,
        description: `Найдите лучшие ${typeInfo.labelRod} в ${city.name}. ${typeInfo.desc} Адреса, режим работы, отзывы.`,
        alternates: { canonical: `/avtomoyki/${params.city}/${params.slug}` },
      }
    } catch { return {} }
  }
  // Carwash detail page
  const cw = await prisma.carWash.findUnique({ where: { slug: params.slug }, include: { city: true } })
  if (!cw) return {}
  const typeLabel = TYPE_LABELS[cw.type] ?? 'Автомойка'
  return {
    title: `${cw.name} — ${typeLabel} в ${cw.city.name}`,
    description: `${typeLabel} ${cw.name} по адресу ${cw.address}, ${cw.city.name}. ${cw.priceFrom ? `Цены от ${cw.priceFrom} ₽.` : ''} Режим работы, услуги, отзывы.`,
    alternates: { canonical: `/avtomoyki/${params.city}/${params.slug}` },
  }
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  const stars = Math.round(rating)
  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {[1,2,3,4,5].map(i => (
          <svg key={i} className={`w-5 h-5 ${i <= stars ? 'text-yellow-400' : 'text-gray-200'} fill-current`} viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="font-semibold">{rating.toFixed(1)}</span>
      <span className="text-gray-500 text-sm">({count} отзывов)</span>
    </div>
  )
}

export default async function CarWashDetailPage({ params }: Props) {
  // Type-SEO page (formerly [type]/page.tsx — merged to avoid Next.js dynamic segment conflict)
  const typeInfo = TYPE_MAP[params.slug]
  if (typeInfo) {
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
        prisma.carWash.count({ where: { cityId: city.id, status: 'active', type: typeInfo.db as never } }),
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
          acceptedAnswer: { '@type': 'Answer', text: `${typeInfo.desc} Точные цены зависят от конкретной мойки.` },
        },
        {
          '@type': 'Question',
          name: `Сколько ${typeInfo.labelRod} в ${city!.name}?`,
          acceptedAnswer: { '@type': 'Answer', text: `В нашем каталоге ${total} ${typeInfo.labelRod} в ${city!.name}.` },
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

        <div className="flex flex-wrap gap-2 mb-8">
          <Link href={`/avtomoyki/${params.city}`} className="px-3 py-1.5 rounded-full text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
            Все типы
          </Link>
          {Object.entries(TYPE_MAP).filter(([k]) => k !== params.slug).map(([k, v]) => (
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
                {cw.description && <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">{cw.description}</p>}
                <div className="mt-auto space-y-2">
                  {cw.rating !== null && cw.rating > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm font-medium">{cw.rating.toFixed(1)}</span>
                      </div>
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

  // --- Carwash detail page ---
  const cw = await prisma.carWash.findUnique({
    where: { slug: params.slug },
    include: {
      city: true,
      reviews: { orderBy: { publishedAt: 'desc' }, take: 5 },
    },
  }).catch(() => null)

  if (!cw || cw.city.slug !== params.city) notFound()

  const related = await prisma.carWash.findMany({
    where: {
      cityId: cw.cityId,
      type: cw.type,
      status: 'active',
      id: { not: cw.id },
    },
    orderBy: [{ featured: 'desc' }, { rating: 'desc' }],
    take: 3,
    select: { id: true, name: true, slug: true, type: true, address: true, rating: true, priceFrom: true, city: { select: { slug: true } } },
  })

  const typeLabel = TYPE_LABELS[cw.type] ?? 'Автомойка'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `https://avtomoyki-portal.ru/avtomoyki/${params.city}/${params.slug}`,
    name: cw.name,
    description: cw.description ?? undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: cw.address,
      addressLocality: cw.city.name,
      addressCountry: 'RU',
    },
    telephone: cw.phone ?? undefined,
    url: cw.website ?? undefined,
    ...(cw.rating && cw.rating > 0 ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: cw.rating,
        reviewCount: cw.reviewCount,
      },
    } : {}),
    openingHours: cw.isOpen24h ? 'Mo-Su 00:00-24:00' : cw.workingHours ?? undefined,
    priceRange: cw.priceFrom ? `от ${cw.priceFrom} ₽` : undefined,
    ...(cw.reviews.length > 0 ? {
      review: cw.reviews.slice(0, 3).map(r => ({
        '@type': 'Review',
        author: { '@type': 'Person', name: r.authorName },
        reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5 },
        reviewBody: r.text ?? undefined,
        datePublished: r.publishedAt?.toISOString().split('T')[0] ?? r.createdAt.toISOString().split('T')[0],
      })),
    } : {}),
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-[#e94560]">Главная</Link>
        <span>›</span>
        <Link href="/avtomoyki" className="hover:text-[#e94560]">Автомойки</Link>
        <span>›</span>
        <Link href={`/avtomoyki/${params.city}`} className="hover:text-[#e94560]">{cw.city.name}</Link>
        <span>›</span>
        <span className="text-gray-900 line-clamp-1">{cw.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-medium bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{typeLabel}</span>
              {cw.featured && <span className="text-xs font-medium bg-[#e94560]/10 text-[#e94560] px-3 py-1 rounded-full">Топ</span>}
              {cw.isOpen24h && <span className="text-xs font-medium bg-green-100 text-green-700 px-3 py-1 rounded-full">24/7</span>}
            </div>
            <h1 className="text-3xl font-bold mb-2">{cw.name}</h1>
            <p className="text-gray-500">{cw.address}, {cw.city.name}</p>

            {cw.rating !== null && cw.rating > 0 && (
              <div className="mt-3">
                <StarRating rating={cw.rating} count={cw.reviewCount} />
              </div>
            )}
          </div>

          {/* Description */}
          {cw.description && (
            <div className="bg-gray-50 rounded-2xl p-5">
              <p className="text-gray-700 leading-relaxed">{cw.description}</p>
            </div>
          )}

          {/* Details grid */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Информация</h2>
            <dl className="space-y-3">
              {(cw.priceFrom || cw.priceTo) && (
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-500">Стоимость мойки</dt>
                  <dd className="font-semibold">
                    {cw.priceFrom && `от ${cw.priceFrom} ₽`}
                    {cw.priceFrom && cw.priceTo && ' '}
                    {cw.priceTo && `до ${cw.priceTo} ₽`}
                  </dd>
                </div>
              )}
              {cw.posts && (
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-500">Постов / боксов</dt>
                  <dd className="font-semibold">{cw.posts}</dd>
                </div>
              )}
              {cw.workingHours && (
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-500">Режим работы</dt>
                  <dd className="font-semibold text-green-600">{cw.isOpen24h ? 'Круглосуточно' : cw.workingHours}</dd>
                </div>
              )}
              {cw.phone && (
                <div className="flex justify-between text-sm items-center">
                  <dt className="text-gray-500">Телефон</dt>
                  <dd><a href={`tel:${cw.phone}`} className="font-semibold text-[#e94560] hover:underline">{cw.phone}</a></dd>
                </div>
              )}
              {cw.website && (
                <div className="flex justify-between text-sm items-center">
                  <dt className="text-gray-500">Сайт</dt>
                  <dd><a href={cw.website} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#e94560] hover:underline truncate max-w-[200px]">{cw.website.replace(/^https?:\/\//, '')}</a></dd>
                </div>
              )}
            </dl>
          </div>

          {/* Services */}
          {cw.services.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <h2 className="font-semibold text-gray-900 mb-3">Услуги</h2>
              <div className="flex flex-wrap gap-2">
                {cw.services.map(s => (
                  <span key={s} className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">
                Отзывы{cw.reviewCount > 0 && <span className="text-gray-400 font-normal ml-2 text-sm">({cw.reviewCount})</span>}
              </h2>
              {cw.reviewCount > 0 && (
                <Link
                  href={`/avtomoyki/${params.city}/${params.slug}/otzyvy`}
                  className="text-sm text-[#e94560] hover:underline"
                >
                  Все отзывы →
                </Link>
              )}
            </div>
            {cw.reviews.length > 0 ? (
              <div className="space-y-4 mb-5">
                {cw.reviews.map(r => (
                  <div key={r.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{r.authorName}</span>
                      <div className="flex items-center gap-1">
                        <div className="flex">
                          {[1,2,3,4,5].map(i => (
                            <svg key={i} className={`w-4 h-4 ${i <= r.rating ? 'text-yellow-400' : 'text-gray-200'} fill-current`} viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        {r.publishedAt && (
                          <span className="text-xs text-gray-400 ml-1">
                            {new Date(r.publishedAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        )}
                      </div>
                    </div>
                    {r.text && <p className="text-sm text-gray-600 leading-relaxed">{r.text}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 mb-4">Отзывов пока нет — будьте первым!</p>
            )}
            {cw.reviewCount > 5 && (
              <Link
                href={`/avtomoyki/${params.city}/${params.slug}/otzyvy`}
                className="block text-center text-sm text-[#e94560] hover:underline font-medium mb-4"
              >
                Показать все {cw.reviewCount} отзывов →
              </Link>
            )}
            <ReviewForm carwashId={cw.id} carwashSlug={cw.slug} citySlug={cw.city.slug} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Call CTA */}
          {cw.phone && (
            <a
              href={`tel:${cw.phone}`}
              className="flex items-center justify-center gap-2 w-full py-4 bg-[#e94560] text-white rounded-2xl font-bold text-lg hover:bg-[#c73652] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V5z" />
              </svg>
              Позвонить
            </a>
          )}

          {/* Yandex Maps iframe */}
          <div className="rounded-2xl overflow-hidden border border-gray-200">
            <iframe
              title={`Карта: ${cw.name}`}
              src={`https://yandex.ru/map-widget/v1/?text=${encodeURIComponent(`${cw.name}, ${cw.address}, ${cw.city.name}`)}&z=16&l=map`}
              width="100%"
              height="200"
              className="block"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="px-3 py-2 bg-white">
              <p className="text-xs text-gray-500">{cw.address}, {cw.city.name}</p>
            </div>
          </div>

          {/* Lead form */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <p className="font-semibold text-gray-900 mb-1 text-sm">Интересует эта мойка?</p>
            <p className="text-xs text-gray-500 mb-4">Оставьте заявку — мы свяжемся с владельцем</p>
            <LeadFormBuy compact />
          </div>

          {/* Owner claim CTA */}
          {!cw.claimedByOwner ? (
            <OwnerClaimBlock carwashId={cw.id} />
          ) : (
            <div className="bg-green-50 border border-green-100 rounded-2xl p-4 text-sm">
              <div className="flex items-center gap-2 text-green-700 font-semibold mb-1">
                <span>✓</span> Верифицировано владельцем
              </div>
              <p className="text-green-600 text-xs">Данные актуальны и подтверждены владельцем мойки.</p>
            </div>
          )}

          {/* Back link */}
          <Link
            href={`/avtomoyki/${params.city}`}
            className="block text-center text-sm text-gray-500 hover:text-[#e94560] transition-colors"
          >
            ← Все мойки в {cw.city.name}
          </Link>
        </div>
      </div>

      {/* Related carwashes */}
      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-5">Похожие автомойки в {cw.city.name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map(r => (
              <Link
                key={r.id}
                href={`/avtomoyki/${r.city.slug}/${r.slug}`}
                className="group bg-white border border-gray-200 rounded-2xl p-4 hover:border-[#e94560] hover:shadow-sm transition-all"
              >
                <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {TYPE_LABELS[r.type] ?? r.type}
                </span>
                <h3 className="font-semibold mt-2 mb-1 group-hover:text-[#e94560] transition-colors line-clamp-1">{r.name}</h3>
                <p className="text-xs text-gray-500 line-clamp-1 mb-2">{r.address}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  {r.rating && r.rating > 0 ? <span>★ {r.rating.toFixed(1)}</span> : <span />}
                  {r.priceFrom && <span>от {r.priceFrom} ₽</span>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
