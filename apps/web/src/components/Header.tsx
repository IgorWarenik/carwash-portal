'use client'

import Link from 'next/link'
import { useState } from 'react'

const NAV_LINKS = [
  { href: '/avtomoyki', label: 'Каталог моек' },
  { href: '/franshizy', label: 'Франшизы' },
  { href: '/kupit-avtomoiku', label: 'Купить бизнес' },
  { href: '/otkryt-avtomoiku', label: 'Открыть мойку' },
  { href: '/blog', label: 'Журнал' },
  { href: '/tools', label: 'Калькуляторы' },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
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

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/dlya-vladeltcev"
              className="text-sm font-medium text-[#e94560] hover:underline transition-colors"
            >
              Для владельцев
            </Link>
            <Link
              href="/prodaty-avtomoiku"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-[#e94560] text-white text-sm font-medium hover:bg-[#c73652] transition-colors"
            >
              Продать мойку
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-[#e94560] transition-colors"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Открыть меню"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white shadow-lg">
          <nav className="px-4 py-3 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-3 px-2 text-base font-medium text-gray-700 hover:text-[#e94560] hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/prodaty-avtomoiku"
              className="block mt-2 py-3 px-2 text-base font-medium text-center bg-[#e94560] text-white rounded-xl hover:bg-[#c73652] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Продать мойку
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
