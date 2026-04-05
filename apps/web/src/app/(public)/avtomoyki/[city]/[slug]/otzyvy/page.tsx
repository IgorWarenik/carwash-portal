import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@carwash/db'
import { ReviewForm } from '@/components/ReviewForm'

interface Props { params: { city: string; slug: string } }

export const revalidate = 600

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cw = await prisma.carWash.findUnique({
    where: { slug: params.slug },
    select: { name: true, reviewCount: true, city: { select: { name: true } } },
  }).catch(() => null)
  if (!cw) return {}
  return {
    title: `Отзывы об автомойке ${cw.name} — ${cw.city.name}`,
    description: `${cw.reviewCount} отзывов о мойке ${cw.name} в ${cw.city.name}. Читайте реальные отзывы клиентов и оставьте свой.`,
    alternates: { canonical: `/avtomoyki/${params.city}/${params.slug}/otzyvy` },
  }
}

const STARS = [1, 2, 3, 4, 5]

export default async function ReviewsPage({ params }: Props) {
  const data = await prisma.carWash.findUnique({
    where: { slug: params.slug },
    select: {
      id: true, name: true, slug: true, rating: true, reviewCount: true,
      city: { select: { slug: true, name: true } },
      reviews: {
        orderBy: { publishedAt: 'desc' },
        take: 100,
      },
    },
  }).catch(() => null)

  if (!data || data.city.slug !== params.city) notFound()

  const dist = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: data.reviews.filter(r => r.rating === star).length,
  }))
  const total = data.reviews.length

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-[#e94560]">Главная</Link>
        <span>›</span>
        <Link href={`/avtomoyki/${params.city}`} className="hover:text-[#e94560]">{data.city.name}</Link>
        <span>›</span>
        <Link href={`/avtomoyki/${params.city}/${params.slug}`} className="hover:text-[#e94560]">{data.name}</Link>
        <span>›</span>
        <span className="text-gray-900">Отзывы</span>
      </nav>

      <h1 className="text-2xl font-bold mb-1">Отзывы об автомойке {data.name}</h1>
      <p className="text-gray-500 text-sm mb-8">{data.city.name}</p>

      {/* Rating summary */}
      {total > 0 && (
        <div className="bg-gray-50 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row gap-6 items-center">
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-900">{data.rating?.toFixed(1) ?? '—'}</div>
            <div className="flex justify-center gap-0.5 my-1">
              {STARS.map(i => (
                <svg key={i} className={`w-5 h-5 fill-current ${i <= Math.round(data.rating ?? 0) ? 'text-yellow-400' : 'text-gray-200'}`} viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <div className="text-sm text-gray-500">{total} {total % 10 === 1 && total % 100 !== 11 ? 'отзыв' : total % 10 <= 4 && (total % 100 < 10 || total % 100 >= 20) ? 'отзыва' : 'отзывов'}</div>
          </div>
          <div className="flex-1 w-full space-y-1.5">
            {dist.map(({ star, count }) => (
              <div key={star} className="flex items-center gap-2 text-sm">
                <span className="w-4 text-right text-gray-500">{star}</span>
                <svg className="w-3.5 h-3.5 text-yellow-400 fill-current flex-shrink-0" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ width: total > 0 ? `${(count / total) * 100}%` : '0%' }}
                  />
                </div>
                <span className="w-6 text-gray-500">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews list */}
      <div className="space-y-4 mb-8">
        {data.reviews.length === 0 ? (
          <p className="text-gray-400 text-sm py-4">Отзывов пока нет — будьте первым!</p>
        ) : (
          data.reviews.map(r => (
            <div key={r.id} className="bg-white border border-gray-200 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">{r.authorName}</span>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {STARS.map(i => (
                      <svg key={i} className={`w-4 h-4 fill-current ${i <= r.rating ? 'text-yellow-400' : 'text-gray-200'}`} viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  {r.publishedAt && (
                    <span className="text-xs text-gray-400">
                      {new Date(r.publishedAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  )}
                </div>
              </div>
              {r.text && <p className="text-gray-700 text-sm leading-relaxed">{r.text}</p>}
            </div>
          ))
        )}
      </div>

      {/* Add review */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4">Оставить отзыв</h2>
        <ReviewForm carwashId={data.id} carwashSlug={data.slug} citySlug={data.city.slug} />
      </div>

      <Link
        href={`/avtomoyki/${params.city}/${params.slug}`}
        className="text-[#e94560] font-semibold hover:underline"
      >
        ← Вернуться к мойке
      </Link>
    </main>
  )
}
