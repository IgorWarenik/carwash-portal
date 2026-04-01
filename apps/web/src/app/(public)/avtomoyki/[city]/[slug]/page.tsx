import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@carwash/db'
import { LeadFormBuy } from '@/components/LeadFormBuy'

interface Props { params: { city: string; slug: string } }

const TYPE_LABELS: Record<string, string> = {
  self_service: 'Самообслуживание',
  automatic: 'Автоматическая',
  manual: 'Ручная мойка',
  detailing: 'Детейлинг',
  truck: 'Для грузовых',
}

export const revalidate = 3600

export async function generateStaticParams() {
  try {
    const carwashes = await prisma.carWash.findMany({
      where: { status: 'active' },
      select: { slug: true, city: { select: { slug: true } } },
    })
    return carwashes.map(cw => ({ city: cw.city.slug, slug: cw.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cw = await prisma.carWash.findUnique({
    where: { slug: params.slug },
    include: { city: true },
  })
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
  const cw = await prisma.carWash.findUnique({
    where: { slug: params.slug },
    include: {
      city: true,
      reviews: { orderBy: { publishedAt: 'desc' }, take: 5 },
    },
  })

  if (!cw || cw.city.slug !== params.city) notFound()

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
          {cw.reviews.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <h2 className="font-semibold text-gray-900 mb-4">Отзывы</h2>
              <div className="space-y-4">
                {cw.reviews.map(r => (
                  <div key={r.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{r.authorName}</span>
                      <div className="flex">
                        {[1,2,3,4,5].map(i => (
                          <svg key={i} className={`w-4 h-4 ${i <= r.rating ? 'text-yellow-400' : 'text-gray-200'} fill-current`} viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    {r.text && <p className="text-sm text-gray-600">{r.text}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
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

          {/* Map placeholder */}
          <div className="bg-gray-100 rounded-2xl p-4 text-center">
            <div className="text-2xl mb-2">📍</div>
            <p className="text-sm font-medium text-gray-700">{cw.address}</p>
            <p className="text-xs text-gray-500 mt-1">{cw.city.name}</p>
          </div>

          {/* Lead form */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <p className="font-semibold text-gray-900 mb-1 text-sm">Интересует эта мойка?</p>
            <p className="text-xs text-gray-500 mb-4">Оставьте заявку — мы свяжемся с владельцем</p>
            <LeadFormBuy compact />
          </div>

          {/* Back link */}
          <Link
            href={`/avtomoyki/${params.city}`}
            className="block text-center text-sm text-gray-500 hover:text-[#e94560] transition-colors"
          >
            ← Все мойки в {cw.city.name}
          </Link>
        </div>
      </div>
    </main>
  )
}
