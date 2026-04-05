import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@carwash/db'

export const metadata: Metadata = { title: 'Мойки' }
export const dynamic = 'force-dynamic'

const TYPE_LABELS: Record<string, string> = {
  self_service: 'Самообслуживание',
  automatic: 'Автоматическая',
  manual: 'Ручная',
  detailing: 'Детейлинг',
  truck: 'Грузовые',
}

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  pending_review: 'bg-yellow-100 text-yellow-700',
  draft: 'bg-gray-100 text-gray-500',
  archived: 'bg-red-100 text-red-500',
}

export default async function CarwashesPage({
  searchParams,
}: {
  searchParams: { status?: string; city?: string; page?: string }
}) {
  const page = Math.max(1, Number(searchParams.page ?? 1))
  const pageSize = 50
  const where = {
    ...(searchParams.status ? { status: searchParams.status as never } : {}),
    ...(searchParams.city ? { city: { slug: searchParams.city } } : {}),
  }

  const [carwashes, total] = await Promise.all([
    prisma.carWash.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: pageSize,
      skip: (page - 1) * pageSize,
      select: {
        id: true, name: true, slug: true, type: true, status: true,
        address: true, rating: true, reviewCount: true, featured: true,
        claimedByOwner: true,
        city: { select: { name: true, slug: true } },
        createdAt: true,
      },
    }),
    prisma.carWash.count({ where }),
  ])

  const totalPages = Math.ceil(total / pageSize)

  const statusCounts = await prisma.carWash.groupBy({
    by: ['status'],
    _count: { _all: true },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Мойки</h1>
        <span className="text-sm text-gray-500">{total} всего</span>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        {statusCounts.map(s => (
          <a
            key={s.status}
            href={`/admin/carwashes?status=${s.status}`}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${searchParams.status === s.status ? 'bg-[#e94560] text-white border-[#e94560]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#e94560]'}`}
          >
            {s.status} ({s._count._all})
          </a>
        ))}
        {searchParams.status && (
          <a href="/admin/carwashes" className="px-3 py-1.5 rounded-full text-xs font-medium border border-gray-200 text-gray-500 hover:border-[#e94560]">Все</a>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-500">Название</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Тип</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Город</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Рейтинг</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Статус</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Флаги</th>
              </tr>
            </thead>
            <tbody>
              {carwashes.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">Нет данных</td></tr>
              ) : carwashes.map(cw => (
                <tr key={cw.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      href={`/avtomoyki/${cw.city.slug}/${cw.slug}`}
                      target="_blank"
                      className="font-medium text-gray-900 hover:text-[#e94560] transition-colors"
                    >
                      {cw.name}
                    </Link>
                    <p className="text-xs text-gray-400 mt-0.5">{cw.address}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {TYPE_LABELS[cw.type] ?? cw.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{cw.city.name}</td>
                  <td className="px-4 py-3">
                    {cw.rating && cw.rating > 0 ? (
                      <span className="text-yellow-600 font-medium">★ {cw.rating.toFixed(1)} <span className="text-gray-400 font-normal">({cw.reviewCount})</span></span>
                    ) : <span className="text-gray-400">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[cw.status] ?? 'bg-gray-100 text-gray-500'}`}>
                      {cw.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-1 flex-wrap">
                    {cw.featured && <span className="text-xs bg-[#e94560]/10 text-[#e94560] px-2 py-0.5 rounded-full">Топ</span>}
                    {cw.claimedByOwner && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">✓ Владелец</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <span className="text-sm text-gray-500">Страница {page} из {totalPages}</span>
            <div className="flex gap-2">
              {page > 1 && (
                <a href={`/admin/carwashes?page=${page - 1}${searchParams.status ? `&status=${searchParams.status}` : ''}`}
                  className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 hover:border-[#e94560]">← Назад</a>
              )}
              {page < totalPages && (
                <a href={`/admin/carwashes?page=${page + 1}${searchParams.status ? `&status=${searchParams.status}` : ''}`}
                  className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 hover:border-[#e94560]">Вперёд →</a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
