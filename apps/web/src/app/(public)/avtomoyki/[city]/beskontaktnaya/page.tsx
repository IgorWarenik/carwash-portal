import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@carwash/db'

interface Props { params: { city: string } }

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = await prisma.city.findUnique({ where: { slug: params.city } }).catch(() => null)
  if (!city) return {}
  return {
    title: `Бесконтактная автомойка в ${city.name} — адреса, цены, отзывы`,
    description: `Бесконтактная мойка автомобиля в ${city.name}: без щёток, без царапин. Самообслуживание и автоматические мойки. Адреса, цены от 80 ₽, режим работы.`,
    alternates: { canonical: `/avtomoyki/${params.city}/beskontaktnaya` },
  }
}

const TYPE_LABELS: Record<string, string> = {
  self_service: 'Самообслуживание',
  automatic: 'Автоматическая',
  manual: 'Ручная',
  detailing: 'Детейлинг',
  truck: 'Для грузовых',
}

export default async function BeskontaktPage({ params }: Props) {
  const city = await prisma.city.findUnique({ where: { slug: params.city } }).catch(() => null)
  if (!city) notFound()

  // Contactless = self_service (pressure washers, no brushes) + automatic (touchless tunnel)
  const [selfService, automatic] = await Promise.all([
    prisma.carWash.findMany({
      where: { cityId: city.id, status: 'active', type: 'self_service' },
      orderBy: [{ featured: 'desc' }, { rating: 'desc' }, { reviewCount: 'desc' }],
      take: 12,
    }),
    prisma.carWash.findMany({
      where: { cityId: city.id, status: 'active', type: 'automatic' },
      orderBy: [{ featured: 'desc' }, { rating: 'desc' }],
      take: 6,
    }),
  ])

  const carwashes = [...selfService, ...automatic]
  if (carwashes.length === 0) notFound()

  const [selfBench, autoBench] = await Promise.all([
    prisma.benchmark.findFirst({
      where: { metric: 'avg_check', carwashType: 'self_service', OR: [{ city: params.city }, { city: null }] },
      orderBy: { city: 'desc' },
    }).catch(() => null),
    prisma.benchmark.findFirst({
      where: { metric: 'avg_check', carwashType: 'automatic', OR: [{ city: params.city }, { city: null }] },
      orderBy: { city: 'desc' },
    }).catch(() => null),
  ])

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная',   item: 'https://www.businessmoyka.ru/' },
      { '@type': 'ListItem', position: 2, name: 'Автомойки', item: 'https://www.businessmoyka.ru/avtomoyki' },
      { '@type': 'ListItem', position: 3, name: city.name,   item: `https://www.businessmoyka.ru/avtomoyki/${params.city}` },
      { '@type': 'ListItem', position: 4, name: 'Бесконтактная мойка', item: `https://www.businessmoyka.ru/avtomoyki/${params.city}/beskontaktnaya` },
    ],
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Что такое бесконтактная мойка?',
        acceptedAnswer: { '@type': 'Answer', text: 'Бесконтактная мойка — мойка автомобиля без щёток и губок. Загрязнения удаляются напором воды и химией. Не царапает лакокрасочное покрытие. Виды: мойка самообслуживания (пистолет высокого давления) и бесконтактная автоматическая (тоннельная без щёток).' },
      },
      {
        '@type': 'Question',
        name: `Сколько стоит бесконтактная мойка в ${city.name}?`,
        acceptedAnswer: { '@type': 'Answer', text: `Самообслуживание в ${city.name} — ${selfBench ? `от ${Math.round(selfBench.value * 0.5)} до ${Math.round(selfBench.value * 1.5)} ₽` : 'от 80 до 350 ₽'} за сеанс. Автоматическая бесконтактная — ${autoBench ? `от ${Math.round(autoBench.value * 0.7)} ₽` : 'от 400 ₽'}.` },
      },
      {
        '@type': 'Question',
        name: 'Бесконтактная мойка хуже щёточной?',
        acceptedAnswer: { '@type': 'Answer', text: 'Бесконтактная мойка безопаснее для покрытия — нет риска царапин от щёток. При этом сильные загрязнения (глина, битум) удаляет хуже. Для регулярной мойки — бесконтактная предпочтительнее.' },
      },
      {
        '@type': 'Question',
        name: 'Мойка самообслуживания — это бесконтактная?',
        acceptedAnswer: { '@type': 'Answer', text: 'Да, мойки самообслуживания полностью бесконтактные — используется пистолет высокого давления и пенная химия без любого механического контакта. Это самый доступный вариант бесконтактной мойки — от 80 ₽.' },
      },
    ],
  }

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Бесконтактные автомойки ${city.name}`,
    numberOfItems: carwashes.length,
    itemListElement: carwashes.map((cw, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'LocalBusiness',
        name: cw.name,
        address: { '@type': 'PostalAddress', streetAddress: cw.address, addressLocality: city.name },
        telephone: cw.phone,
        ...(cw.rating && cw.rating > 0 ? {
          aggregateRating: { '@type': 'AggregateRating', ratingValue: cw.rating, reviewCount: cw.reviewCount },
        } : {}),
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
        <span className="text-gray-900">Бесконтактная</span>
      </nav>

      <h1 className="text-3xl font-bold mb-2">
        Бесконтактная автомойка в {city.name}
      </h1>
      <p className="text-gray-500 mb-6">
        {carwashes.length} моек — без щёток, без царапин, только вода и химия
      </p>

      {/* Explainer strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
          <div className="font-semibold text-blue-900 mb-1">🚿 Самообслуживание</div>
          <div className="text-sm text-blue-700 mb-2">Пистолет высокого давления, без щёток</div>
          <div className="text-lg font-bold text-blue-900">
            {selfBench ? `от ${Math.round(selfBench.value * 0.5)} ₽` : 'от 80 ₽'}
          </div>
          <div className="text-xs text-blue-500 mt-1">{selfService.length} моек в каталоге</div>
        </div>
        <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5">
          <div className="font-semibold text-purple-900 mb-1">🤖 Автоматическая</div>
          <div className="text-sm text-purple-700 mb-2">Тоннельная без щёток, за 5 минут</div>
          <div className="text-lg font-bold text-purple-900">
            {autoBench ? `от ${Math.round(autoBench.value * 0.7)} ₽` : 'от 400 ₽'}
          </div>
          <div className="text-xs text-purple-500 mt-1">{automatic.length} моек в каталоге</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-8">
        <Link href={`/avtomoyki/${params.city}/samobsluzhivanie`}
          className="px-4 py-2 bg-gray-100 text-gray-600 hover:bg-[#e94560] hover:text-white rounded-full text-sm font-medium transition-colors">
          Только самообслуживание
        </Link>
        <Link href={`/avtomoyki/${params.city}/avtomaticheskaya`}
          className="px-4 py-2 bg-gray-100 text-gray-600 hover:bg-[#e94560] hover:text-white rounded-full text-sm font-medium transition-colors">
          Только автоматические
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {carwashes.map(cw => (
          <Link
            key={cw.id}
            href={`/avtomoyki/${params.city}/${cw.slug}`}
            className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-[#e94560] hover:shadow-md transition-all flex flex-col group"
          >
            <div className="flex items-start justify-between mb-3">
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                cw.type === 'automatic' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
              }`}>
                {TYPE_LABELS[cw.type]}
              </span>
              <span className="text-xs font-semibold bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                Бесконтактная
              </span>
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
              {cw.isOpen24h && <p className="text-green-600 font-medium text-xs">24/7</p>}
            </div>
            <div className="mt-3 text-sm font-semibold text-[#e94560] group-hover:underline">Подробнее →</div>
          </Link>
        ))}
      </div>

      {/* FAQ */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-5">Частые вопросы о бесконтактной мойке</h2>
        <div className="space-y-3">
          {[
            { q: 'Что такое бесконтактная мойка?', a: 'Мойка без щёток и губок — напором воды и химией. Не царапает покрытие. Виды: самообслуживание (пистолет высокого давления) и автоматическая тоннельная без щёток.' },
            { q: `Сколько стоит бесконтактная мойка в ${city.name}?`, a: `Самообслуживание — ${selfBench ? `от ${Math.round(selfBench.value * 0.5)} ₽` : 'от 80 ₽'}. Автоматическая — ${autoBench ? `от ${Math.round(autoBench.value * 0.7)} ₽` : 'от 400 ₽'}.` },
            { q: 'Бесконтактная мойка хуже щёточной?', a: 'Безопаснее для покрытия — нет царапин. Сильные загрязнения (битум, глина) удаляет хуже. Для регулярной мойки — оптимальный выбор.' },
            { q: 'Мойка самообслуживания — это бесконтактная?', a: 'Да. Пистолет высокого давления + пенная химия — полностью бесконтактная технология. Самый доступный вариант: от 80 ₽.' },
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
          Круглосуточные →
        </Link>
        <Link href={`/avtomoyki/${params.city}/rejting`} className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-sm">
          Рейтинг →
        </Link>
        <Link href={`/avtomoyki/${params.city}/ceny`} className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-sm">
          Цены →
        </Link>
      </div>
    </main>
  )
}
