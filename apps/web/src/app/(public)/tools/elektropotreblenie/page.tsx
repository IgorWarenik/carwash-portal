import type { Metadata } from 'next'
import Link from 'next/link'
import { ElektropotreblenieClient } from './ElektropotreblenieClient'

export const metadata: Metadata = {
  title: 'Калькулятор электропотребления автомойки — стоимость кВт·ч на мойку',
  description: 'Рассчитайте потребление электроэнергии автомойкой в месяц. Сколько стоит одна мойка в кВт·ч и рублях.',
  alternates: { canonical: '/tools/elektropotreblenie' },
}

export default function ElektropotrebleniePage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-[#e94560]">Главная</Link>
        <span>›</span>
        <Link href="/tools" className="hover:text-[#e94560]">Калькуляторы</Link>
        <span>›</span>
        <span className="text-gray-900">Электропотребление</span>
      </nav>
      <h1 className="text-3xl font-bold mb-3">Электропотребление автомойки</h1>
      <p className="text-gray-500 mb-10 max-w-2xl">
        Введите оборудование и тариф — узнайте расходы на электричество в месяц и себестоимость одной мойки.
      </p>
      <ElektropotreblenieClient />
    </main>
  )
}
