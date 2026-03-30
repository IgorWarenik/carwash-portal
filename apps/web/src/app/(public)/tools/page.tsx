import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Калькуляторы для автомойки — окупаемость, оценка, локация',
  description:
    'Бесплатные онлайн-калькуляторы: рассчитайте окупаемость автомойки, ' +
    'оцените бизнес или выберите локацию. Без регистрации, за 2 минуты.',
  alternates: { canonical: '/tools' },
}

const tools = [
  {
    href: '/tools/roi-calculator',
    title: 'Калькулятор ROI',
    description: 'Рассчитайте ежемесячную прибыль, срок окупаемости и ROI для любого формата мойки. Самый популярный инструмент.',
    icon: '📊',
    badge: '🔥 Популярное',
    ready: true,
  },
  {
    href: '/tools/ocenka-biznesa',
    title: 'Оценка бизнеса',
    description: 'Узнайте рыночную стоимость автомойки перед покупкой или продажей. Методика: мультипликатор EBITDA.',
    icon: '💰',
    badge: 'Новое',
    ready: true,
  },
  {
    href: '/tools/ocenka-lokacii',
    title: 'Оценка локации',
    description: 'Пошаговый wizard: оцените трафик, конкуренцию и потенциал точки для открытия автомойки.',
    icon: '📍',
    badge: 'Новое',
    ready: true,
  },
]

export default function ToolsPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-[#e94560]">Главная</Link>
        <span>›</span>
        <span className="text-gray-900">Калькуляторы</span>
      </nav>

      <h1 className="text-3xl font-bold mb-3">Онлайн-инструменты для автомойки</h1>
      <p className="text-gray-500 mb-10">
        Бесплатные калькуляторы на основе реальных данных рынка. Без регистрации.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {tools.map((tool) => (
          tool.ready ? (
            <Link
              key={tool.href}
              href={tool.href}
              className="bg-white border-2 border-[#e94560] rounded-2xl p-6 hover:shadow-lg transition-all group flex flex-col"
            >
              <div className="text-4xl mb-3">{tool.icon}</div>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="font-bold text-lg group-hover:text-[#e94560] transition-colors">{tool.title}</h2>
                <span className="text-xs bg-[#e94560]/10 text-[#e94560] px-2 py-0.5 rounded-full font-medium">{tool.badge}</span>
              </div>
              <p className="text-sm text-gray-600 flex-1">{tool.description}</p>
              <div className="mt-4 text-sm font-semibold text-[#e94560]">Открыть →</div>
            </Link>
          ) : (
            <div
              key={tool.href}
              className="bg-gray-50 border border-gray-200 rounded-2xl p-6 flex flex-col opacity-70"
            >
              <div className="text-4xl mb-3 grayscale">{tool.icon}</div>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="font-bold text-lg text-gray-500">{tool.title}</h2>
                <span className="text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full font-medium">{tool.badge}</span>
              </div>
              <p className="text-sm text-gray-400 flex-1">{tool.description}</p>
            </div>
          )
        ))}
      </div>
    </main>
  )
}
