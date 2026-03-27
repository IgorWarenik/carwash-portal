import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@carwash/db'

export const metadata: Metadata = {
  title: 'Франшизы автомоек — сравнение 2025: инвестиции, ROI, окупаемость',
  description:
    'Сравните франшизы автомоек России: 150bar, Сухомой, МОЙ-КА!, GEIZER, ALLES, Автомойка Экспресс. Инвестиции от 470 тыс. ₽, окупаемость от 8 месяцев.',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Франшизы автомоек России 2025',
  description: 'Сравнение 6 ведущих франшиз автомоек по инвестициям, окупаемости и поддержке',
  numberOfItems: 6,
}

const SUPPORT_LABELS: Record<string, string> = {
  full: 'Полная',
  partial: 'Частичная',
  minimal: 'Минимальная',
}

function formatRub(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} млн ₽`
  return `${Math.round(n / 1000)} тыс. ₽`
}

export default async function FranchisesPage() {
  const franchises = await prisma.franchise.findMany({
    where: { status: 'active' },
    orderBy: { paybackMonths: 'asc' },
  })

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-[#e94560]">Главная</Link>
        <span>›</span>
        <span className="text-gray-900">Франшизы</span>
      </nav>

      <h1 className="text-3xl font-bold mb-3">Франшизы автомоек в России — 2025</h1>
      <p className="text-gray-500 text-lg mb-10 max-w-2xl">
        Спрос на франшизы автомоек вырос на +40% в 2025 году. Сравниваем {franchises.length} ведущих игроков
        по инвестициям, окупаемости и уровню поддержки.
      </p>

      {/* Comparison table */}
      <div className="overflow-x-auto mb-12">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Франшиза</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Инвестиции</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Окупаемость</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Роялти</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700">Поддержка</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {franchises.map((f) => (
              <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4">
                  <Link href={`/franshizy/${f.slug}`} className="font-semibold text-gray-900 hover:text-[#e94560] transition-colors">
                    {f.name}
                  </Link>
                </td>
                <td className="py-3 px-4 text-right">
                  {f.investmentFrom && formatRub(f.investmentFrom)}
                  {f.investmentTo && ` – ${formatRub(f.investmentTo)}`}
                </td>
                <td className="py-3 px-4 text-right">
                  {f.paybackMonths ? (
                    <span className={f.paybackMonths <= 10 ? 'text-green-600 font-semibold' : ''}>
                      {f.paybackMonths} мес.
                    </span>
                  ) : '—'}
                </td>
                <td className="py-3 px-4 text-right">
                  {f.royalty ? `${f.royalty}%` : '—'}
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    f.supportLevel === 'full'
                      ? 'bg-green-100 text-green-700'
                      : f.supportLevel === 'partial'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {SUPPORT_LABELS[f.supportLevel ?? ''] ?? '—'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Franchise cards */}
      <h2 className="text-2xl font-bold mb-6">Подробно о каждой франшизе</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {franchises.map((f) => (
          <div key={f.id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow flex flex-col">
            <h3 className="text-xl font-bold mb-2">{f.name}</h3>
            {f.description && (
              <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-3">{f.description}</p>
            )}

            <div className="space-y-2 mt-auto">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Инвестиции</span>
                <span className="font-semibold">
                  {f.investmentFrom ? formatRub(f.investmentFrom) : '—'}
                </span>
              </div>
              {f.paybackMonths && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Окупаемость</span>
                  <span className={`font-semibold ${f.paybackMonths <= 12 ? 'text-green-600' : ''}`}>
                    {f.paybackMonths} мес.
                  </span>
                </div>
              )}
              {f.royalty && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Роялти</span>
                  <span className="font-semibold">{f.royalty}%</span>
                </div>
              )}
              {f.postsCount && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Постов</span>
                  <span className="font-semibold">{f.postsCount}</span>
                </div>
              )}
            </div>

            <Link
              href="/kupit-franshizu"
              className="mt-5 block text-center py-2.5 px-4 bg-[#e94560] text-white rounded-xl text-sm font-semibold hover:bg-[#c73652] transition-colors"
            >
              Получить предложение
            </Link>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Как выбрать франшизу автомойки?</h2>
        <div className="prose prose-gray max-w-none text-gray-600">
          <p className="mb-4">
            Выбор франшизы зависит от вашего бюджета, региона и готовности к операционному управлению.
            Вот ключевые критерии:
          </p>
          <ul className="space-y-3 list-none">
            {[
              { title: 'Бюджет', text: 'Если у вас 500–1,5 млн ₽ — смотрите на Автомойку Экспресс или Сухомой. От 2 млн — 150bar или GEIZER.' },
              { title: 'Регион', text: 'В миллионниках работают все форматы. В городах до 300к лучше показывают себя самообслуживание и Сухомой.' },
              { title: 'Поддержка', text: 'Для начинающих важна полная поддержка (150bar, МОЙ-КА!). Опытным предпринимателям подойдут форматы с роялти 4–5%.' },
              { title: 'Окупаемость', text: 'Реальная окупаемость редко бывает быстрее 12 месяцев. Данные франчайзеров — оптимистичный сценарий.' },
            ].map((item) => (
              <li key={item.title} className="flex gap-3">
                <span className="flex-shrink-0 w-2 h-2 rounded-full bg-[#e94560] mt-2" />
                <div>
                  <strong className="text-gray-900">{item.title}:</strong> {item.text}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ROI CTA */}
      <div className="bg-[#1a1a2e] text-white rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-3">Рассчитайте ROI для вашего города</h2>
        <p className="text-gray-300 mb-6">
          Перед покупкой франшизы — проверьте окупаемость в калькуляторе. Бесплатно, без регистрации.
        </p>
        <Link
          href="/tools/roi-calculator"
          className="inline-flex items-center px-6 py-3 bg-[#e94560] rounded-xl font-semibold hover:bg-[#c73652] transition-colors"
        >
          Открыть калькулятор →
        </Link>
      </div>
    </main>
  )
}
