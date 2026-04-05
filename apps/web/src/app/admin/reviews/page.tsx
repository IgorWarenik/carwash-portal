import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@carwash/db'

export const metadata: Metadata = { title: 'Отзывы' }
export const dynamic = 'force-dynamic'

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const page = Math.max(1, Number(searchParams.page ?? 1))
  const pageSize = 50

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
      take: pageSize,
      skip: (page - 1) * pageSize,
      include: { carwash: { select: { name: true, slug: true, city: { select: { slug: true } } } } },
    }),
    prisma.review.count(),
  ])

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Отзывы</h1>
        <span className="text-sm text-gray-500">{total} всего</span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-500">Дата</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Мойка</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Автор</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Оценка</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Текст</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Источник</th>
              </tr>
            </thead>
            <tbody>
              {reviews.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">Нет отзывов</td></tr>
              ) : reviews.map(r => (
                <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    {new Date(r.createdAt).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/avtomoyki/${r.carwash.city.slug}/${r.carwash.slug}/otzyvy`}
                      target="_blank"
                      className="text-[#e94560] hover:underline font-medium"
                    >
                      {r.carwash.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{r.authorName}</td>
                  <td className="px-4 py-3">
                    <span className="text-yellow-500 font-bold">{'★'.repeat(r.rating)}</span>
                    <span className="text-gray-200">{'★'.repeat(5 - r.rating)}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 max-w-sm">
                    <p className="line-clamp-2">{r.text ?? <span className="text-gray-300 italic">без текста</span>}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{r.source ?? 'сайт'}</td>
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
                <a href={`/admin/reviews?page=${page - 1}`} className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 hover:border-[#e94560]">← Назад</a>
              )}
              {page < totalPages && (
                <a href={`/admin/reviews?page=${page + 1}`} className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 hover:border-[#e94560]">Вперёд →</a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
