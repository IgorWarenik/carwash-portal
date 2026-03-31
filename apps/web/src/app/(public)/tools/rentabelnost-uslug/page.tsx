import type { Metadata } from 'next'
import Link from 'next/link'
import { RentabelnostUslugClient } from './RentabelnostUslugClient'

export const metadata: Metadata = {
  title: 'Рентабельность услуг автомойки — что приносит больше прибыли',
  description: 'Сравните маржинальность разных услуг: мойка, полировка, химчистка, воск. Узнайте, на каких услугах вы реально зарабатываете.',
  alternates: { canonical: '/tools/rentabelnost-uslug' },
}

export default function RentabelnostUslugPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-[#e94560]">Главная</Link>
        <span>›</span>
        <Link href="/tools" className="hover:text-[#e94560]">Калькуляторы</Link>
        <span>›</span>
        <span className="text-gray-900">Рентабельность услуг</span>
      </nav>
      <h1 className="text-3xl font-bold mb-3">Рентабельность услуг автомойки</h1>
      <p className="text-gray-500 mb-10 max-w-2xl">
        Введите параметры каждой услуги — калькулятор покажет маржу, рейтинг прибыльности и какие услуги тянут бизнес вниз.
      </p>
      <RentabelnostUslugClient />
    </main>
  )
}
