import type { Metadata } from 'next'
import Link from 'next/link'
import { OptimalnyShtatClient } from './OptimalnyShtatClient'

export const metadata: Metadata = {
  title: 'Калькулятор штата автомойки — сколько мойщиков нужно',
  description: 'Рассчитайте оптимальное количество сотрудников на смену исходя из трафика. Сменный график, загрузка постов, ФОТ.',
  alternates: { canonical: '/tools/optimalny-shtat' },
}

export default function OptimalnyShtatPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-[#e94560]">Главная</Link>
        <span>›</span>
        <Link href="/tools" className="hover:text-[#e94560]">Калькуляторы</Link>
        <span>›</span>
        <span className="text-gray-900">Оптимальный штат</span>
      </nav>
      <h1 className="text-3xl font-bold mb-3">Оптимальный штат автомойки</h1>
      <p className="text-gray-500 mb-10 max-w-2xl">
        Сколько мойщиков нужно при вашем трафике? Калькулятор покажет загрузку постов, оптимальный график и итоговый ФОТ.
      </p>
      <OptimalnyShtatClient />
    </main>
  )
}
