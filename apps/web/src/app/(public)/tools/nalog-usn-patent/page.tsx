import type { Metadata } from 'next'
import Link from 'next/link'
import { NalogUsnPatentClient } from './NalogUsnPatentClient'

export const metadata: Metadata = {
  title: 'Калькулятор налогов: УСН 6% vs УСН 15% vs Патент для автомойки',
  description: 'Сравните налоговую нагрузку на УСН 6%, УСН 15% и патенте. Узнайте, какой режим выгоднее для вашей автомойки за 2 минуты.',
  alternates: { canonical: '/tools/nalog-usn-patent' },
}

export default function NalogUsnPatentPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-[#e94560]">Главная</Link>
        <span>›</span>
        <Link href="/tools" className="hover:text-[#e94560]">Калькуляторы</Link>
        <span>›</span>
        <span className="text-gray-900">УСН vs Патент</span>
      </nav>
      <h1 className="text-3xl font-bold mb-3">УСН 6% vs УСН 15% vs Патент</h1>
      <p className="text-gray-500 mb-10 max-w-2xl">
        Введите финансовые показатели вашей мойки — калькулятор покажет налог при каждом режиме и порекомендует оптимальный.
      </p>
      <NalogUsnPatentClient />
    </main>
  )
}
