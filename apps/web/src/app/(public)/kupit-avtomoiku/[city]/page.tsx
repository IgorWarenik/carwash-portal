import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@carwash/db'
import { LeadFormBuy } from '@/components/LeadFormBuy'

interface Props { params: { city: string } }

export const dynamic = 'force-dynamic'

const TYPE_LABELS: Record<string, string> = {
  self_service: 'Самообслуживание',
  automatic: 'Автоматическая',
  manual: 'Ручная',
  detailing: 'Детейлинг',
  truck: 'Для грузовых',
}

function formatRub(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} млн ₽`
  return `${Math.round(n / 1000)} тыс. ₽`
}

export async function generateStaticParams() {
  try {
    const cities = await prisma.city.findMany({ where: { isActive: true }, select: { slug: true } })
    return cities.map(c => ({ city: c.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const city = await prisma.city.findUnique({ where: { slug: params.city } })
    if (!city) return {}

    const count = await prisma.businessListing.count({
      where: { city: { slug: params.city }, status: 'active', listingType: 'SELL' },
    })

    const minPrice = await prisma.businessListing.findFirst({
      where: { city: { slug: params.city }, status: 'active', listingType: 'SELL', price: { gt: 0 } },
      orderBy: { price: 'asc' },
      select: { price: true },
    })

    return {
      title: `Купить автомойку в ${city.name} — ${count > 0 ? `${count} объявлений` : 'объявления о продаже'}`,
      description: `Продажа автомоечного бизнеса в ${city.name}. ${minPrice?.price ? `Цены от ${formatRub(minPrice.price)}.` : ''} Самообслуживание, ручные, детейлинг. Верифицированные объявления с финансовыми показателями.`,
      alternates: { canonical: `/kupit-avtomoiku/${params.city}` },
    }
  } catch {
    return {}
  }
}

export default async function BuyCityPage({ params }: Props) {
  let city: { id: string; name: string; slug: string } | null = null
  let listings: Array<{
    id: string; title: string; slug: string; carwashType: string
    price: number | null; revenue: number | null; profit: number | null
    posts: number | null; priceNegotiable: boolean
    city: { name: string }
  }> = []

  try {
    city = await prisma.city.findUnique({ where: { slug: params.city } })
    if (!city) notFound()

    listings = await prisma.businessListing.findMany({
      where: { cityId: city.id, status: 'active', listingType: 'SELL' },
      include: { city: { select: { name: true } } },
      orderBy: { price: 'asc' },
      take: 20,
    })
  } catch {
    if (!city) notFound()
  }

  const minPrice = listings.find(l => l.price && l.price > 0)?.price
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Сколько стоит купить автомойку в ${city!.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: minPrice
            ? `В нашем каталоге ${city!.name} объявления о продаже автомоек от ${formatRub(minPrice)}. Цена зависит от типа, локации и показателей выручки.`
            : `Стоимость готовой автомойки в ${city!.name} зависит от типа и формата: самообслуживание от 1,5 млн ₽, ручные мойки от 2 млн ₽.`,
        },
      },
      {
        '@type': 'Question',
        name: 'Как проверить автомойку перед покупкой?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Запросите кассовые Z-отчёты за 12 месяцев, договор аренды, документы на оборудование. Все наши объявления содержат верифицированные финансовые показатели.',
        },
      },
    ],
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-[#e94560]">Главная</Link>
        <span>›</span>
        <Link href="/kupit-avtomoiku" className="hover:text-[#e94560]">Купить автомойку</Link>
        <span>›</span>
        <span className="text-gray-900">{city!.name}</span>
      </nav>

      <h1 className="text-3xl font-bold mb-3">Купить автомойку в {city!.name}</h1>
      <p className="text-gray-500 mb-8">
        {listings.length > 0
          ? `${listings.length} объявлений о продаже готового бизнеса`
          : 'Объявлений пока нет — оставьте заявку и мы подберём варианты'}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {listings.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl p-10 text-center text-gray-500">
              <div className="text-4xl mb-3">🔍</div>
              <p className="font-semibold mb-1">Объявлений в {city!.name} пока нет</p>
              <p className="text-sm">Оставьте заявку — подберём варианты по вашим критериям</p>
              <Link href="/kupit-avtomoiku" className="mt-4 inline-block text-[#e94560] font-semibold hover:underline text-sm">
                Смотреть все города →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {listings.map(l => (
                <div key={l.id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-[#e94560] hover:shadow-sm transition-all">
                  <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                    <span className="text-xs font-medium bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                      {TYPE_LABELS[l.carwashType] ?? l.carwashType}
                    </span>
                    {l.priceNegotiable && (
                      <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">Торг</span>
                    )}
                  </div>

                  <h2 className="font-bold text-lg mb-1">{l.title}</h2>
                  <p className="text-sm text-gray-500 mb-4">{l.city.name}</p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                    {l.price && (
                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <div className="text-xs text-gray-400 mb-0.5">Цена</div>
                        <div className="font-bold text-[#e94560]">{formatRub(l.price)}</div>
                      </div>
                    )}
                    {l.revenue && (
                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <div className="text-xs text-gray-400 mb-0.5">Выручка/мес</div>
                        <div className="font-bold">{formatRub(l.revenue)}</div>
                      </div>
                    )}
                    {l.profit && (
                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <div className="text-xs text-gray-400 mb-0.5">Прибыль/мес</div>
                        <div className="font-bold text-green-600">{formatRub(l.profit)}</div>
                      </div>
                    )}
                    {l.posts && (
                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <div className="text-xs text-gray-400 mb-0.5">Постов</div>
                        <div className="font-bold">{l.posts}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar lead form */}
        <div className="space-y-4">
          <div className="bg-[#1a1a2e] rounded-2xl p-6 text-white" id="lead-form">
            <h2 className="font-bold text-lg mb-1">Подобрать мойку в {city!.name}</h2>
            <p className="text-gray-400 text-sm mb-5">Оставьте заявку — менеджер свяжется в течение 2 часов</p>
            <LeadFormBuy />
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 text-sm space-y-2">
            <p className="font-semibold text-gray-900 mb-3">Другие города</p>
            {['moskva', 'sankt-peterburg', 'ekaterinburg', 'krasnodar', 'kazan'].filter(s => s !== params.city).map(slug => {
              const names: Record<string, string> = {
                moskva: 'Москва',
                'sankt-peterburg': 'Санкт-Петербург',
                ekaterinburg: 'Екатеринбург',
                krasnodar: 'Краснодар',
                kazan: 'Казань',
              }
              return (
                <Link key={slug} href={`/kupit-avtomoiku/${slug}`} className="block text-gray-500 hover:text-[#e94560] transition-colors">
                  {names[slug] ?? slug} →
                </Link>
              )
            })}
            <Link href="/kupit-avtomoiku" className="block text-[#e94560] font-semibold hover:underline mt-2">
              Все города →
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
