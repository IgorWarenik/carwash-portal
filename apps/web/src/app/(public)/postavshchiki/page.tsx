import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@carwash/db'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Поставщики оборудования для автомоек — каталог 2025',
  description: 'Поставщики оборудования, химии и услуг для автомоек. Kärcher, Ehrle, строительство под ключ, терминалы оплаты, профессиональная химия.',
}

const CATEGORY_LABELS: Record<string, string> = {
  equipment: 'Оборудование',
  chemistry: 'Химия',
  construction: 'Строительство',
  franchise: 'Франшизы',
}

const CATEGORY_ICONS: Record<string, string> = {
  equipment: '⚙️',
  chemistry: '🧴',
  construction: '🏗️',
  franchise: '🤝',
}

const PRICE_LABELS: Record<string, string> = {
  budget: 'Эконом',
  mid: 'Средний',
  premium: 'Премиум',
}

const PRICE_COLORS: Record<string, string> = {
  budget: 'bg-green-100 text-green-700',
  mid: 'bg-blue-100 text-blue-700',
  premium: 'bg-purple-100 text-purple-700',
}

export default async function SuppliersPage() {
  const suppliers = await prisma.supplier.findMany({
    where: { status: 'active' },
    orderBy: [{ featured: 'desc' }, { name: 'asc' }],
  })

  const categories = ['equipment', 'chemistry', 'construction']
  const grouped = categories.reduce((acc, cat) => {
    acc[cat] = suppliers.filter(s => s.category === cat)
    return acc
  }, {} as Record<string, typeof suppliers>)

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-[#e94560]">Главная</Link>
        <span>›</span>
        <span className="text-gray-900">Поставщики</span>
      </nav>

      <h1 className="text-3xl font-bold mb-3">Поставщики для автомоек</h1>
      <p className="text-gray-500 text-lg mb-10 max-w-2xl">
        Проверенные партнёры: оборудование, химия, строительство под ключ, терминалы оплаты.
        Каталог обновляется ежемесячно.
      </p>

      {/* Category nav */}
      <div className="flex flex-wrap gap-3 mb-10">
        {categories.map(cat => (
          <a key={cat} href={`#${cat}`} className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium transition-colors">
            {CATEGORY_ICONS[cat]} {CATEGORY_LABELS[cat]}
            <span className="bg-white px-1.5 rounded-full text-xs text-gray-500">{grouped[cat]?.length ?? 0}</span>
          </a>
        ))}
      </div>

      {categories.map(cat => {
        const list = grouped[cat]
        if (!list?.length) return null
        return (
          <section key={cat} id={cat} className="mb-14">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              {CATEGORY_ICONS[cat]} {CATEGORY_LABELS[cat]}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {list.map(s => (
                <div key={s.id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {s.featured && <span className="text-xs bg-[#e94560]/10 text-[#e94560] px-2 py-0.5 rounded-full font-medium">Топ</span>}
                      {s.priceRange && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRICE_COLORS[s.priceRange]}`}>
                          {PRICE_LABELS[s.priceRange]}
                        </span>
                      )}
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-1">{s.name}</h3>
                  {s.city && <p className="text-sm text-gray-400 mb-2">📍 {s.city}</p>}
                  {s.description && <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-3">{s.description}</p>}

                  {s.services.length > 0 && (
                    <div className="mb-4">
                      <div className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">Услуги</div>
                      <div className="flex flex-wrap gap-1">
                        {s.services.slice(0, 4).map(srv => (
                          <span key={srv} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{srv}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-auto flex items-center justify-between">
                    {s.phone && (
                      <a href={`tel:${s.phone}`} className="text-sm text-[#e94560] font-medium hover:underline">{s.phone}</a>
                    )}
                    {s.website && (
                      <a href={s.website} target="_blank" rel="nofollow noopener" className="text-sm text-blue-600 hover:underline">Сайт →</a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )
      })}

      {/* CTA for suppliers */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center">
        <h2 className="text-xl font-bold mb-3">Вы поставщик оборудования или услуг?</h2>
        <p className="text-gray-500 mb-6">Разместите компанию в каталоге — ваша аудитория уже здесь.</p>
        <Link href="/prodaty-avtomoiku#supplier-form" className="inline-flex items-center px-6 py-3 bg-[#1a1a2e] text-white rounded-xl font-semibold hover:bg-[#0f0f20] transition-colors">
          Добавить компанию →
        </Link>
      </div>
    </main>
  )
}
