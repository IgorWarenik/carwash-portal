import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@carwash/db'

interface Props { params: { city: string } }

export const revalidate = 3600

const TYPE_LABELS: Record<string, string> = {
  self_service: 'Самообслуживание',
  automatic: 'Автоматическая',
  manual: 'Ручная мойка',
  detailing: 'Детейлинг',
  truck: 'Для грузовых',
}

// Средние цены по типам для городов без данных в БД
const DEFAULT_PRICES: Record<string, { from: number; to: number }> = {
  self_service: { from: 80, to: 350 },
  manual:       { from: 400, to: 1200 },
  automatic:    { from: 500, to: 1500 },
  detailing:    { from: 2000, to: 15000 },
  truck:        { from: 800, to: 3000 },
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
    return {
      title: `Цены на автомойку в ${city.name} — сколько стоит помыть машину`,
      description: `Средние цены на мойку автомобиля в ${city.name}: самообслуживание от 80 ₽, ручная от 400 ₽, детейлинг от 2000 ₽. Актуальные данные по ${city.name}.`,
      alternates: { canonical: `/avtomoyki/${params.city}/ceny` },
    }
  } catch {
    return {}
  }
}

export default async function CenyPage({ params }: Props) {
  let city: { id: string; name: string; slug: string } | null = null
  let pricesByType: Array<{
    type: string
    avgFrom: number | null
    avgTo: number | null
    count: number
  }> = []

  try {
    city = await prisma.city.findUnique({ where: { slug: params.city } })
    if (!city) notFound()

    const results = await prisma.carWash.groupBy({
      by: ['type'],
      where: { cityId: city.id, status: 'active', priceFrom: { gt: 0 } },
      _avg: { priceFrom: true, priceTo: true },
      _count: { id: true },
    })

    pricesByType = results.map(r => ({
      type: r.type,
      avgFrom: r._avg.priceFrom ? Math.round(r._avg.priceFrom) : null,
      avgTo: r._avg.priceTo ? Math.round(r._avg.priceTo) : null,
      count: r._count.id,
    }))
  } catch {
    // DB unavailable — fall through to defaults
  }

  if (!city) notFound()

  // Fill missing types with national defaults
  const allTypes = Object.keys(DEFAULT_PRICES)
  const presentTypes = new Set(pricesByType.map(p => p.type))
  for (const t of allTypes) {
    if (!presentTypes.has(t)) {
      pricesByType.push({
        type: t,
        avgFrom: DEFAULT_PRICES[t].from,
        avgTo: DEFAULT_PRICES[t].to,
        count: 0,
      })
    }
  }

  const FAQ = [
    { q: `Сколько стоит помыть машину в ${city.name}?`, a: `Средняя стоимость мойки в ${city.name}: самообслуживание — 80–350 ₽, ручная мойка — 400–1200 ₽, автоматическая — 500–1500 ₽, детейлинг — от 2000 ₽.` },
    { q: `Что дешевле — самообслуживание или ручная мойка?`, a: `Самообслуживание дешевле в 3–4 раза: от 80 ₽ за 5–7 минут. Ручная мойка стоит дороже (от 400 ₽), но качество выше — особенно для сложных загрязнений.` },
    { q: `Что входит в стоимость детейлинга?`, a: `Детейлинг от 2000 ₽ включает: химчистку обивки, полировку кузова, нанесение воска или керамики. Полный детейлинг может стоить 10 000–50 000 ₽ в зависимости от класса авто.` },
  ]

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-[#e94560]">Главная</Link>
        <span>›</span>
        <Link href="/avtomoyki" className="hover:text-[#e94560]">Автомойки</Link>
        <span>›</span>
        <Link href={`/avtomoyki/${params.city}`} className="hover:text-[#e94560]">{city.name}</Link>
        <span>›</span>
        <span className="text-gray-900">Цены</span>
      </nav>

      <h1 className="text-3xl font-bold mb-2">Цены на автомойку в {city.name}</h1>
      <p className="text-gray-500 mb-10">
        Актуальные средние цены по данным нашего каталога
      </p>

      {/* Price table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-8">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">Тип мойки</th>
              <th className="text-right px-5 py-3 text-sm font-semibold text-gray-600">Цена от</th>
              <th className="text-right px-5 py-3 text-sm font-semibold text-gray-600">Цена до</th>
              <th className="text-right px-5 py-3 text-sm font-semibold text-gray-600 hidden sm:table-cell">В каталоге</th>
            </tr>
          </thead>
          <tbody>
            {pricesByType.map(row => (
              <tr key={row.type} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4">
                  <Link href={`/avtomoyki/${params.city}?type=${row.type}`} className="font-medium hover:text-[#e94560] transition-colors">
                    {TYPE_LABELS[row.type] ?? row.type}
                  </Link>
                </td>
                <td className="px-5 py-4 text-right font-semibold text-green-700">
                  {row.avgFrom ? `${row.avgFrom} ₽` : '—'}
                </td>
                <td className="px-5 py-4 text-right text-gray-600">
                  {row.avgTo ? `${row.avgTo} ₽` : row.avgFrom ? `~${Math.round((row.avgFrom ?? 0) * 2)} ₽` : '—'}
                </td>
                <td className="px-5 py-4 text-right text-gray-400 text-sm hidden sm:table-cell">
                  {row.count > 0 ? `${row.count} моек` : 'средние данные'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FAQ */}
      <div className="space-y-3 mb-10">
        {FAQ.map(({ q, a }) => (
          <details key={q} className="group bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <summary className="flex justify-between items-center px-6 py-4 cursor-pointer font-semibold text-gray-900 hover:text-[#e94560] transition-colors list-none">
              {q}
              <span className="ml-4 flex-shrink-0 text-gray-400 group-open:rotate-180 transition-transform text-xl leading-none">›</span>
            </summary>
            <p className="px-6 pb-4 text-gray-600 text-sm leading-relaxed">{a}</p>
          </details>
        ))}
      </div>

      {/* CTA */}
      <div className="flex flex-wrap gap-4">
        <Link
          href={`/avtomoyki/${params.city}`}
          className="px-6 py-3 bg-[#e94560] text-white rounded-xl font-semibold hover:bg-[#c73652] transition-colors text-sm"
        >
          Найти мойку в {city.name}
        </Link>
        <Link
          href="/tools/roi-calculator"
          className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-sm"
        >
          Калькулятор ROI
        </Link>
      </div>
    </main>
  )
}
