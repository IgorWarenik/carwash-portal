import type { Metadata } from 'next'
import Link from 'next/link'
import { RaskhodKhimiiClient } from './RaskhodKhimiiClient'

export const metadata: Metadata = {
  title: 'Калькулятор расхода химии для автомойки — закупка на месяц',
  description: 'Рассчитайте расход шампуня, воска, активной пены и других химикатов. Сколько закупать и во сколько это обойдётся.',
  alternates: { canonical: '/tools/raskhod-khimii' },
}

export default function RaskhodKhimiiPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-[#e94560]">Главная</Link>
        <span>›</span>
        <Link href="/tools" className="hover:text-[#e94560]">Калькуляторы</Link>
        <span>›</span>
        <span className="text-gray-900">Расход химии</span>
      </nav>
      <h1 className="text-3xl font-bold mb-3">Расход химии и планирование закупки</h1>
      <p className="text-gray-500 mb-10 max-w-2xl">
        Введите трафик и нормы расхода — получите точный бюджет на химию и рекомендуемый запас.
      </p>
      <RaskhodKhimiiClient />
    </main>
  )
}
