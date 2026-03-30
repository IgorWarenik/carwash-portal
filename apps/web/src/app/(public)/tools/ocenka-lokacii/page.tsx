import type { Metadata } from 'next'
import Link from 'next/link'
import { OcenkaLokaciiClient } from './OcenkaLokaciiClient'

export const metadata: Metadata = {
  title: 'Оценка локации для автомойки — пошаговый калькулятор',
  description:
    'Оцените потенциал точки для открытия автомойки: трафик, видимость, конкуренция, коммуникации, аренда. Итоговый балл и рекомендация за 3 минуты.',
  alternates: { canonical: '/tools/ocenka-lokacii' },
}

export default function OcenkaLokaciiPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-[#e94560]">Главная</Link>
        <span>›</span>
        <Link href="/tools" className="hover:text-[#e94560]">Калькуляторы</Link>
        <span>›</span>
        <span className="text-gray-900">Оценка локации</span>
      </nav>

      <h1 className="text-3xl font-bold mb-3">Оценка локации для автомойки</h1>
      <p className="text-gray-500 mb-10 max-w-2xl">
        Пошаговый анализ точки по 5 ключевым критериям. Итоговый балл покажет,
        стоит ли открывать мойку на этом месте.
      </p>

      <OcenkaLokaciiClient />
    </main>
  )
}
