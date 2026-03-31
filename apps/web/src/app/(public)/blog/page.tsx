import type { Metadata } from 'next'
import Link from 'next/link'
import { NEW_ARTICLES_META } from './articles-data'
import { ARCHIVE_ARTICLES } from './articles-archive'
import { BlogClient } from './BlogClient'

export const metadata: Metadata = {
  title: 'Журнал — статьи об автомоечном бизнесе',
  description: 'Экспертные статьи о рынке автомоек: как открыть, сколько зарабатывают, тренды рынка, детейлинг, самообслуживание, франшизы, инвестиции.',
  alternates: { canonical: '/blog' },
}

// Существующие 9 статей
const EXISTING_ARTICLES = [
  {
    slug: 'kak-otkryt-avtomoiku-samobsluzhivaniya-2025',
    title: 'Как открыть автомойку самообслуживания с нуля в 2025 году',
    excerpt: 'Полное руководство: выбор локации, расчёт инвестиций, оборудование, документы. Реальные цифры от действующих владельцев.',
    category: 'Открыть бизнес',
    readTime: '12 мин',
    publishedAt: '2025-11-15',
    featured: true,
    image: '🚿',
  },
  {
    slug: 'deteyling-biznes-kak-nachat',
    title: 'Детейлинг как бизнес: с нуля до 300 000 ₽/мес',
    excerpt: 'Рынок детейлинга вырос на 75% в Москве за 2023 год. Разбираем, как войти в нишу с минимальными вложениями.',
    category: 'Детейлинг',
    readTime: '9 мин',
    publishedAt: '2025-10-28',
    featured: true,
    image: '✨',
  },
  {
    slug: 'biznes-plan-avtomoiki-2025',
    title: 'Бизнес-план автомойки: пример с цифрами на 2025 год',
    excerpt: 'Готовый бизнес-план с реальными расчётами вложений, доходов и окупаемости. Три формата: ручная мойка, самообслуживание и портальная.',
    category: 'Открыть бизнес',
    readTime: '10 мин',
    publishedAt: '2026-01-10',
    featured: true,
    image: '📋',
  },
  {
    slug: 'franshiza-ili-svoyo-delo',
    title: 'Франшиза или свой бизнес: что выбрать в 2025 году',
    excerpt: 'Сравниваем реальные показатели: инвестиции, сроки открытия, риски и итоговую прибыль. С цифрами и без воды.',
    category: 'Инвестиции',
    readTime: '8 мин',
    publishedAt: '2025-10-10',
    featured: false,
    image: '🤝',
  },
  {
    slug: 'rynok-avtomoeek-rossii-2024',
    title: 'Рынок автомоек России 2024: цифры, тренды, прогнозы',
    excerpt: '65–70 млрд рублей, +25% рост самообслуживания, IoT в 70% новых объектов. Ключевые данные рынка.',
    category: 'Аналитика',
    readTime: '7 мин',
    publishedAt: '2025-09-20',
    featured: false,
    image: '📊',
  },
  {
    slug: 'kak-vibrat-lokaciyu-dlya-avtomoiki',
    title: 'Как выбрать локацию для автомойки: 7 критериев',
    excerpt: 'Трафик, видимость, конкуренты, коммуникации, аренда — разбираем каждый пункт на реальных примерах.',
    category: 'Открыть бизнес',
    readTime: '10 мин',
    publishedAt: '2025-09-05',
    featured: false,
    image: '📍',
  },
  {
    slug: 'nanockeramika-chto-eto-i-kogda-nuzhna',
    title: 'Нанокерамика: что это, сколько стоит и когда нужна',
    excerpt: 'Объясняем простым языком: чем нанокерамика отличается от воска, сколько служит, кому нужна.',
    category: 'Детейлинг',
    readTime: '6 мин',
    publishedAt: '2025-08-22',
    featured: false,
    image: '🔬',
  },
  {
    slug: 'kak-prodat-avtomoiku-po-rynochnoj-cene',
    title: 'Как продать автомойку по рыночной цене: оценка и подготовка к сделке',
    excerpt: 'Методики оценки бизнеса, типичные ошибки продавцов, как подготовить документы и найти покупателя.',
    category: 'Продажа',
    readTime: '11 мин',
    publishedAt: '2025-08-08',
    featured: false,
    image: '💰',
  },
  {
    slug: 'sezonnost-avtomoiki-kak-zarabotat-zimoy',
    title: 'Сезонность автомойки: как зарабатывать зимой не меньше, чем летом',
    excerpt: 'Пики в марте и сентябре, провал в январе — и как его нивелировать тёплыми боксами, программами лояльности.',
    category: 'Управление',
    readTime: '7 мин',
    publishedAt: '2025-07-14',
    featured: false,
    image: '❄️',
  },
]

const ARCHIVE_META = Object.entries(ARCHIVE_ARTICLES).map(([slug, data]) => ({
  slug,
  title: data.title,
  excerpt: data.excerpt,
  category: data.category,
  readTime: data.readTime,
  publishedAt: data.publishedAt,
  featured: data.featured,
  image: data.image,
}))

const ALL_ARTICLES = [
  ...EXISTING_ARTICLES,
  ...NEW_ARTICLES_META,
  ...ARCHIVE_META,
].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

export default function BlogPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-[#e94560]">Главная</Link>
        <span>›</span>
        <span className="text-gray-900">Журнал</span>
      </nav>

      <h1 className="text-3xl font-bold mb-3">Журнал об автомоечном бизнесе</h1>
      <p className="text-gray-500 mb-8 max-w-2xl">
        Экспертные статьи, аналитика рынка, гайды для предпринимателей. {ALL_ARTICLES.length} материалов для владельцев и инвесторов.
      </p>

      <BlogClient articles={ALL_ARTICLES} />

      {/* CTA */}
      <div className="mt-14 bg-[#1a1a2e] text-white rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-3">Открываете автомойку?</h2>
        <p className="text-gray-300 mb-6 max-w-md mx-auto">Используйте наш калькулятор ROI и актуальный каталог франшиз, чтобы принять взвешенное решение.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/tools/roi-calculator" className="px-5 py-2.5 bg-[#e94560] text-white rounded-xl font-semibold hover:bg-[#c73652] transition-colors text-sm">
            Калькулятор ROI
          </Link>
          <Link href="/franshizy" className="px-5 py-2.5 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-colors text-sm">
            Каталог франшиз
          </Link>
        </div>
      </div>
    </main>
  )
}
