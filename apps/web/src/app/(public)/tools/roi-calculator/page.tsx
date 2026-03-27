import type { Metadata } from 'next'
import { RoiCalculatorClient } from './RoiCalculatorClient'

export const metadata: Metadata = {
  title: 'Калькулятор окупаемости автомойки — ROI за 2 минуты',
  description:
    'Бесплатный калькулятор окупаемости автомойки. Введите тип мойки, количество постов, город — получите прибыль и срок возврата инвестиций.',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Калькулятор окупаемости автомойки',
  applicationCategory: 'BusinessApplication',
  description: 'Рассчитайте окупаемость автомойки самообслуживания или ручной мойки',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' },
}

export default function RoiCalculatorPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">Калькулятор окупаемости автомойки</h1>
        <p className="text-gray-500 text-lg">
          Введите параметры — получите прибыль, срок окупаемости и точку безубыточности.
          Данные основаны на реальных показателях рынка 2024–2025 гг.
        </p>
      </div>

      <RoiCalculatorClient />

      {/* FAQ */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Часто задаваемые вопросы</h2>
        <div className="space-y-4">
          {[
            {
              q: 'Насколько точен калькулятор?',
              a: 'Калькулятор использует средние показатели по рынку России за 2024–2025 год. Реальные результаты зависят от локации, конкуренции, сезонности и операционного управления. Погрешность ±30%.',
            },
            {
              q: 'Почему самообслуживание выгоднее?',
              a: 'Мойка самообслуживания работает 24/7 без персонала, рентабельность достигает 55%. Ручные мойки требуют штат 3–5 человек, рентабельность 20–35%.',
            },
            {
              q: 'Что входит в инвестиции?',
              a: 'Оборудование, монтаж, аренда/покупка земли, подключение коммуникаций, ремонт, оборотные средства. Не включает НДС и регистрацию бизнеса.',
            },
            {
              q: 'Как ускорить окупаемость?',
              a: 'Выбрать высокотрафиковое место (трасса, ТЦ, АЗС), работать 24/7, подключить программу лояльности, добавить дополнительные услуги (пылесосы, матовые покрытия).',
            },
          ].map((item) => (
            <div key={item.q} className="bg-gray-50 rounded-xl p-5">
              <h3 className="font-semibold mb-2">{item.q}</h3>
              <p className="text-gray-600 text-sm">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
