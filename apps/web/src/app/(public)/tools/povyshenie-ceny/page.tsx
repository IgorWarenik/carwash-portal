import type { Metadata } from 'next'
import Link from 'next/link'
import { PovyshenieCenyClient } from './PovyshenieCenyClient'

export const metadata: Metadata = {
  title: 'Калькулятор повышения цен — сколько клиентов можно потерять',
  description: 'Поднимаете цены на автомойке? Калькулятор покажет, какой отток клиентов вы можете себе позволить и при каком тарифе прибыль будет максимальной.',
  alternates: { canonical: '/tools/povyshenie-ceny' },
}

export default function PovyshenieCenyPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-[#e94560]">Главная</Link>
        <span>›</span>
        <Link href="/tools" className="hover:text-[#e94560]">Калькуляторы</Link>
        <span>›</span>
        <span className="text-gray-900">Повышение цены</span>
      </nav>
      <h1 className="text-3xl font-bold mb-3">Повышение цен: когда это выгодно</h1>
      <p className="text-gray-500 mb-10 max-w-2xl">
        Введите текущие показатели и новый тариф — калькулятор покажет, сколько клиентов можно потерять без потери прибыли.
      </p>
      <PovyshenieCenyClient />
    </main>
  )
}
