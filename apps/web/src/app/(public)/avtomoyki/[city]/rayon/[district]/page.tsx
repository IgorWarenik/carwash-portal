import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@carwash/db'

interface Props { params: { city: string; district: string } }

export const revalidate = 3600

function decodeDistrict(raw: string): string {
  // URL: mitino → "Митино", severnyy-okrug → "Северный округ"
  return decodeURIComponent(raw).replace(/-/g, ' ')
}

const TYPE_LABELS: Record<string, string> = {
  self_service: 'Самообслуживание',
  automatic: 'Автоматическая',
  manual: 'Ручная',
  detailing: 'Детейлинг',
  truck: 'Для грузовых',
}

export async function generateStaticParams() {
  try {
    const rows = await prisma.carWash.findMany({
      where: { status: 'active', district: { not: null } },
      select: { district: true, city: { select: { slug: true } } },
      distinct: ['district', 'cityId'],
    })
    return rows
      .filter(r => r.district)
      .map(r => ({
        city: r.city.slug,
        district: r.district!.toLowerCase().replace(/\s+/g, '-'),
      }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = await prisma.city.findUnique({ where: { slug: params.city } }).catch(() => null)
  if (!city) return {}
  const district = decodeDistrict(params.district)
  return {
    title: `Автомойки в районе ${district}, ${city.name} — каталог и цены`,
    description: `Найдите автомойку в районе ${district} города ${city.name}. Адреса, цены, режим работы, отзывы.`,
    alternates: { canonical: `/avtomoyki/${params.city}/rayon/${params.district}` },
  }
}

export default async function DistrictPage({ params }: Props) {
  const city = await prisma.city.findUnique({ where: { slug: params.city } }).catch(() => null)
  if (!city) notFound()

  const districtName = decodeDistrict(params.district)

  const carwashes = await prisma.carWash.findMany({
    where: {
      cityId: city.id,
      status: 'active',
      district: { equals: districtName, mode: 'insensitive' },
    },
    orderBy: [{ featured: 'desc' }, { rating: 'desc' }],
    take: 20,
  })

  if (carwashes.length === 0) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Автомойки в районе ${districtName}, ${city.name}`,
    numberOfItems: carwashes.length,
    itemListElement: carwashes.map((cw, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'LocalBusiness',
        name: cw.name,
        address: { '@type': 'PostalAddress', streetAddress: cw.address, addressLocality: city.name },
        telephone: cw.phone,
      },
    })),
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-[#e94560]">Главная</Link>
        <span>›</span>
        <Link href="/avtomoyki" className="hover:text-[#e94560]">Автомойки</Link>
        <span>›</span>
        <Link href={`/avtomoyki/${params.city}`} className="hover:text-[#e94560]">{city.name}</Link>
        <span>›</span>
        <span className="text-gray-900">Район {districtName}</span>
      </nav>

      <h1 className="text-3xl font-bold mb-2">
        Автомойки в районе {districtName}, {city.name}
      </h1>
      <p className="text-gray-500 mb-8">
        {carwashes.length} {carwashes.length === 1 ? 'мойка' : 'моек'} в каталоге
      </p>

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
              {cw.isOpen24h && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">24/7</span>
              )}
            </div>
            <h2 className="font-semibold text-lg mb-1 leading-tight group-hover:text-[#e94560] transition-colors">{cw.name}</h2>
            <p className="text-sm text-gray-500 mb-3 line-clamp-1">{cw.address}</p>
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
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center">
        <Link
          href={`/avtomoyki/${params.city}`}
          className="text-[#e94560] font-semibold hover:underline"
        >
          ← Все автомойки в {city.name}
        </Link>
      </div>
    </main>
  )
}
