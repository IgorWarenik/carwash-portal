import type { Metadata } from 'next'
import { prisma } from '@carwash/db'

export const metadata: Metadata = { title: 'Лиды' }
export const dynamic = 'force-dynamic'

const LEAD_TYPE_LABELS: Record<string, string> = {
  BUY: 'Купить',
  SELL: 'Продать',
  OPEN: 'Открыть',
  SUPPLIER: 'Поставщик',
  FRANCHISE: 'Франшиза',
  GENERAL: 'Общий',
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  qualified: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-500',
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: { type?: string; status?: string; page?: string }
}) {
  const page = Math.max(1, Number(searchParams.page ?? 1))
  const pageSize = 50
  const where = {
    ...(searchParams.type ? { leadType: searchParams.type as never } : {}),
    ...(searchParams.status ? { status: searchParams.status } : {}),
  }

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: pageSize,
      skip: (page - 1) * pageSize,
    }),
    prisma.lead.count({ where }),
  ])

  const totalPages = Math.ceil(total / pageSize)

  // Stats
  const stats = await prisma.lead.groupBy({
    by: ['leadType'],
    _count: { _all: true },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Лиды</h1>
        <span className="text-sm text-gray-500">{total} всего</span>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-3 mb-6">
        {stats.map(s => (
          <a
            key={s.leadType}
            href={`/admin/leads?type=${s.leadType}`}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${searchParams.type === s.leadType ? 'bg-[#e94560] text-white border-[#e94560]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#e94560]'}`}
          >
            {LEAD_TYPE_LABELS[s.leadType] ?? s.leadType} ({s._count._all})
          </a>
        ))}
        {searchParams.type && (
          <a href="/admin/leads" className="px-3 py-1.5 rounded-full text-xs font-medium border border-gray-200 text-gray-500 hover:border-[#e94560]">
            Все
          </a>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-500">Дата</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Тип</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Имя</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Телефон</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Email</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Сообщение</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Статус</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Город</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-400">Лидов нет</td>
                </tr>
              ) : leads.map(lead => (
                <tr key={lead.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    {new Date(lead.createdAt).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {LEAD_TYPE_LABELS[lead.leadType] ?? lead.leadType}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{lead.name ?? '—'}</td>
                  <td className="px-4 py-3">
                    {lead.phone ? (
                      <a href={`tel:${lead.phone}`} className="text-[#e94560] hover:underline font-medium">{lead.phone}</a>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{lead.email ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{lead.message ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[lead.status] ?? 'bg-gray-100 text-gray-500'}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{lead.city ?? '—'}</td>
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
                <a href={`/admin/leads?page=${page - 1}${searchParams.type ? `&type=${searchParams.type}` : ''}`}
                  className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 hover:border-[#e94560] transition-colors">
                  ← Назад
                </a>
              )}
              {page < totalPages && (
                <a href={`/admin/leads?page=${page + 1}${searchParams.type ? `&type=${searchParams.type}` : ''}`}
                  className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 hover:border-[#e94560] transition-colors">
                  Вперёд →
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
