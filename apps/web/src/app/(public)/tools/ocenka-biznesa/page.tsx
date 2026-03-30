import type { Metadata } from 'next'
import Link from 'next/link'
import { OcenkaBiznesaClient } from './OcenkaBiznesaClient'

export const metadata: Metadata = {
  title: 'Оценка стоимости автомойки — калькулятор по EBITDA',
  description:
    'Бесплатный калькулятор рыночной стоимости автомойки. Методика EBITDA-мультипликатора: введите финансовые показатели и узнайте цену бизнеса за 2 минуты.',
  alternates: { canonical: '/tools/ocenka-biznesa' },
}

export default function OcenkaBiznesaPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-[#e94560]">Главная</Link>
        <span>›</span>
        <Link href="/tools" className="hover:text-[#e94560]">Калькуляторы</Link>
        <span>›</span>
        <span className="text-gray-900">Оценка бизнеса</span>
      </nav>

      <h1 className="text-3xl font-bold mb-3">Оценка стоимости автомойки</h1>
      <p className="text-gray-500 mb-10 max-w-2xl">
        Рыночная стоимость по методике EBITDA-мультипликатора — той же, что используют профессиональные оценщики.
        Введите финансовые показатели и получите диапазон цен за 2 минуты.
      </p>

      <OcenkaBiznesaClient />
    </main>
  )
}
