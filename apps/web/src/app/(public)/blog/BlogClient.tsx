'use client'

import Link from 'next/link'
import { useState } from 'react'

export interface ArticleMeta {
  slug: string
  title: string
  excerpt: string
  category: string
  readTime: string
  publishedAt: string
  featured: boolean
  image: string
}

const CATEGORIES = ['Все', 'Открыть бизнес', 'Детейлинг', 'Инвестиции', 'Аналитика', 'Управление', 'Оборудование', 'Технологии', 'Регулирование', 'Купить бизнес', 'Продажа']

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function BlogClient({ articles }: { articles: ArticleMeta[] }) {
  const [activeCategory, setActiveCategory] = useState('Все')

  const filtered = activeCategory === 'Все'
    ? articles
    : articles.filter(a => a.category === activeCategory)

  const featured = filtered.filter(a => a.featured).slice(0, 3)
  const rest = filtered.filter(a => !a.featured)

  return (
    <>
      {/* Category nav */}
      <div className="flex flex-wrap gap-2 mb-10 overflow-x-auto pb-1">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              cat === activeCategory
                ? 'bg-[#e94560] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured */}
      {featured.length > 0 && (
        <>
          <h2 className="text-xl font-bold mb-4">Главное</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
            {featured.map(article => (
              <Link key={article.slug} href={`/blog/${article.slug}`} className="group bg-white border-2 border-gray-100 hover:border-[#e94560] rounded-2xl p-5 transition-all hover:shadow-md flex flex-col">
                <div className="text-4xl mb-3">{article.image}</div>
                <span className="text-xs font-medium text-[#e94560] bg-[#e94560]/10 px-2 py-0.5 rounded-full w-fit mb-2">{article.category}</span>
                <h2 className="font-bold mb-2 group-hover:text-[#e94560] transition-colors leading-snug line-clamp-2">{article.title}</h2>
                <p className="text-gray-500 text-sm flex-1 mb-3 line-clamp-2">{article.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{formatDate(article.publishedAt)}</span>
                  <span>{article.readTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* All articles */}
      <h2 className="text-xl font-bold mb-5">
        {activeCategory === 'Все' ? 'Все статьи' : activeCategory}
        {' '}<span className="text-gray-400 font-normal text-base ml-1">({rest.length})</span>
      </h2>
      {rest.length > 0 ? (
        <div className="space-y-3">
          {rest.map(article => (
            <Link key={article.slug} href={`/blog/${article.slug}`} className="group flex gap-4 bg-white border border-gray-200 hover:border-[#e94560] rounded-2xl p-4 transition-all hover:shadow-sm">
              <div className="text-2xl flex-shrink-0 w-11 h-11 bg-gray-50 rounded-xl flex items-center justify-center">{article.image}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{article.category}</span>
                  <span className="text-xs text-gray-400">{article.readTime}</span>
                </div>
                <h2 className="font-semibold group-hover:text-[#e94560] transition-colors mb-0.5 leading-snug line-clamp-1">{article.title}</h2>
                <p className="text-sm text-gray-500 line-clamp-1">{article.excerpt}</p>
              </div>
              <div className="text-xs text-gray-400 flex-shrink-0 hidden sm:block pt-1">{formatDate(article.publishedAt)}</div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 py-8 text-center">Статей в этой категории пока нет.</p>
      )}
    </>
  )
}
