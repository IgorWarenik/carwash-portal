import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Портал Автомоек — найти, купить, открыть автомойку в России',
  description:
    'Крупнейший портал автомоек России. Каталог автомоек в вашем городе, ' +
    'покупка и продажа бизнеса, поставщики оборудования, франшизы, калькуляторы окупаемости.',
}

const TOP_CITIES = [
  { slug: 'moskva', name: 'Москва', count: '800+' },
  { slug: 'sankt-peterburg', name: 'Санкт-Петербург', count: '400+' },
  { slug: 'ekaterinburg', name: 'Екатеринбург', count: '200+' },
  { slug: 'novosibirsk', name: 'Новосибирск', count: '180+' },
  { slug: 'kazan', name: 'Казань', count: '160+' },
  { slug: 'krasnodar', name: 'Краснодар', count: '150+' },
  { slug: 'ufa', name: 'Уфа', count: '130+' },
  { slug: 'rostov-na-donu', name: 'Ростов-на-Дону', count: '120+' },
  { slug: 'tyumen', name: 'Тюмень', count: '100+' },
  { slug: 'volgograd', name: 'Волгоград', count: '90+' },
]

const VALUE_PROPS = [
  {
    icon: '🔍',
    title: 'Найти мойку',
    desc: 'Каталог с фильтрами: самообслуживание, ручные, автоматические, детейлинг. Реальные адреса и рейтинги.',
    href: '/avtomoyki',
    cta: 'Смотреть каталог',
  },
  {
    icon: '💼',
    title: 'Купить бизнес',
    desc: 'Верифицированные объявления о продаже автомоек. Финансовые показатели, сроки окупаемости, помощь в сделке.',
    href: '/kupit-avtomoiku',
    cta: 'Смотреть объявления',
  },
  {
    icon: '🚀',
    title: 'Открыть с нуля',
    desc: 'Пошаговые гайды, калькулятор ROI, список оборудования, выбор локации. Всё для старта.',
    href: '/otkryt-avtomoiku',
    cta: 'Читать гайд',
  },
  {
    icon: '🤝',
    title: 'Купить франшизу',
    desc: 'Сравнение 6 ведущих франшиз: 150bar, Сухомой, МОЙ-КА!, GEIZER. Инвестиции, ROI, поддержка.',
    href: '/franshizy',
    cta: 'Сравнить франшизы',
  },
]

const STATS = [
  { value: '40 000+', label: 'Постов по России' },
  { value: '267', label: 'Объявлений о продаже' },
  { value: '+25%', label: 'Рост рынка в год' },
  { value: '55%', label: 'Рентабельность' },
]

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
            Найти, купить или открыть<br />
            <span className="text-[#e94560]">автомойку в России</span>
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Единое окно: каталог с рейтингами, покупка и продажа бизнеса, франшизы, калькуляторы окупаемости.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/avtomoyki"
              className="px-8 py-4 bg-[#e94560] rounded-xl font-semibold text-lg hover:bg-[#c73652] transition-colors"
            >
              Найти мойку рядом
            </Link>
            <Link
              href="/tools/roi-calculator"
              className="px-8 py-4 bg-white/10 border border-white/20 rounded-xl font-semibold text-lg hover:bg-white/20 transition-colors"
            >
              Рассчитать ROI
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#e94560] text-white py-10 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="text-sm text-red-100 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Value props */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Что вы ищете?</h2>
          <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto">
            Портал закрывает все задачи — от поиска мойки до покупки бизнеса и запуска своей франшизы.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUE_PROPS.map((vp) => (
              <div key={vp.title} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <div className="text-4xl mb-4">{vp.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{vp.title}</h3>
                <p className="text-sm text-gray-500 flex-1 mb-6">{vp.desc}</p>
                <Link href={vp.href} className="text-sm font-semibold text-[#e94560] hover:underline">
                  {vp.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* City catalog */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Автомойки по городам</h2>
          <p className="text-center text-gray-500 mb-12">
            Ищите мойки в своём городе — с адресами, рейтингами и фильтрами по типу.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {TOP_CITIES.map((city) => (
              <Link
                key={city.slug}
                href={`/avtomoyki/${city.slug}`}
                className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-[#e94560] hover:shadow-sm transition-all group"
              >
                <div className="font-semibold text-gray-900 group-hover:text-[#e94560] transition-colors">
                  {city.name}
                </div>
                <div className="text-sm text-gray-400 mt-1">{city.count} моек</div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/avtomoyki" className="text-[#e94560] font-semibold hover:underline">
              Все города →
            </Link>
          </div>
        </div>
      </section>

      {/* ROI CTA */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#1a1a2e] rounded-2xl p-10 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Сколько зарабатывает автомойка?</h2>
            <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
              Рассчитайте окупаемость для своего города и формата. Самообслуживание или ручная мойка?
              Инвестиции, ежемесячный доход, срок окупаемости — бесплатно, за 2 минуты.
            </p>
            <Link
              href="/tools/roi-calculator"
              className="inline-flex items-center px-8 py-4 bg-[#e94560] rounded-xl font-semibold text-lg hover:bg-[#c73652] transition-colors"
            >
              Открыть калькулятор ROI →
            </Link>
          </div>
        </div>
      </section>

      {/* Franchises preview */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Популярные франшизы автомоек</h2>
          <p className="text-center text-gray-500 mb-12">
            Спрос на франшизы вырос на +40% в 2025 году. Выберите лучший вариант для своего региона.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { name: '150bar', invest: 'от 1 900 000 ₽', points: '127 точек', roi: '<1 года', color: 'bg-blue-50 border-blue-100' },
              { name: 'Сухомой', invest: 'от 800 000 ₽', points: '160+ точек', roi: '12–18 мес', color: 'bg-green-50 border-green-100' },
              { name: 'МОЙ-КА!', invest: 'от 2 500 000 ₽', points: '90+ точек', roi: '18–24 мес', color: 'bg-purple-50 border-purple-100' },
            ].map((f) => (
              <div key={f.name} className={`${f.color} border rounded-2xl p-6`}>
                <h3 className="text-xl font-bold mb-4">{f.name}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Инвестиции</span>
                    <span className="font-semibold">{f.invest}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Сеть</span>
                    <span className="font-semibold">{f.points}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Окупаемость</span>
                    <span className="font-semibold">{f.roi}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/franshizy" className="text-[#e94560] font-semibold hover:underline">
              Сравнить все франшизы →
            </Link>
          </div>
        </div>
      </section>

      {/* Sell CTA */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Хотите продать автомойку?</h2>
          <p className="text-gray-500 mb-8">
            Разместите объявление на портале с верифицированными данными. Быстрее находим покупателей, чем Авито.
          </p>
          <Link
            href="/prodaty-avtomoiku"
            className="inline-flex items-center px-8 py-4 bg-[#1a1a2e] text-white rounded-xl font-semibold hover:bg-[#0f0f20] transition-colors"
          >
            Разместить объявление →
          </Link>
        </div>
      </section>
    </main>
  )
}
