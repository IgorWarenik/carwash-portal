import type { Metadata } from 'next'
import Link from 'next/link'
import { KreditVsReinvesticiyaClient } from './KreditVsReinvesticiyaClient'

export const metadata: Metadata = {
  title: 'Кредит или реинвестиция: что выгоднее для автомойки',
  description: 'Сравните: взять кредит на расширение или копить прибыль. Калькулятор покажет переплату, срок окупаемости и финансовую выгоду каждого пути.',
  alternates: { canonical: '/tools/kredit-vs-reinvesticiya' },
}

export default function KreditVsReinvesticiyaPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-[#e94560]">Главная</Link>
        <span>›</span>
        <Link href="/tools" className="hover:text-[#e94560]">Калькуляторы</Link>
        <span>›</span>
        <span className="text-gray-900">Кредит vs реинвестиция</span>
      </nav>
      <h1 className="text-3xl font-bold mb-3">Кредит или реинвестиция прибыли?</h1>
      <p className="text-gray-500 mb-10 max-w-2xl">
        Считаете расширение мойки? Калькулятор сравнит два пути: банковский кредит и накопление из прибыли — и покажет, что выгоднее именно для вас.
      </p>
      <KreditVsReinvesticiyaClient />
    </main>
  )
}
