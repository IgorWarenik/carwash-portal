import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@carwash/db'

interface Props { params: { city: string } }

export const dynamic = 'force-dynamic'

const TYPE_LABELS: Record<string, string> = {
  self_service: 'Самообслуживание',
  automatic: 'Автоматическая',
  manual: 'Ручная',
  detailing: 'Детейлинг',
  truck: 'Для грузовых',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = await prisma.city.findUnique({ where: { slug: params.city } }).catch(() => null)
  if (!city) return {}
  return {
    title: `Автомойки круглосуточно в ${city.name} — работают 24/7`,
    description: `Круглосуточные автомойки в ${city.name}: адреса, телефоны, цены. Работают 24 часа 7 дней в неделю — ночью, в выходные и праздники.`,
    alternates: { canonical: `/avtomoyki/${params.city}/kruglosutochno` },
  }
}

export default async function KruglosutochnoPage({ params }: Props) {
  const city = await prisma.city.findUnique({ where: { slug: params.city } }).catch(() => null)
  if (!city) notFound()

  const carwashes = await prisma.carWash.findMany({
    where: { cityId: city.id, status: 'active', isOpen24h: true },
    orderBy: [{ featured: 'desc' }, { rating: 'desc' }, { reviewCount: 'desc' }],
  })

  if (carwashes.length === 0) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Круглосуточные автомойки в ${city.name}`,
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

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://www.businessmoyka.ru/' },
      { '@type': 'ListItem', position: 2, name: 'Автомойки', item: 'https://www.businessmoyka.ru/avtomoyki' },
      { '@type': 'ListItem', position: 3, name: city.name, item: `https://www.businessmoyka.ru/avtomoyki/${params.city}` },
      { '@type': 'ListItem', position: 4, name: 'Круглосуточно', item: `https://www.businessmoyka.ru/avtomoyki/${params.city}/kruglosutochno` },
    ],
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Есть ли автомойки в ${city.name}, которые работают ночью?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Да, в ${city.name} работает ${carwashes.length} круглосуточных автомоек. Большинство из них — мойки самообслуживания, которые не требуют персонала и доступны 24/7.`,
        },
      },
      {
        '@type': 'Question',
        name: `Сколько стоит помыть машину ночью в ${city.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Ночные и дневные цены на автомойках самообслуживания одинаковы — от 80 до 350 ₽. Некоторые ручные мойки могут применять ночной тариф.`,
        },
      },
      {
        '@type': 'Question',
        name: `Почему мойки самообслуживания работают круглосуточно?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Мойки самообслуживания автоматизированы: оплата через терминал, никаких мойщиков. Это позволяет работать 24/7 без дополнительных затрат на персонал.`,
        },
      },
    ],
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-[#e94560]">Главная</Link>
        <span>›</span>
        <Link href="/avtomoyki" className="hover:text-[#e94560]">Автомойки</Link>
        <span>›</span>
        <Link href={`/avtomoyki/${params.city}`} className="hover:text-[#e94560]">{city.name}</Link>
        <span>›</span>
        <span className="text-gray-900">Круглосуточно</span>
      </nav>

      <div className="flex items-center gap-3 mb-3">
        <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 text-sm font-semibold px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse inline-block" />
          Работают сейчас
        </span>
      </div>

      <h1 className="text-3xl font-bold mb-2">
        Автомойки круглосуточно в {city.name}
      </h1>
      <p className="text-gray-500 mb-8">
        {carwashes.length} {carwashes.length % 10 === 1 && carwashes.length % 100 !== 11 ? 'мойка' : 'моек'} — работают 24 часа, 7 дней в неделю
      </p>

      {/* By type */}
      <div className="flex flex-wrap gap-2 mb-8">
        {[
          { slug: 'samobsluzhivanie-kruglosutochno', label: 'Самообслуживание 24/7' },
          { slug: 'ruchnaya-kruglosutochno',         label: 'Ручная 24/7' },
          { slug: 'avtomaticheskaya-kruglosutochno', label: 'Автоматическая 24/7' },
          { slug: 'deteyling-kruglosutochno',        label: 'Детейлинг 24/7' },
        ].map(t => (
          <Link key={t.slug} href={`/avtomoyki/${params.city}/${t.slug}`}
            className="px-4 py-2 bg-gray-100 text-gray-600 hover:bg-[#e94560] hover:text-white rounded-full text-sm font-medium transition-colors">
            {t.label}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {carwashes.map(cw => (
          <Link
            key={cw.id}
            href={`/avtomoyki/${params.city}/${cw.slug}`}
            className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-[#e94560] hover:shadow-md transition-all flex flex-col group"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {TYPE_LABELS[cw.type] ?? cw.type}
              </span>
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
              {cw.phone && (
                <p className="text-[#e94560] font-medium">{cw.phone}</p>
              )}
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
            { q: `Есть ли автомойки в ${city.name}, которые работают ночью?`, a: `Да, в ${city.name} работает ${carwashes.length} круглосуточных автомоек. Большинство из них — мойки самообслуживания, доступные 24/7.` },
            { q: `Сколько стоит помыть машину ночью в ${city.name}?`, a: `Ночные и дневные цены на мойках самообслуживания одинаковы — от 80 до 350 ₽. Некоторые ручные мойки могут применять ночной тариф.` },
            { q: `Почему мойки самообслуживания работают круглосуточно?`, a: `Оплата через терминал, никаких мойщиков — это позволяет работать 24/7 без дополнительных затрат на персонал.` },
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
        <Link href={`/avtomoyki/${params.city}`} className="px-6 py-3 bg-[#e94560] text-white rounded-xl font-semibold hover:bg-[#c73652] transition-colors text-sm">
          Все мойки в {city.name}
        </Link>
        <Link href={`/avtomoyki/${params.city}/ceny`} className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-sm">
          Цены на мойку →
        </Link>
      </div>
    </main>
  )
}
