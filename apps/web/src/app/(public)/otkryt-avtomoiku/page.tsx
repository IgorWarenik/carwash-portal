import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Как открыть автомойку с нуля — пошаговое руководство 2025',
  description:
    'Всё об открытии автомойки: бизнес-план, инвестиции, документы, поставщики оборудования. ' +
    'Самообслуживание от 1,9 млн ₽, окупаемость 10–18 месяцев. Калькулятор ROI.',
  alternates: { canonical: '/otkryt-avtomoiku' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Как открыть автомойку с нуля',
  description: 'Пошаговое руководство по открытию автомойки в России в 2025 году',
  supply: [
    { '@type': 'HowToSupply', name: 'Стартовый капитал от 1,9 млн ₽' },
    { '@type': 'HowToSupply', name: 'Земельный участок или аренда' },
    { '@type': 'HowToSupply', name: 'Регистрация ИП или ООО' },
  ],
  step: [
    { '@type': 'HowToStep', name: 'Выбор формата', position: 1 },
    { '@type': 'HowToStep', name: 'Анализ локации', position: 2 },
    { '@type': 'HowToStep', name: 'Бизнес-план и финансовый расчёт', position: 3 },
    { '@type': 'HowToStep', name: 'Регистрация бизнеса', position: 4 },
    { '@type': 'HowToStep', name: 'Покупка оборудования', position: 5 },
    { '@type': 'HowToStep', name: 'Строительство и монтаж', position: 6 },
    { '@type': 'HowToStep', name: 'Открытие и маркетинг', position: 7 },
  ],
}

const FORMATS = [
  {
    type: 'Самообслуживание',
    invest: 'от 1,9 млн ₽',
    roi: '55%',
    payback: '10–18 мес',
    pros: ['Нет персонала', 'Работа 24/7', 'Низкие расходы'],
    cons: ['Нужна высокая проходимость', 'Вандализм'],
    best: 'Трассы, АЗС, спальные районы',
    color: 'border-green-300 bg-green-50',
    badge: '🏆 Самый популярный',
  },
  {
    type: 'Ручная мойка',
    invest: 'от 3 млн ₽',
    roi: '25–35%',
    payback: '18–36 мес',
    pros: ['Высокий чек', 'Лояльность клиентов', 'Доп. услуги'],
    cons: ['Нужен персонал', 'Зависимость от сотрудников'],
    best: 'Центр города, деловые районы',
    color: 'border-blue-200 bg-blue-50',
    badge: null,
  },
  {
    type: 'Автоматическая (тоннель)',
    invest: 'от 5 млн ₽',
    roi: '30–40%',
    payback: '24–48 мес',
    pros: ['Высокая пропускная способность', 'Стабильный поток'],
    cons: ['Высокие инвестиции', 'Дорогое обслуживание'],
    best: 'АЗС, торговые центры, выезды из города',
    color: 'border-purple-200 bg-purple-50',
    badge: null,
  },
  {
    type: 'Детейлинг',
    invest: 'от 1,5 млн ₽',
    roi: '40–60%',
    payback: '12–24 мес',
    pros: ['Высокий чек (3–25 тыс. ₽)', 'Рост рынка +75%', 'Лояльная аудитория'],
    cons: ['Долгий цикл работы', 'Нужны квалифицированные мастера'],
    best: 'Спальные районы, возле дилеров',
    color: 'border-orange-200 bg-orange-50',
    badge: '📈 Самый быстрорастущий',
  },
]

const STEPS = [
  {
    n: '01',
    title: 'Выберите формат',
    text: 'Самообслуживание — оптимальный старт для большинства. Детейлинг — если есть навыки или готовность нанять мастеров. Ручная мойка — в локациях с высокой проходимостью.',
  },
  {
    n: '02',
    title: 'Найдите локацию',
    text: 'Критерии: трафик от 5 000 авто/день, видимость с дороги, парковка, подъезд. Лучшие места: вблизи АЗС, торговых центров, трасс. Радиус конкурентов: 500 м для города, 2 км для трасс.',
  },
  {
    n: '03',
    title: 'Составьте финансовую модель',
    text: 'Считайте реалистично: 60–70% от расчётной загрузки в первые 6 месяцев. Учтите сезонность: пик в марте–апреле и сентябре–октябре. Используйте наш калькулятор ROI.',
  },
  {
    n: '04',
    title: 'Зарегистрируйте бизнес',
    text: 'ИП на УСН 6% — оптимально для старта. ОКВЭД 45.20.3 (мойка автомобилей). Разрешения: СЭС, водоканал, пожнадзор. Договор аренды или покупки земли.',
  },
  {
    n: '05',
    title: 'Выберите оборудование',
    text: 'Самообслуживание: посты Kärcher, Ehrle или российские аналоги. Цена поста: 250–500 тыс. ₽. Дополнительно: терминал оплаты, видеонаблюдение, система учёта воды.',
  },
  {
    n: '06',
    title: 'Стройте и монтируйте',
    text: 'Тёплый бокс — необходимость для регионов с морозами. Утепление: до -40°C. Водоотведение и очистные сооружения — обязательно, иначе штрафы. Срок стройки: 2–4 месяца.',
  },
  {
    n: '07',
    title: 'Откройте и привлекайте клиентов',
    text: 'Первые клиенты: Яндекс Карты, 2ГИС, Промокоды в первый месяц. Программа лояльности — увеличивает возвращаемость на 40%. Таргет на местную аудиторию в VK.',
  },
]

const INVESTMENTS = [
  { item: 'Оборудование (4 поста)', min: 1200000, max: 2000000 },
  { item: 'Тёплый бокс (строительство)', min: 800000, max: 2000000 },
  { item: 'Подключение коммуникаций', min: 200000, max: 600000 },
  { item: 'Терминалы оплаты и ПО', min: 150000, max: 300000 },
  { item: 'Реклама и запуск', min: 100000, max: 300000 },
  { item: 'Оборотные средства', min: 200000, max: 500000 },
]

function formatM(n: number) {
  return (n / 1000000).toFixed(1) + ' млн'
}

export default function OpenCarwashPage() {
  const totalMin = INVESTMENTS.reduce((s, i) => s + i.min, 0)
  const totalMax = INVESTMENTS.reduce((s, i) => s + i.max, 0)

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <nav className="text-sm text-gray-400 mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-white">Главная</Link>
            <span>›</span>
            <span>Открыть автомойку</span>
          </nav>
          <h1 className="text-4xl font-bold mb-4">Как открыть автомойку в 2025 году</h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl">
            Пошаговый гайд: от выбора формата до первых клиентов. Реальные цифры рынка, без воды.
          </p>
          <div className="flex flex-wrap gap-6 text-sm">
            <div><span className="text-gray-400">Инвестиции</span><br /><strong className="text-2xl">от 1,9 млн ₽</strong></div>
            <div><span className="text-gray-400">Рентабельность</span><br /><strong className="text-2xl">до 55%</strong></div>
            <div><span className="text-gray-400">Окупаемость</span><br /><strong className="text-2xl">10–18 мес</strong></div>
            <div><span className="text-gray-400">Рост рынка</span><br /><strong className="text-2xl">+25%/год</strong></div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12">

        {/* Format comparison */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Шаг 1. Выберите формат</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FORMATS.map((f) => (
              <div key={f.type} className={`border-2 rounded-2xl p-5 ${f.color}`}>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-lg">{f.type}</h3>
                  {f.badge && <span className="text-xs bg-white px-2 py-1 rounded-full font-medium">{f.badge}</span>}
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm mb-4">
                  <div>
                    <div className="text-gray-500 text-xs">Инвестиции</div>
                    <div className="font-semibold">{f.invest}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs">ROI</div>
                    <div className="font-semibold">{f.roi}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs">Окупаемость</div>
                    <div className="font-semibold">{f.payback}</div>
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  {f.pros.map((p) => <div key={p} className="flex items-center gap-1.5"><span className="text-green-600">✓</span>{p}</div>)}
                  {f.cons.map((c) => <div key={c} className="flex items-center gap-1.5"><span className="text-red-500">✗</span>{c}</div>)}
                </div>
                <div className="mt-3 text-xs text-gray-500">📍 Лучшие места: {f.best}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Steps */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">7 шагов к открытию</h2>
          <div className="space-y-6">
            {STEPS.map((step) => (
              <div key={step.n} className="flex gap-5">
                <div className="flex-shrink-0 w-12 h-12 bg-[#e94560] text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {step.n}
                </div>
                <div className="pt-1">
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Investment breakdown */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Смета инвестиций (мойка самообслуживания, 4 поста)</h2>
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold">Статья</th>
                  <th className="text-right py-3 px-4 font-semibold">Минимум</th>
                  <th className="text-right py-3 px-4 font-semibold">Максимум</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {INVESTMENTS.map((inv) => (
                  <tr key={inv.item}>
                    <td className="py-3 px-4">{inv.item}</td>
                    <td className="py-3 px-4 text-right">{(inv.min / 1000).toFixed(0)} тыс. ₽</td>
                    <td className="py-3 px-4 text-right">{(inv.max / 1000).toFixed(0)} тыс. ₽</td>
                  </tr>
                ))}
                <tr className="bg-gray-50 font-semibold">
                  <td className="py-3 px-4">Итого</td>
                  <td className="py-3 px-4 text-right text-green-700">{formatM(totalMin)} млн ₽</td>
                  <td className="py-3 px-4 text-right text-orange-600">{formatM(totalMax)} млн ₽</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-400 mt-3">
            * Без учёта стоимости земельного участка. Аренда в регионах: 30–80 тыс. ₽/мес.
          </p>
        </section>

        {/* ROI CTA */}
        <div className="bg-[#1a1a2e] text-white rounded-2xl p-8 mb-16 text-center">
          <h2 className="text-2xl font-bold mb-3">Рассчитайте ROI для вашего города</h2>
          <p className="text-gray-300 mb-6">
            Укажите город, тип мойки и количество постов — получите ежемесячную прибыль и срок окупаемости.
          </p>
          <Link
            href="/tools/roi-calculator"
            className="inline-flex items-center px-6 py-3 bg-[#e94560] rounded-xl font-semibold hover:bg-[#c73652] transition-colors"
          >
            Открыть калькулятор →
          </Link>
        </div>

        {/* Documents checklist */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Документы для открытия</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              'Регистрация ИП / ООО, ОКВЭД 45.20.3',
              'Договор аренды или право собственности на землю',
              'Разрешение на строительство / реконструкцию',
              'Заключение СЭС (санитарно-эпидемиологическая служба)',
              'Согласование с Роспотребнадзором',
              'Договор с водоканалом (водоотведение)',
              'Разрешение пожнадзора',
              'Счёт в банке + эквайринг',
              'Кассовый аппарат (ФЗ-54)',
              'Договор на вывоз отходов',
            ].map((doc) => (
              <div key={doc} className="flex items-start gap-3 bg-gray-50 rounded-xl p-3">
                <span className="text-[#e94560] mt-0.5">☑</span>
                <span className="text-sm text-gray-700">{doc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Franchise alternative */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Открыть по франшизе?</h2>
          <p className="text-gray-600 mb-6">
            Франшиза снижает риски: готовая бизнес-модель, помощь с локацией, стандарты. Спрос вырос +40% в 2025 году.
          </p>
          <Link
            href="/franshizy"
            className="inline-flex items-center px-6 py-3 border-2 border-[#e94560] text-[#e94560] rounded-xl font-semibold hover:bg-[#e94560] hover:text-white transition-colors"
          >
            Смотреть все франшизы →
          </Link>
        </section>
      </div>
    </main>
  )
}
