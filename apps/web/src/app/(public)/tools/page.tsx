import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Калькуляторы для автомойки — 12 инструментов для владельцев',
  description:
    'Бесплатные онлайн-калькуляторы для автомойки: ROI, оценка бизнеса, налоги, химия, штат, LTV, программа лояльности и другие. Без регистрации.',
  alternates: { canonical: '/tools' },
}

const GROUPS = [
  {
    title: '💰 Финансы и инвестиции',
    tools: [
      { href: '/tools/roi-calculator', title: 'Калькулятор ROI', description: 'Прибыль, окупаемость и ROI для любого формата мойки.', icon: '📊', badge: '🔥 Топ' },
      { href: '/tools/ocenka-biznesa', title: 'Оценка бизнеса', description: 'Рыночная стоимость по EBITDA-мультипликатору.', icon: '💼', badge: '' },
      { href: '/tools/nalog-usn-patent', title: 'УСН vs Патент', description: 'Сравните налоговую нагрузку и выберите выгодный режим.', icon: '🧾', badge: 'Новое' },
      { href: '/tools/kredit-vs-reinvesticiya', title: 'Кредит vs реинвестиция', description: 'Что выгоднее: взять кредит на расширение или копить прибыль.', icon: '🏦', badge: 'Новое' },
      { href: '/tools/rentabelnost-uslug', title: 'Рентабельность услуг', description: 'Маржа и рейтинг прибыльности каждой услуги.', icon: '📈', badge: 'Новое' },
    ],
  },
  {
    title: '⚙️ Операции',
    tools: [
      { href: '/tools/ocenka-lokacii', title: 'Оценка локации', description: 'Пошаговый анализ точки: трафик, конкуренция, коммуникации.', icon: '📍', badge: '' },
      { href: '/tools/raskhod-khimii', title: 'Расход химии', description: 'Закупка химикатов на месяц: литры и бюджет.', icon: '🧴', badge: 'Новое' },
      { href: '/tools/optimalny-shtat', title: 'Оптимальный штат', description: 'Сколько мойщиков нужно при вашем трафике и графике.', icon: '👥', badge: 'Новое' },
      { href: '/tools/elektropotreblenie', title: 'Электропотребление', description: 'кВт·ч и стоимость электричества на одну мойку.', icon: '⚡', badge: 'Новое' },
    ],
  },
  {
    title: '📣 Маркетинг и клиенты',
    tools: [
      { href: '/tools/ltv-klienta', title: 'LTV клиента', description: 'Пожизненная ценность клиента и допустимый бюджет на рекламу.', icon: '❤️', badge: 'Новое' },
      { href: '/tools/programma-loyalnosti', title: 'Программа лояльности', description: 'Абонемент, скидка или разовые визиты — что выгоднее.', icon: '🎁', badge: 'Новое' },
      { href: '/tools/povyshenie-ceny', title: 'Повышение цен', description: 'Сколько клиентов можно потерять и остаться в той же прибыли.', icon: '💹', badge: 'Новое' },
    ],
  },
]

export default function ToolsPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-[#e94560]">Главная</Link>
        <span>›</span>
        <span className="text-gray-900">Калькуляторы</span>
      </nav>

      <h1 className="text-3xl font-bold mb-3">Онлайн-инструменты для автомойки</h1>
      <p className="text-gray-500 mb-10">
        12 бесплатных калькуляторов на основе реальных данных рынка. Без регистрации.
      </p>

      <div className="space-y-10">
        {GROUPS.map((group) => (
          <section key={group.title}>
            <h2 className="text-lg font-bold mb-4">{group.title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.tools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="bg-white border border-gray-200 hover:border-[#e94560] rounded-2xl p-5 hover:shadow-md transition-all group flex flex-col"
                >
                  <div className="text-3xl mb-3">{tool.icon}</div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-bold group-hover:text-[#e94560] transition-colors">{tool.title}</h3>
                    {tool.badge && (
                      <span className="text-xs bg-[#e94560]/10 text-[#e94560] px-2 py-0.5 rounded-full font-medium">{tool.badge}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 flex-1">{tool.description}</p>
                  <div className="mt-3 text-sm font-semibold text-[#e94560]">Открыть →</div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}
