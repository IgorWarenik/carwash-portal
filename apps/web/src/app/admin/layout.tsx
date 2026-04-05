import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const metadata: Metadata = {
  title: { default: 'Админ', template: '%s — Админ' },
  robots: { index: false, follow: false },
}

const NAV = [
  { href: '/admin/leads', label: 'Лиды' },
  { href: '/admin/carwashes', label: 'Мойки' },
  { href: '/admin/reviews', label: 'Отзывы' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const token = cookies().get('admin_token')?.value
  const secret = process.env.ADMIN_SECRET ?? 'admin'
  if (token !== secret) redirect('/admin/login')

  return (
    <div className="bg-gray-50 min-h-screen">
      <nav className="bg-[#1a1a2e] text-white px-6 py-3 flex items-center gap-6">
        <span className="font-bold text-[#e94560] mr-4">Портал Автомоек</span>
        {NAV.map(n => (
          <Link key={n.href} href={n.href} className="text-sm hover:text-[#e94560] transition-colors">
            {n.label}
          </Link>
        ))}
        <form action="/api/admin/logout" method="POST" className="ml-auto">
          <button type="submit" className="text-xs text-gray-400 hover:text-white">Выйти</button>
        </form>
      </nav>
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  )
}
