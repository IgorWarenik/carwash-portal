import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@carwash/db'

interface Props { params: { city: string; 'typeslug-kruglosutochno': string } }

export const dynamic = 'force-dynamic'

const TYPE_MAP: Record<string, { db: string; label: string; labelRod: string; labelVin: string }> = {
  'samobsluzhivanie-kruglosutochno': { db: 'self_service', label: 'Самообслуживание', labelRod: 'самообслуживания', labelVin: 'самообслуживания' },
  'ruchnaya-kruglosutochno':         { db: 'manual',       label: 'Ручная мойка',     labelRod: 'ручные',          labelVin: 'ручной мойки' },
  'avtomaticheskaya-kruglosutochno': { db: 'automatic',    label: 'Автоматическая',   labelRod: 'автоматические',  labelVin: 'автоматической мойки' },
  'deteyling-kruglosutochno':        { db: 'detailing',    label: 'Детейлинг',        labelRod: 'детейлинг',       labelVin: 'детейлинга' },
  'gruzovye-kruglosutochno':         { db: 'truck',        label: 'Для грузовых',     labelRod: 'для грузовых',    labelVin: 'грузовых' },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params['typeslug-kruglosutochno']
  const typeInfo = TYPE_MAP[slug]
  if (!typeInfo) return {}
  const city = await prisma.city.findUnique({ where: { slug: params.city } }).catch(() => null)
  if (!city) return {}
  return {
    title: `Мойка ${typeInfo.labelVin} круглосуточно в ${city.name} — 24/7`,
    description: `Круглосуточные мойки ${typeInfo.labelRod} в ${city.name}: работают 24 часа, 7 дней в неделю. Адреса, телефоны, цены.`,
    alternates: { canonical: `/avtomoyki/${params.city}/${slug}` },
  }
}

export default async function TypeKruglosutochnoPage({ params }: Props) {
  const slug = params['typeslug-kruglosutochno']
  const typeInfo = TYPE_MAP[slug]
  if (!typeInfo) notFound()

  const city = await prisma.city.findUnique({ where: { slug: params.city } }).catch(() => null)
  if (!city) notFound()

  const carwashes = await prisma.carWash.findMany({
    where: { cityId: city.id, status: 'active', type: typeInfo.db as any, isOpen24h: true },
    orderBy: [{ featured: 'desc' }, { rating: 'desc' }, { reviewCount: 'desc' }],
  })

  if (carwashes.length === 0) notFound()

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная',     item: 'https://www.businessmoyka.ru/' },
      { '@type': 'ListItem', position: 2, name: 'Автомойки',   item: 'https://www.businessmoyka.ru/avtomoyki' },
      { '@type': 'ListItem', position: 3, name: city.name,     item: `https://www.businessmoyka.ru/avtomoyki/${params.city}` },
      { '@type': 'ListItem', position: 4, name: `${typeInfo.label} 24/7`, item: `https://www.businessmoyka.ru/avtomoyki/${params.city}/${slug}` },
    ],
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Есть ли мойки ${typeInfo.labelRod} в ${city.name}, которые работают ночью?`,
        acceptedAnswer: { '@type': 'Answer', text: `Да, в ${city.name} работает ${carwashes.length} круглосуточных ${carwashes.length === 1 ? 'мойка' : 'мойки'} ${typeInfo.labelRod}. Все они принимают клиентов 24/7, включая ночное время, выходные и праздники.` },
      },
      {
        '@type': 'Question',
        name: `Сколько стоит ${typeInfo.labelVin} ночью в ${city.name}?`,
        acceptedAnswer: { '@type': 'Answer', text: `Цены ночью и днём одинаковые. ${typeInfo.db === 'self_service' ? 'Мойки самообслуживания стоят от 80 до 350 ₽ за сеанс.' : 'Уточняйте цены в карточке каждой мойки.'}` },
      },
    ],
  }

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${typeInfo.label} круглосуточно в ${city.name}`,
    numberOfItems: carwashes.length,
    itemListElement: carwashes.map((cw, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'LocalBusiness',
        name: cw.name,
        address: { '@type': 'PostalAddress', streetAddress: cw.address, addressLocality: city.name },
        telephone: cw.phone,
        openingHours: 'Mo-Su 00:00-24:00',
      },
    })),
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-[#e94560]">Главная</Link>
        <span>›</span>
        <Link href="/avtomoyki" className="hover:text-[#e94560]">Автомойки</Link>
        <span>›</span>
        <Link href={`/avtomoyki/${params.city}`} className="hover:text-[#e94560]">{city.name}</Link>
        <span>›</span>
        <span className="text-gray-900">{typeInfo.label} 24/7</span>
      </nav>

      <div className="flex items-center gap-3 mb-3">
        <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 text-sm font-semibold px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse inline-block" />
          Открыты сейчас
        </span>
        <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">{typeInfo.label}</span>
      </div>

      <h1 className="text-3xl font-bold mb-2">
        Мойка {typeInfo.labelVin} круглосуточно в {city.name}
      </h1>
      <p className="text-gray-500 mb-8">
        {carwashes.length} {carwashes.length === 1 ? 'мойка' : 'моек'} — работают 24 часа, 7 дней в неделю
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {carwashes.map(cw => (
          <Link
            key={cw.id}
            href={`/avtomoyki/${params.city}/${cw.slug}`}
            className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-[#e94560] hover:shadow-md transition-all flex flex-col group"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{typeInfo.label}</span>
              <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full">24/7</span>
            </div>
            <h2 className="font-semibold text-lg mb-1 leading-tight group-hover:text-[#e94560] transition-colors">{cw.name}</h2>
            <p className="text-sm text-gray-500 mb-3">{cw.address}</p>
            <div className="mt-auto space-y-1.5 text-sm">
              {cw.rating !== null && cw.rating > 0 && (
                <div className="flex items-center gap-1 text-yellow-500">
                  <span>★</span>
                  <span className="font-medium text-gray-900">{cw.rating.toFixed(1)}</span>
                  <span className="text-gray-400">({cw.reviewCount})</span>
                </div>
              )}
              {cw.priceFrom && (
                <p className="text-gray-600">от <span className="font-semibold">{cw.priceFrom} ₽</span></p>
              )}
              {cw.phone && <p className="text-[#e94560] font-medium">{cw.phone}</p>}
            </div>
            <div className="mt-3 text-sm font-semibold text-[#e94560] group-hover:underline">Подробнее →</div>
          </Link>
        ))}
      </div>

      {/* FAQ */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-5">Частые вопросы</h2>
        <div className="space-y-3">
          {[
            { q: `Есть ли мойки ${typeInfo.labelRod} в ${city.name}, которые работают ночью?`, a: `Да, в ${city.name} работает ${carwashes.length} круглосуточных ${carwashes.length === 1 ? 'мойка' : 'мойки'} ${typeInfo.labelRod}. Все принимают клиентов 24/7, включая ночь и праздники.` },
            { q: `Сколько стоит ${typeInfo.labelVin} ночью в ${city.name}?`, a: `Цены ночью и днём одинаковые. ${typeInfo.db === 'self_service' ? 'Мойки самообслуживания — от 80 до 350 ₽ за сеанс.' : 'Уточняйте стоимость в карточке конкретной мойки.'}` },
          ].map(item => (
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

      <div className="flex flex-wrap gap-4">
        <Link href={`/avtomoyki/${params.city}/kruglosutochno`} className="px-6 py-3 bg-[#e94560] text-white rounded-xl font-semibold hover:bg-[#c73652] transition-colors text-sm">
          Все 24/7 в {city.name}
        </Link>
        <Link href={`/avtomoyki/${params.city}/${slug.replace('-kruglosutochno', '')}`} className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-sm">
          Все {typeInfo.labelRod} →
        </Link>
        <Link href={`/avtomoyki/${params.city}`} className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-sm">
          Все мойки →
        </Link>
      </div>
    </main>
  )
}
