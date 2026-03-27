import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Блог — статьи об автомойках, бизнесе и детейлинге',
  description: 'Экспертные статьи о рынке автомоек: как открыть, сколько зарабатывают, тренды рынка, детейлинг, самообслуживание, франшизы.',
}

const ARTICLES = [
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

const CATEGORIES = ['Все', 'Открыть бизнес', 'Детейлинг', 'Инвестиции', 'Аналитика', 'Продажа', 'Управление']

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function BlogPage() {
  const featured = ARTICLES.filter(a => a.featured)
  const rest = ARTICLES.filter(a => !a.featured)

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-[#e94560]">Главная</Link>
        <span>›</span>
        <span className="text-gray-900">Блог</span>
      </nav>

      <h1 className="text-3xl font-bold mb-3">Блог об автомоечном бизнесе</h1>
      <p className="text-gray-500 mb-8">Экспертные статьи, аналитика рынка, гайды для предпринимателей.</p>

      {/* Category nav */}
      <div className="flex flex-wrap gap-2 mb-10">
        {CATEGORIES.map(cat => (
          <button key={cat} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${cat === 'Все' ? 'bg-[#e94560] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Featured */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
        {featured.map(article => (
          <Link key={article.slug} href={`/blog/${article.slug}`} className="group bg-white border-2 border-gray-100 hover:border-[#e94560] rounded-2xl p-6 transition-all hover:shadow-md flex flex-col">
            <div className="text-5xl mb-4">{article.image}</div>
            <span className="text-xs font-medium text-[#e94560] bg-[#e94560]/10 px-2 py-0.5 rounded-full w-fit mb-3">{article.category}</span>
            <h2 className="text-xl font-bold mb-3 group-hover:text-[#e94560] transition-colors leading-snug">{article.title}</h2>
            <p className="text-gray-500 text-sm flex-1 mb-4">{article.excerpt}</p>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>{formatDate(article.publishedAt)}</span>
              <span>{article.readTime} чтения</span>
            </div>
          </Link>
        ))}
      </div>

      {/* All articles */}
      <h2 className="text-xl font-bold mb-6">Все статьи</h2>
      <div className="space-y-4">
        {rest.map(article => (
          <Link key={article.slug} href={`/blog/${article.slug}`} className="group flex gap-5 bg-white border border-gray-200 hover:border-[#e94560] rounded-2xl p-5 transition-all hover:shadow-sm">
            <div className="text-3xl flex-shrink-0 w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">{article.image}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{article.category}</span>
                <span className="text-xs text-gray-400">{article.readTime} чтения</span>
              </div>
              <h2 className="font-semibold group-hover:text-[#e94560] transition-colors mb-1 leading-snug">{article.title}</h2>
              <p className="text-sm text-gray-500 line-clamp-1">{article.excerpt}</p>
            </div>
            <div className="text-xs text-gray-400 flex-shrink-0 hidden sm:block pt-1">{formatDate(article.publishedAt)}</div>
          </Link>
        ))}
      </div>
    </main>
  )
}
