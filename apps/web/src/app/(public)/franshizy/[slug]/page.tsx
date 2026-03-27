import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@carwash/db'

interface Props { params: { slug: string } }

const FRANCHISE_DETAILS: Record<string, {
  founded: string; regions: number; fullDesc: string
  pros: string[]; requirements: string[]; steps: string[]
  faq: Array<{ q: string; a: string }>
}> = {
  '150bar': {
    founded: '2014', regions: 42,
    fullDesc: '150bar — крупнейшая сеть автомоек самообслуживания в России с запатентованной технологией тёплых боксов. Оборудование работает при температуре до -40°C. Средняя выручка точки — 350 000 ₽/мес, чистая прибыль — 150 000 ₽/мес.',
    pros: ['Запатентованные тёплые боксы работают при -40°C', 'Окупаемость менее 1 года при правильной локации', 'Полное сопровождение: локация, стройка, оборудование', 'Проверенная система управления на расстоянии', 'Более 127 точек в 42 регионах'],
    requirements: ['Капитал от 1 900 000 ₽', 'Участок 150–400 кв.м', 'Трафик от 5 000 авт/день рядом', 'Ип или ООО', 'Готовность следовать стандартам'],
    steps: ['Заявка и первичная консультация', 'Подбор локации совместно с аналитиком', 'Заключение договора франшизы', 'Строительство и монтаж (60–90 дней)', 'Обучение и запуск', 'Поддержка на всём сроке'],
    faq: [
      { q: 'Почему тёплые боксы важны?', a: 'В России 6–7 месяцев в году температура опускается ниже нуля. Тёплый бокс позволяет мыть машину при любой погоде, тогда как конкуренты теряют выручку зимой.' },
      { q: 'Можно ли открыть в небольшом городе?', a: 'Да, 150bar успешно работают в городах от 100 000 человек. Главное — правильная локация с трафиком.' },
      { q: 'Что происходит после окупаемости?', a: 'Роялти 5% от выручки. При средней выручке 350 тыс./мес — это 17 500 ₽ в месяц при чистой прибыли 150 000 ₽.' },
    ],
  },
  'sukhomoy': {
    founded: '2011', regions: 28,
    fullDesc: 'Сухомой — пионер бесконтактной мойки без воды в России. Уникальный формат: специальный состав наносится на кузов, полируется вручную — без воды, без канализации, без разрешений Водоканала. Это снижает порог входа до 800 000 ₽.',
    pros: ['Не нужна канализация и подключение к водопроводу', 'Минимальные разрешения (нет норм водоотведения)', 'Работает в любом помещении: паркинг, торговый центр', 'С 2011 года — самый опытный игрок в нише', 'Более 160 точек по РФ'],
    requirements: ['Капитал от 800 000 ₽', 'Помещение или площадка 40–60 кв.м', 'Договор с поставщиком химии Сухомой', 'ИП или ООО', 'Желательно: аренда в ТЦ или парковке'],
    steps: ['Заявка', 'Обучение мастеров (2 дня)', 'Заключение договора', 'Поставка химии и инвентаря', 'Запуск через 2–4 недели', 'Поддержка по телефону'],
    faq: [
      { q: 'Это экологично?', a: 'Да, специальный состав биоразлагаем. Не нужна система очистки воды.' },
      { q: 'Насколько качественна мойка?', a: 'Подходит для регулярного ухода. Для сильных загрязнений после трасс рекомендуется обычная мойка.' },
      { q: 'Где лучше открывать?', a: 'Лучшие локации: паркинги ТЦ, бизнес-центры, жилые комплексы. Не подходит для трасс.' },
    ],
  },
  'moyka': {
    founded: '2017', regions: 31,
    fullDesc: 'МОЙ-КА! — технологичная сеть с собственным мобильным приложением, системой лояльности и кешбэком. Более 90 точек в России. Выгодно отличается от конкурентов цифровой инфраструктурой, которая увеличивает возвращаемость клиентов на 40%.',
    pros: ['Собственное мобильное приложение с 50 000+ пользователей', 'Программа лояльности увеличивает LTV клиента', 'CRM и аналитика в реальном времени', 'Маркетинговая поддержка от сети', 'Более 90 точек в 31 регионе'],
    requirements: ['Капитал от 2 500 000 ₽', 'Участок от 200 кв.м', 'Готовность работать с CRM-системой', 'ИП или ООО', 'Трафик от 7 000 авт/день'],
    steps: ['Заявка и бизнес-интервью', 'Анализ локации', 'Договор + паушальный взнос', 'Строительство под стандарты МОЙ-КА!', 'Подключение к приложению и CRM', 'Запуск с маркетинговой акцией'],
    faq: [
      { q: 'Что такое программа лояльности?', a: 'Клиенты получают кешбэк 5% за каждую мойку. Бонусы копятся в приложении. Это приводит к повторным визитам.' },
      { q: 'Как работает мобильное приложение?', a: 'Клиент видит ближайшие мойки, очереди онлайн, активирует посты через приложение, накапливает бонусы.' },
      { q: 'Насколько высоки операционные расходы?', a: 'Роялти 7% от выручки + технологическая плата за приложение ~15 000 ₽/мес. Компенсируется более высокой загрузкой.' },
    ],
  },
  'geizer': {
    founded: '2018', regions: 18,
    fullDesc: 'GEIZER — франшиза автомоек самообслуживания с IoT-управлением. Каждый пост подключён к облачной системе мониторинга. Владелец видит загрузку, выручку и неисправности в реальном времени с телефона. Чистая прибыль от 100 000 ₽/пост/мес.',
    pros: ['IoT-мониторинг: управление бизнесом с телефона', 'Прибыль от 100 000 ₽/пост/мес', 'Более 60 авто/день на пост', 'Работа 24/7 без персонала', 'Предиктивная диагностика оборудования'],
    requirements: ['Капитал от 2 000 000 ₽', 'Участок от 180 кв.м', 'Электроснабжение от 100 кВт', 'ИП или ООО', 'Интернет для IoT-подключения'],
    steps: ['Заявка и анализ локации', 'Договор', 'Монтаж с подключением IoT', 'Настройка облачного управления', 'Запуск', 'Дистанционный мониторинг'],
    faq: [
      { q: 'Что можно контролировать дистанционно?', a: 'Загрузку постов в реальном времени, выручку по часам, расход химии, неисправности оборудования, температуру в боксах.' },
      { q: 'Нужен ли персонал?', a: 'Нет, мойка работает без персонала. Достаточно 1 человека для уборки и пополнения химии раз в 2–3 дня.' },
      { q: 'Как быстро реагируют на поломки?', a: 'Система отправляет SMS при любой аномалии. Сервисная бригада GEIZER выезжает в течение 24 часов.' },
    ],
  },
  'alles': {
    founded: '2016', regions: 22,
    fullDesc: 'ALLES — сеть автомоек на немецком оборудовании Kärcher Professional. Вошла в Топ-100 франшиз Forbes 2024. Единственная франшиза в России, которая работает исключительно с оборудованием Kärcher и обязывает использовать сертифицированную химию. Целевая аудитория — средний и премиум сегмент.',
    pros: ['Немецкое оборудование Kärcher Professional', 'Топ-100 франшиз Forbes 2024', 'Премиум-сегмент: средний чек 500–900 ₽', 'Высокие стандарты качества и сервиса', 'Сертификация персонала Kärcher'],
    requirements: ['Капитал от 3 000 000 ₽', 'Участок от 250 кв.м', 'Понимание премиум-клиента', 'ИП или ООО', 'Готовность к обучению'],
    steps: ['Заявка и собеседование', 'Проверка локации аналитиком ALLES', 'Договор + обучение в учебном центре', 'Строительство по стандарту Kärcher', 'Монтаж оборудования Kärcher', 'Сертификация и запуск'],
    faq: [
      { q: 'Почему Kärcher дороже?', a: 'Ресурс насосов Kärcher в 3 раза выше аналогов, давление стабильно, качество мойки заметно лучше. Клиенты возвращаются.' },
      { q: 'Что входит в Топ-100 Forbes?', a: 'Критерии Forbes: устойчивость сети, финансовая прозрачность, поддержка франчайзи, рост числа точек.' },
      { q: 'Можно ли сэкономить на химии?', a: 'Нет, договор франшизы обязывает использовать сертифицированную химию ALLES/Kärcher. Это условие качества.' },
    ],
  },
  'avtomoyka-express': {
    founded: '2019', regions: 12,
    fullDesc: 'Автомойка Экспресс — самый доступный вход во франшизный рынок автомоек России. Формат: 1–2 поста самообслуживания с минимальными вложениями. Инвестиции от 470 000 ₽, доход с первого месяца работы от 200 000 ₽.',
    pros: ['Самый низкий порог входа: от 470 000 ₽', 'Доход с первого месяца', 'Быстрый запуск: 4–6 недель', 'Роялти всего 4% — минимум среди конкурентов', 'Подходит для малых городов от 50 000 жителей'],
    requirements: ['Капитал от 470 000 ₽', 'Участок от 80 кв.м', 'Минимальный трафик от 2 000 авт/день', 'ИП', 'Личное участие в управлении на старте'],
    steps: ['Заявка', 'Онлайн-консультация', 'Договор', 'Поставка оборудования (4 недели)', 'Самостоятельный монтаж по инструкции', 'Запуск'],
    faq: [
      { q: 'Подходит для новичков?', a: 'Да, это самая простая модель. 1–2 поста, один терминал, минимум сложностей.' },
      { q: 'Почему такие низкие инвестиции?', a: 'Поставляется более компактное оборудование. Нет дорогих тёплых боксов — их строят по желанию.' },
      { q: 'Есть ли ограничения по территории?', a: 'Да, минимальный радиус эксклюзивности — 2 км в городах до 200 000 жителей.' },
    ],
  },
}

function formatRub(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} млн ₽`
  return `${Math.round(n / 1000)} тыс. ₽`
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const f = await prisma.franchise.findUnique({ where: { slug: params.slug } })
  if (!f) return {}
  return {
    title: `Франшиза ${f.name} — условия, инвестиции, отзывы 2025`,
    description: `Франшиза ${f.name}: инвестиции от ${f.investmentFrom ? formatRub(f.investmentFrom) : '—'}, окупаемость ${f.paybackMonths} мес, роялти ${f.royalty}%. Подробные условия, отзывы франчайзи, как подать заявку.`,
  }
}

export default async function FranchiseDetailPage({ params }: Props) {
  const f = await prisma.franchise.findUnique({ where: { slug: params.slug } })
  if (!f) notFound()

  const details = FRANCHISE_DETAILS[params.slug]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `Франшиза ${f.name}`,
    description: f.description,
    offers: f.investmentFrom ? { '@type': 'Offer', price: f.investmentFrom, priceCurrency: 'RUB' } : undefined,
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-[#e94560]">Главная</Link>
        <span>›</span>
        <Link href="/franshizy" className="hover:text-[#e94560]">Франшизы</Link>
        <span>›</span>
        <span className="text-gray-900">{f.name}</span>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white rounded-2xl p-8 mb-10">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Франшиза {f.name}</h1>
            {details && <p className="text-gray-300 text-sm">С {details.founded} года · {details.regions} регионов</p>}
          </div>
          <a href="/kupit-franshizu" className="px-6 py-3 bg-[#e94560] rounded-xl font-semibold hover:bg-[#c73652] transition-colors text-sm">
            Получить предложение
          </a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-8">
          <div><div className="text-gray-400 text-sm">Инвестиции</div><div className="font-bold text-xl">{f.investmentFrom ? formatRub(f.investmentFrom) : '—'}</div></div>
          <div><div className="text-gray-400 text-sm">Роялти</div><div className="font-bold text-xl">{f.royalty}%</div></div>
          <div><div className="text-gray-400 text-sm">Окупаемость</div><div className="font-bold text-xl">{f.paybackMonths} мес.</div></div>
          <div><div className="text-gray-400 text-sm">Постов</div><div className="font-bold text-xl">{f.postsCount}</div></div>
        </div>
      </div>

      {/* Description */}
      {details && (
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">О франшизе</h2>
          <p className="text-gray-600 leading-relaxed">{details.fullDesc}</p>
        </section>
      )}

      {/* Pros */}
      {details && (
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-5">Преимущества</h2>
          <div className="space-y-3">
            {details.pros.map((pro, i) => (
              <div key={i} className="flex items-start gap-3 bg-green-50 border border-green-100 rounded-xl p-4">
                <span className="text-green-600 font-bold mt-0.5">✓</span>
                <span className="text-gray-700">{pro}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
        {/* Requirements */}
        {details && (
          <section>
            <h2 className="text-xl font-bold mb-4">Требования</h2>
            <ul className="space-y-2">
              {details.requirements.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-[#e94560] mt-0.5">•</span>{r}
                </li>
              ))}
            </ul>
          </section>
        )}
        {/* Steps */}
        {details && (
          <section>
            <h2 className="text-xl font-bold mb-4">Шаги к открытию</h2>
            <ol className="space-y-2">
              {details.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                  <span className="flex-shrink-0 w-6 h-6 bg-[#e94560] text-white rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>

      {/* FAQ */}
      {details && details.faq.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-5">Вопросы и ответы</h2>
          <div className="space-y-4">
            {details.faq.map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-semibold mb-2">{item.q}</h3>
                <p className="text-gray-600 text-sm">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <div className="bg-[#1a1a2e] text-white rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-3">Хотите открыть {f.name}?</h2>
        <p className="text-gray-300 mb-6">Оставьте заявку — франчайзер свяжется и расскажет о свободных территориях в вашем регионе.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/kupit-franshizu" className="px-6 py-3 bg-[#e94560] rounded-xl font-semibold hover:bg-[#c73652] transition-colors">
            Оставить заявку
          </Link>
          <Link href="/tools/roi-calculator" className="px-6 py-3 bg-white/10 border border-white/20 rounded-xl font-semibold hover:bg-white/20 transition-colors">
            Рассчитать ROI
          </Link>
        </div>
      </div>
    </main>
  )
}
