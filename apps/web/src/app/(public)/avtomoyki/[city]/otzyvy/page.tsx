import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@carwash/db'

interface Props { params: { city: string }; searchParams: { page?: string } }

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = await prisma.city.findUnique({ where: { slug: params.city } }).catch(() => null)
  if (!city) return {}
  return {
    title: `Отзывы об автомойках ${city.name} — реальные оценки клиентов`,
    description: `Читайте отзывы клиентов об автомойках ${city.name}. Реальные оценки, фото, комментарии. Найдите лучшую мойку по отзывам.`,
    alternates: { canonical: `/avtomoyki/${params.city}/otzyvy` },
  }
}

function StarBar({ rating, count }: { rating: number; count: number }) {
  const stars = Math.round(rating)
  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {[1,2,3,4,5].map(i => (
          <span key={i} className={`text-lg ${i <= stars ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
        ))}
      </div>
      <span className="font-semibold">{rating.toFixed(1)}</span>
      <span className="text-gray-400 text-sm">({count})</span>
    </div>
  )
}

export default async function CityReviewsPage({ params, searchParams }: Props) {
  const city = await prisma.city.findUnique({ where: { slug: params.city } }).catch(() => null)
  if (!city) notFound()

  const page = Math.max(1, Number(searchParams.page ?? 1))
  const perPage = 20

  const [reviews, totalReviews, topByRating, stats] = await Promise.all([
    // Latest reviews across all carwashes in city
    prisma.review.findMany({
      where: { carwash: { cityId: city.id, status: 'active' }, publishedAt: { not: null } },
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
      include: { carwash: { select: { name: true, slug: true, type: true } } },
    }),
    prisma.review.count({
      where: { carwash: { cityId: city.id, status: 'active' }, publishedAt: { not: null } },
    }),
    // Top 5 carwashes by rating in city
    prisma.carWash.findMany({
      where: { cityId: city.id, status: 'active', rating: { gt: 0 }, reviewCount: { gte: 3 } },
      orderBy: [{ rating: 'desc' }, { reviewCount: 'desc' }],
      take: 5,
      select: { id: true, name: true, slug: true, rating: true, reviewCount: true, type: true },
    }),
    // Rating distribution
    prisma.review.groupBy({
      by: ['rating'],
      where: { carwash: { cityId: city.id, status: 'active' }, publishedAt: { not: null } },
      _count: true,
      orderBy: { rating: 'desc' },
    }),
  ])

  if (totalReviews === 0) notFound()

  const totalPages = Math.ceil(totalReviews / perPage)
  const avgRating = stats.length > 0
    ? stats.reduce((sum, s) => sum + s.rating * s._count, 0) / stats.reduce((sum, s) => sum + s._count, 0)
    : 0

  const TYPE_LABELS: Record<string, string> = {
    self_service: 'Самообслуживание',
    automatic: 'Автоматическая',
    manual: 'Ручная',
    detailing: 'Детейлинг',
    truck: 'Для грузовых',
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная',   item: 'https://www.businessmoyka.ru/' },
      { '@type': 'ListItem', position: 2, name: 'Автомойки', item: 'https://www.businessmoyka.ru/avtomoyki' },
      { '@type': 'ListItem', position: 3, name: city.name,   item: `https://www.businessmoyka.ru/avtomoyki/${params.city}` },
      { '@type': 'ListItem', position: 4, name: 'Отзывы',    item: `https://www.businessmoyka.ru/avtomoyki/${params.city}/otzyvy` },
    ],
  }

  const aggregateRatingLd = avgRating > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `Автомойки ${city.name}`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: avgRating.toFixed(1),
      reviewCount: totalReviews,
      bestRating: 5,
    },
  } : null

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {aggregateRatingLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateRatingLd) }} />
      )}

      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-[#e94560]">Главная</Link>
        <span>›</span>
        <Link href="/avtomoyki" className="hover:text-[#e94560]">Автомойки</Link>
        <span>›</span>
        <Link href={`/avtomoyki/${params.city}`} className="hover:text-[#e94560]">{city.name}</Link>
        <span>›</span>
        <span className="text-gray-900">Отзывы</span>
      </nav>

      <h1 className="text-3xl font-bold mb-2">
        Отзывы об автомойках {city.name}
      </h1>
      <p className="text-gray-500 mb-8">{totalReviews} отзывов от реальных клиентов</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Left: reviews feed */}
        <div className="lg:col-span-2 space-y-4">
          {reviews.map(rev => (
            <div key={rev.id} className="bg-white border border-gray-200 rounded-2xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <Link
                    href={`/avtomoyki/${params.city}/${rev.carwash.slug}`}
                    className="font-semibold text-sm hover:text-[#e94560] transition-colors"
                  >
                    {rev.carwash.name}
                  </Link>
                  <span className="text-xs text-gray-400 ml-2">{TYPE_LABELS[rev.carwash.type] ?? rev.carwash.type}</span>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {[1,2,3,4,5].map(s => (
                    <span key={s} className={`text-sm ${s <= rev.rating ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                  ))}
                </div>
              </div>
              {rev.text && (
                <p className="text-sm text-gray-700 leading-relaxed mb-3 line-clamp-4">{rev.text}</p>
              )}
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{rev.authorName}</span>
                <span>{rev.publishedAt
                  ? new Date(rev.publishedAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
                  : new Date(rev.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
                }</span>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map(p => (
                <Link
                  key={p}
                  href={`/avtomoyki/${params.city}/otzyvy?page=${p}`}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                    p === page ? 'bg-[#e94560] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right: sidebar */}
        <div className="space-y-6">
          {/* Overall rating */}
          {avgRating > 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <h2 className="font-semibold text-sm text-gray-500 mb-3 uppercase tracking-wide">Средний рейтинг</h2>
              <div className="text-5xl font-bold text-gray-900 mb-2">{avgRating.toFixed(1)}</div>
              <StarBar rating={avgRating} count={totalReviews} />
              <div className="mt-4 space-y-1.5">
                {stats.map(s => (
                  <div key={s.rating} className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500 w-4">{s.rating}★</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-2 bg-yellow-400 rounded-full"
                        style={{ width: `${Math.round((s._count / totalReviews) * 100)}%` }}
                      />
                    </div>
                    <span className="text-gray-400 w-6 text-right">{s._count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top carwashes */}
          {topByRating.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <h2 className="font-semibold text-sm text-gray-500 mb-4 uppercase tracking-wide">Лучшие по отзывам</h2>
              <div className="space-y-3">
                {topByRating.map((cw, i) => (
                  <Link
                    key={cw.id}
                    href={`/avtomoyki/${params.city}/${cw.slug}`}
                    className="flex items-center gap-3 hover:text-[#e94560] transition-colors group"
                  >
                    <span className="text-lg font-bold text-gray-200 w-5">#{i+1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium leading-tight truncate group-hover:text-[#e94560]">{cw.name}</div>
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                        <span className="text-yellow-400">★</span>
                        <span>{cw.rating?.toFixed(1)}</span>
                        <span>· {cw.reviewCount} отз.</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <Link
                href={`/avtomoyki/${params.city}/rejting`}
                className="block mt-4 text-sm text-[#e94560] font-semibold hover:underline"
              >
                Полный рейтинг →
              </Link>
            </div>
          )}

          {/* CTA */}
          <div className="bg-gray-50 rounded-2xl p-5 text-center">
            <p className="text-sm text-gray-600 mb-3">Помойтесь — оставьте отзыв</p>
            <Link
              href={`/avtomoyki/${params.city}`}
              className="block w-full px-4 py-2.5 bg-[#e94560] text-white rounded-xl text-sm font-semibold hover:bg-[#c73652] transition-colors"
            >
              Найти мойку →
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
