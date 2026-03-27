import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://avtomoyki-portal.ru'),
  title: {
    default: 'Портал Автомоек — каталог, покупка, открытие',
    template: '%s | Портал Автомоек',
  },
  description:
    'Каталог автомоек России: найти, купить, продать, открыть автомойку. ' +
    'Поставщики оборудования, франшизы, калькуляторы окупаемости.',
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
