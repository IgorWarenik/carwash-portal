import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@carwash/db'

export const metadata: Metadata = {
  title: 'Автомойки в России — каталог по городам',
  description: 'Найдите автомойку в вашем городе. Самообслуживание, ручные, автоматические, детейлинг. Адреса, рейтинги, цены.',
}

export default async function AllCitiesPage() {
  const cities = await prisma.city.findMany({
    where: { isActive: true },
    include: { _count: { select: { carwashes: { where: { status: 'active' } } } } },
    orderBy: { population: 'desc' },
  })

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">Автомойки по городам России</h1>
      <p className="text-gray-500 mb-10">
        Каталог автомоек в 10 крупнейших городах. Самообслуживание, ручные, детейлинг — с адресами и рейтингами.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {cities.map((city) => (
          <Link
            key={city.slug}
            href={`/avtomoyki/${city.slug}`}
            className="bg-white border border-gray-200 rounded-xl p-5 hover:border-[#e94560] hover:shadow-sm transition-all group"
          >
            <div className="font-semibold text-gray-900 group-hover:text-[#e94560] transition-colors text-lg">
              {city.name}
            </div>
            <div className="text-sm text-gray-400 mt-1">{city.region}</div>
            <div className="mt-3 text-sm font-medium text-[#e94560]">
              {city._count.carwashes} {city._count.carwashes === 1 ? 'мойка' : 'моек'} в каталоге
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
