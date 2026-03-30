import type { Metadata } from 'next'
import Link from 'next/link'
import { LeadFormFranchise } from '@/components/LeadFormFranchise'

export const metadata: Metadata = {
  title: 'Купить франшизу автомойки — заявка и консультация',
  description: 'Подайте заявку на покупку франшизы автомойки. 6 проверенных франшиз от 470 тыс. ₽. Бесплатная консультация.',
}

export default function BuyFranchisePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-[#e94560]">Главная</Link>
        <span>›</span>
        <Link href="/franshizy" className="hover:text-[#e94560]">Франшизы</Link>
        <span>›</span>
        <span>Получить предложение</span>
      </nav>

      <h1 className="text-3xl font-bold mb-3">Получить предложение по франшизе</h1>
      <p className="text-gray-500 mb-10">
        Оставьте заявку — подберём франшизу под ваш бюджет и регион. Консультация бесплатна.
      </p>

      <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-10">
        <LeadFormFranchise />
      </div>

      <Link href="/franshizy" className="flex items-center gap-2 text-[#e94560] font-semibold hover:underline">
        ← Вернуться к сравнению франшиз
      </Link>
    </main>
  )
}
