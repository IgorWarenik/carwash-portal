import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '404 — страница не найдена',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-7xl font-bold text-[#e94560] mb-4">404</div>
        <h1 className="text-2xl font-bold mb-3">Страница не найдена</h1>
        <p className="text-gray-500 mb-8">
          К сожалению, эта страница больше не существует или была перемещена.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="px-6 py-3 bg-[#e94560] text-white rounded-xl font-semibold hover:bg-[#c73652] transition-colors"
          >
            На главную
          </Link>
          <Link
            href="/avtomoyki"
            className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Каталог моек
          </Link>
        </div>
        <div className="mt-8 text-sm text-gray-400">
          Популярные разделы:{' '}
          <Link href="/tools" className="text-[#e94560] hover:underline">Калькуляторы</Link>
          {' · '}
          <Link href="/franshizy" className="text-[#e94560] hover:underline">Франшизы</Link>
          {' · '}
          <Link href="/blog" className="text-[#e94560] hover:underline">Журнал</Link>
        </div>
      </div>
    </main>
  )
}
