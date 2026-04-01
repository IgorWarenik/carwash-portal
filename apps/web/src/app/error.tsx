'use client'

import Link from 'next/link'

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-7xl font-bold text-[#e94560] mb-4">500</div>
        <h1 className="text-2xl font-bold mb-3">Что-то пошло не так</h1>
        <p className="text-gray-500 mb-8">
          Мы уже знаем об этой ошибке и работаем над её исправлением.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={reset}
            className="px-6 py-3 bg-[#e94560] text-white rounded-xl font-semibold hover:bg-[#c73652] transition-colors"
          >
            Попробовать ещё раз
          </button>
          <Link
            href="/"
            className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            На главную
          </Link>
        </div>
      </div>
    </main>
  )
}
