import Link from 'next/link'

const TOP_CITIES = [
  { slug: 'moskva', name: 'Москва' },
  { slug: 'sankt-peterburg', name: 'Санкт-Петербург' },
  { slug: 'ekaterinburg', name: 'Екатеринбург' },
  { slug: 'novosibirsk', name: 'Новосибирск' },
  { slug: 'kazan', name: 'Казань' },
  { slug: 'krasnodar', name: 'Краснодар' },
  { slug: 'ufa', name: 'Уфа' },
  { slug: 'tyumen', name: 'Тюмень' },
]

export function Footer() {
  return (
    <footer className="bg-[#1a1a2e] text-gray-300 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-xl font-bold text-white">
              Портал<span className="text-[#e94560]">Автомоек</span>
            </Link>
            <p className="mt-3 text-sm text-gray-400 leading-relaxed">
              Найти, купить, открыть автомойку в России. Каталог, аналитика, калькуляторы.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Инвесторам</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/kupit-avtomoiku" className="hover:text-white transition-colors">Купить автомойку</Link></li>
              <li><Link href="/franshizy" className="hover:text-white transition-colors">Франшизы</Link></li>
              <li><Link href="/tools/roi-calculator" className="hover:text-white transition-colors">Калькулятор ROI</Link></li>
              <li><Link href="/otkryt-avtomoiku" className="hover:text-white transition-colors">Открыть с нуля</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Владельцам</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/prodaty-avtomoiku" className="hover:text-white transition-colors">Продать мойку</Link></li>
              <li><Link href="/postavshchiki" className="hover:text-white transition-colors">Поставщики оборудования</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Статьи и гайды</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Города</h3>
            <ul className="space-y-2 text-sm">
              {TOP_CITIES.map((city) => (
                <li key={city.slug}>
                  <Link href={`/avtomoyki/${city.slug}`} className="hover:text-white transition-colors">
                    {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© 2026 ПорталАвтомоек.рф — все права защищены</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">Конфиденциальность</Link>
            <Link href="/terms" className="hover:text-gray-300 transition-colors">Условия</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
