import type { Metadata } from 'next'
import Link from 'next/link'
import { ProgrammaLoyalnostiClient } from './ProgrammaLoyalnostiClient'

export const metadata: Metadata = {
  title: 'Калькулятор программы лояльности — абонемент или разовые визиты',
  description: 'Абонемент или скидочная карта? Калькулятор покажет, какая программа лояльности выгоднее для вашей автомойки.',
  alternates: { canonical: '/tools/programma-loyalnosti' },
}

export default function ProgrammaLoyalnostiPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-[#e94560]">Главная</Link>
        <span>›</span>
        <Link href="/tools" className="hover:text-[#e94560]">Калькуляторы</Link>
        <span>›</span>
        <span className="text-gray-900">Программа лояльности</span>
      </nav>
      <h1 className="text-3xl font-bold mb-3">Программа лояльности: что выгоднее</h1>
      <p className="text-gray-500 mb-10 max-w-2xl">
        Сравните абонемент, скидочную карту и обычные разовые визиты. Какая схема принесёт больше денег именно вашей мойке?
      </p>
      <ProgrammaLoyalnostiClient />
    </main>
  )
}
