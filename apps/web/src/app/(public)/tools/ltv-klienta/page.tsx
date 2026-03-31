import type { Metadata } from 'next'
import Link from 'next/link'
import { LtvKlientaClient } from './LtvKlientaClient'

export const metadata: Metadata = {
  title: 'Калькулятор LTV клиента автомойки — сколько стоит постоянный клиент',
  description: 'Рассчитайте пожизненную ценность клиента (LTV) для вашей автомойки. Сколько можно тратить на рекламу и удержание.',
  alternates: { canonical: '/tools/ltv-klienta' },
}

export default function LtvKlientaPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-[#e94560]">Главная</Link>
        <span>›</span>
        <Link href="/tools" className="hover:text-[#e94560]">Калькуляторы</Link>
        <span>›</span>
        <span className="text-gray-900">LTV клиента</span>
      </nav>
      <h1 className="text-3xl font-bold mb-3">LTV клиента автомойки</h1>
      <p className="text-gray-500 mb-10 max-w-2xl">
        Пожизненная ценность клиента (Lifetime Value) — сколько денег приносит один постоянный посетитель и сколько можно потратить на его привлечение.
      </p>
      <LtvKlientaClient />
    </main>
  )
}
