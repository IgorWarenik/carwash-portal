import Link from 'next/link'

const NAV_LINKS = [
  { href: '/avtomoyki', label: 'Каталог моек' },
  { href: '/franshizy', label: 'Франшизы' },
  { href: '/kupit-avtomoiku', label: 'Купить бизнес' },
  { href: '/otkryt-avtomoiku', label: 'Открыть мойку' },
  { href: '/tools', label: 'Калькуляторы' },
]

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-[#1a1a2e]">
              Портал<span className="text-[#e94560]">Автомоек</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-[#e94560] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/prodaty-avtomoiku"
            className="hidden md:inline-flex items-center px-4 py-2 rounded-lg bg-[#e94560] text-white text-sm font-medium hover:bg-[#c73652] transition-colors"
          >
            Продать мойку
          </Link>

          {/* Mobile menu button placeholder */}
          <button className="md:hidden p-2 rounded-md text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
