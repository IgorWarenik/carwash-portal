import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@carwash/db'

interface Props { params: { city: string } }

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = await prisma.city.findUnique({ where: { slug: params.city } }).catch(() => null)
  if (!city) return {}
  return {
    title: `Как открыть автомойку в ${city.name} — бизнес-план, инвестиции 2025`,
    description: `Открыть автомойку в ${city.name}: инвестиции от 1,3 млн ₽, окупаемость 12–24 мес. Анализ рынка ${city.name}, выбор формата, документы, оборудование.`,
    alternates: { canonical: `/otkryt-avtomoiku/${params.city}` },
  }
}

export default async function OtkrytCityPage({ params }: Props) {
  const city = await prisma.city.findUnique({ where: { slug: params.city } }).catch(() => null)
  if (!city) notFound()

  const [totalActive, byType, benchmarks] = await Promise.all([
    prisma.carWash.count({ where: { cityId: city.id, status: 'active' } }),
    prisma.carWash.groupBy({
      by: ['type'],
      where: { cityId: city.id, status: 'active' },
      _count: true,
    }),
    prisma.benchmark.findMany({
      where: { metric: 'avg_check', OR: [{ city: params.city }, { city: null }] },
      orderBy: { city: 'desc' },
    }),
  ])

  const typeMap: Record<string, number> = {}
  for (const row of byType) typeMap[row.type] = row._count

  const selfServiceBench = benchmarks.find(b => b.carwashType === 'self_service')
  const manualBench = benchmarks.find(b => b.carwashType === 'manual')

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://www.businessmoyka.ru/' },
      { '@type': 'ListItem', position: 2, name: 'Открыть автомойку', item: 'https://www.businessmoyka.ru/otkryt-avtomoiku' },
      { '@type': 'ListItem', position: 3, name: city.name, item: `https://www.businessmoyka.ru/otkryt-avtomoiku/${params.city}` },
    ],
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Сколько стоит открыть автомойку в ${city.name}?`,
        acceptedAnswer: { '@type': 'Answer', text: `В ${city.name} мойка самообслуживания на 2–4 поста обойдётся от 1,3 до 3,5 млн ₽. Ручная мойка — от 2 млн ₽. Автоматическая — от 5 млн ₽. Точный расчёт с учётом аренды в ${city.name} — в нашем калькуляторе ROI.` },
      },
      {
        '@type': 'Question',
        name: `Какой формат автомойки лучше открыть в ${city.name}?`,
        acceptedAnswer: { '@type': 'Answer', text: `В ${city.name} сейчас работает ${totalActive} активных моек. Самый быстрорастущий сегмент — самообслуживание (${typeMap['self_service'] ?? 0} точек). Для старта рекомендуем самообслуживание: нет персонала, работа 24/7, окупаемость 12–18 месяцев.` },
      },
      {
        '@type': 'Question',
        name: `Выгодно ли открывать автомойку в ${city.name} в 2025 году?`,
        acceptedAnswer: { '@type': 'Answer', text: `Рынок автомоек в России растёт на +25% в год. В ${city.name} наблюдается устойчивый спрос.${selfServiceBench ? ` Средний чек мойки самообслуживания — ${Math.round(selfServiceBench.value)} ₽.` : ''} При правильной локации окупаемость — 12–24 месяца.` },
      },
    ],
  }

  const FORMATS = [
    { type: 'self_service', label: 'Самообслуживание', invest: 'от 1,3 млн ₽', roi: '12–18 мес', pros: 'Нет персонала, 24/7, высокая рентабельность', count: typeMap['self_service'] ?? 0 },
    { type: 'manual', label: 'Ручная мойка', invest: 'от 2 млн ₽', roi: '18–30 мес', pros: 'Высокое качество, широкий спектр услуг', count: typeMap['manual'] ?? 0 },
    { type: 'automatic', label: 'Автоматическая', invest: 'от 5 млн ₽', roi: '24–36 мес', pros: 'Быстро, без персонала, высокий поток', count: typeMap['automatic'] ?? 0 },
    { type: 'detailing', label: 'Детейлинг', invest: 'от 1,5 млн ₽', roi: '18–24 мес', pros: 'Высокий средний чек, лояльные клиенты', count: typeMap['detailing'] ?? 0 },
  ]

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-[#e94560]">Главная</Link>
        <span>›</span>
        <Link href="/otkryt-avtomoiku" className="hover:text-[#e94560]">Открыть автомойку</Link>
        <span>›</span>
        <span className="text-gray-900">{city.name}</span>
      </nav>

      <h1 className="text-3xl font-bold mb-3">
        Открыть автомойку в {city.name}
      </h1>
      <p className="text-gray-500 mb-10 text-lg">
        Анализ рынка, инвестиции, форматы и шаги запуска — с учётом специфики {city.name}
      </p>

      {/* Market stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
        {[
          { value: totalActive, label: 'Моек в городе' },
          { value: `${typeMap['self_service'] ?? 0}`, label: 'Самообслуживание' },
          { value: selfServiceBench ? `${Math.round(selfServiceBench.value)} ₽` : '~200 ₽', label: 'Средний чек МСО' },
          { value: manualBench ? `${Math.round(manualBench.value)} ₽` : '~600 ₽', label: 'Средний чек ручной' },
        ].map(stat => (
          <div key={stat.label} className="bg-white border border-gray-200 rounded-2xl p-5 text-center">
            <div className="text-2xl font-bold text-[#e94560]">{stat.value}</div>
            <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Formats comparison */}
      <h2 className="text-xl font-bold mb-5">Какой формат открыть в {city.name}?</h2>
      <div className="space-y-4 mb-12">
        {FORMATS.map(f => (
          <div key={f.type} className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col sm:flex-row gap-5">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-lg">{f.label}</h3>
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{f.count} в {city.name}</span>
              </div>
              <p className="text-sm text-gray-500">{f.pros}</p>
            </div>
            <div className="flex-shrink-0 flex sm:flex-col gap-6 sm:gap-2 text-sm">
              <div>
                <span className="text-gray-400 block text-xs">Инвестиции</span>
                <span className="font-semibold">{f.invest}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-xs">Окупаемость</span>
                <span className="font-semibold text-green-700">{f.roi}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Steps */}
      <h2 className="text-xl font-bold mb-5">Шаги запуска в {city.name}</h2>
      <div className="space-y-3 mb-12">
        {[
          { n: 1, title: 'Анализ локации', desc: `Найдите место с трафиком от 5 000 авт/день. В ${city.name} лучшие локации — у въездов в спальные районы, рядом с АЗС и гипермаркетами.` },
          { n: 2, title: 'Бизнес-план и расчёт ROI', desc: 'Рассчитайте инвестиции, ежемесячную выручку и срок окупаемости в нашем калькуляторе.' },
          { n: 3, title: 'Регистрация ИП/ООО', desc: 'ОКВЭД 45.20.3. Для МСО оптимально — ИП на патентной системе или УСН 6%.' },
          { n: 4, title: 'Аренда/покупка участка', desc: `В ${city.name} аренда земли под мойку — от 30 000 ₽/месяц. Важен договор на срок от 5 лет.` },
          { n: 5, title: 'Документы и разрешения', desc: 'Разрешение на строительство, заключение СЭС, пожарная инспекция, договор водоканала.' },
          { n: 6, title: 'Оборудование и монтаж', desc: 'Выбор поставщика, монтаж, подключение коммуникаций. Срок — 1–3 месяца.' },
          { n: 7, title: 'Запуск и маркетинг', desc: `Добавьтесь в Яндекс Карты и 2ГИС в первый день. Запустите таргет VK на радиус 3 км.` },
        ].map(step => (
          <div key={step.n} className="flex gap-4 bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#e94560] text-white text-sm font-bold flex items-center justify-center">{step.n}</div>
            <div>
              <div className="font-semibold text-sm mb-0.5">{step.title}</div>
              <div className="text-sm text-gray-500">{step.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <h2 className="text-xl font-bold mb-5">Частые вопросы</h2>
      <div className="space-y-3 mb-12">
        {[
          { q: `Сколько стоит открыть автомойку в ${city.name}?`, a: `В ${city.name} мойка самообслуживания обойдётся от 1,3 до 3,5 млн ₽. Ручная — от 2 млн ₽. Автоматическая — от 5 млн ₽. Используйте калькулятор ROI для точного расчёта.` },
          { q: `Какой формат лучше открыть в ${city.name}?`, a: `В ${city.name} работает ${totalActive} моек. Самый доходный формат для старта — самообслуживание: нет персонала, работает 24/7, рентабельность 40–55%.` },
          { q: `Выгодно ли открывать мойку в ${city.name} в 2025?`, a: `Рынок растёт на +25%/год. В ${city.name} спрос устойчивый.${selfServiceBench ? ` Средний чек МСО — ${Math.round(selfServiceBench.value)} ₽.` : ''} При хорошей локации окупаемость — 12–24 месяца.` },
        ].map(item => (
          <details key={item.q} className="group bg-white border border-gray-200 rounded-xl overflow-hidden">
            <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-medium text-gray-900 hover:text-[#e94560] transition-colors list-none">
              {item.q}
              <span className="ml-4 text-[#e94560] text-lg group-open:rotate-45 transition-transform inline-block">+</span>
            </summary>
            <p className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">{item.a}</p>
          </details>
        ))}
      </div>

      {/* CTAs */}
      <div className="bg-[#1a1a2e] rounded-2xl p-8 text-white text-center mb-8">
        <h2 className="text-xl font-bold mb-3">Рассчитайте окупаемость для {city.name}</h2>
        <p className="text-gray-300 mb-6">Введите параметры локации — калькулятор покажет срок окупаемости и ежемесячную прибыль.</p>
        <Link href="/tools/roi-calculator" className="inline-block px-8 py-3 bg-[#e94560] text-white rounded-xl font-semibold hover:bg-[#c73652] transition-colors">
          Открыть калькулятор ROI →
        </Link>
      </div>

      <div className="flex flex-wrap gap-4">
        <Link href="/otkryt-avtomoiku" className="px-5 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
          ← Общий гайд
        </Link>
        <Link href={`/avtomoyki/${params.city}`} className="px-5 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
          Конкуренты в {city.name} →
        </Link>
        <Link href="/franshizy" className="px-5 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
          Франшизы →
        </Link>
      </div>
    </main>
  )
}
