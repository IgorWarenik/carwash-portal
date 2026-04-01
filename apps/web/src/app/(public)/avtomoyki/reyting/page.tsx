import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@carwash/db'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Лучшие автомойки России — рейтинг топ-50',
  description: 'Рейтинг лучших автомоек России по оценкам клиентов. Топ самообслуживания, ручных моек и детейлинга по всем городам.',
  alternates: { canonical: '/avtomoyki/reyting' },
}

const TYPE_LABELS: Record<string, string> = {
  self_service: 'Самообслуживание',
  automatic: 'Автоматическая',
  manual: 'Ручная',
  detailing: 'Детейлинг',
  truck: 'Для грузовых',
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(i => (
        <svg key={i} className={`w-4 h-4 ${i <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-200'} fill-current`} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Лучшие автомойки России — рейтинг топ-50',
  description: 'Рейтинг автомоек по оценкам клиентов',
}

export default async function ReytingPage() {
  let carwashes: Array<{
    id: string; name: string; slug: string; type: string
    address: string; rating: number | null; reviewCount: number
    priceFrom: number | null; city: { name: string; slug: string }
  }> = []

  try {
    carwashes = await prisma.carWash.findMany({
      where: { status: 'active', rating: { gt: 0 } },
      orderBy: [{ rating: 'desc' }, { reviewCount: 'desc' }],
      take: 50,
      select: {
        id: true, name: true, slug: true, type: true,
        address: true, rating: true, reviewCount: true,
        priceFrom: true,
        city: { select: { name: true, slug: true } },
      },
    })
  } catch {
    // DB unavailable — show empty state
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-[#e94560]">Главная</Link>
        <span>›</span>
        <Link href="/avtomoyki" className="hover:text-[#e94560]">Автомойки</Link>
        <span>›</span>
        <span className="text-gray-900">Рейтинг</span>
      </nav>

      <h1 className="text-3xl font-bold mb-2">Лучшие автомойки России</h1>
      <p className="text-gray-500 mb-10">
        Топ-50 по оценкам клиентов — из всех городов и форматов
      </p>

      {carwashes.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">Данные рейтинга пока формируются</p>
          <Link href="/avtomoyki" className="mt-4 inline-block text-[#e94560] font-semibold hover:underline">
            Смотреть каталог →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {carwashes.map((cw, i) => (
            <Link
              key={cw.id}
              href={`/avtomoyki/${cw.city.slug}/${cw.slug}`}
              className="group flex items-center gap-4 bg-white border border-gray-200 hover:border-[#e94560] rounded-2xl p-4 transition-all hover:shadow-sm"
            >
              {/* Rank */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                i === 0 ? 'bg-yellow-400 text-white' :
                i === 1 ? 'bg-gray-300 text-white' :
                i === 2 ? 'bg-amber-600 text-white' :
                'bg-gray-100 text-gray-500'
              }`}>
                {i + 1}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <h2 className="font-semibold group-hover:text-[#e94560] transition-colors">{cw.name}</h2>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{TYPE_LABELS[cw.type] ?? cw.type}</span>
                </div>
                <p className="text-sm text-gray-500 line-clamp-1">{cw.address}, {cw.city.name}</p>
              </div>

              {/* Rating */}
              <div className="flex-shrink-0 text-right">
                {cw.rating !== null && (
                  <>
                    <div className="flex items-center gap-1 justify-end">
                      <Stars rating={cw.rating} />
                      <span className="font-bold text-sm ml-1">{cw.rating.toFixed(1)}</span>
                    </div>
                    <div className="text-xs text-gray-400">{cw.reviewCount} отз.</div>
                  </>
                )}
                {cw.priceFrom && (
                  <div className="text-xs text-gray-500 mt-1">от {cw.priceFrom} ₽</div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-12 bg-[#1a1a2e] text-white rounded-2xl p-8 text-center">
        <h2 className="text-xl font-bold mb-2">Хотите видеть свою мойку в топе?</h2>
        <p className="text-gray-300 mb-5 text-sm">Добавьте мойку в каталог и получайте клиентов с портала</p>
        <Link href="/prodaty-avtomoiku" className="inline-block px-6 py-3 bg-[#e94560] text-white rounded-xl font-semibold hover:bg-[#c73652] transition-colors text-sm">
          Разместить мойку →
        </Link>
      </div>
    </main>
  )
}
