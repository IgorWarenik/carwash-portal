import type { Metadata } from 'next'
import Link from 'next/link'
import { LeadFormSell } from '@/components/LeadFormSell'
import { LeadFormSupplier } from '@/components/LeadFormSupplier'

export const metadata: Metadata = {
  title: 'Продать автомойку — разместить объявление о продаже бизнеса',
  description: 'Продайте автомойку быстро и выгодно. Верифицированные покупатели, помощь в оценке и сделке. Размещение объявления бесплатно.',
}

const ADVANTAGES = [
  { icon: '👥', title: 'Целевая аудитория', text: 'Только покупатели автомоечного бизнеса. Не смешиваем с ненужными объявлениями, как Авито.' },
  { icon: '✅', title: 'Верификация покупателей', text: 'Проверяем намерения и платёжеспособность потенциальных покупателей перед контактом.' },
  { icon: '📊', title: 'Оценка стоимости', text: 'Помогаем правильно оценить бизнес. Используем мультипликатор EBITDA и данные рынка.' },
  { icon: '⚖️', title: 'Юридическое сопровождение', text: 'Партнёрские юристы сопроводят сделку: проверка документов, договор купли-продажи.' },
]

const STEPS = [
  { n: '1', title: 'Оставьте заявку', text: 'Заполните форму ниже с базовой информацией о вашей мойке.' },
  { n: '2', title: 'Оценка бизнеса', text: 'Наш аналитик свяжется в течение 24 часов и проведёт предварительную оценку.' },
  { n: '3', title: 'Подготовка объявления', text: 'Вместе составим описание, соберём финансовые данные, сделаем фото.' },
  { n: '4', title: 'Публикация', text: 'Объявление выходит в каталог для инвесторов и подписчиков нашей рассылки.' },
  { n: '5', title: 'Показы покупателям', text: 'Проводим показы только с верифицированными покупателями с подтверждённым интересом.' },
  { n: '6', title: 'Сделка', text: 'Помогаем завершить сделку: документы, юрист, переоформление.' },
]

export default function SellCarwashPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <nav className="text-sm text-gray-400 mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-white">Главная</Link>
            <span>›</span>
            <span>Продать автомойку</span>
          </nav>
          <h1 className="text-4xl font-bold mb-4">Продайте автомойку выгодно</h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl">
            Размещаем объявление среди проверенных инвесторов. Средний срок продажи — 2–4 месяца vs 8–12 на Авито.
          </p>
          <div className="flex flex-wrap gap-6 text-sm">
            <div><div className="text-gray-400">Объявлений размещено</div><div className="font-bold text-2xl">267+</div></div>
            <div><div className="text-gray-400">Сделок закрыто</div><div className="font-bold text-2xl">84</div></div>
            <div><div className="text-gray-400">Средний срок продажи</div><div className="font-bold text-2xl">3 мес</div></div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12">

        {/* Advantages */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold mb-8 text-center">Почему продавать через нас</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ADVANTAGES.map(a => (
              <div key={a.title} className="bg-gray-50 rounded-2xl p-5">
                <div className="text-3xl mb-3">{a.icon}</div>
                <h3 className="font-semibold mb-2">{a.title}</h3>
                <p className="text-sm text-gray-600">{a.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Steps */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold mb-8">Как проходит продажа</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {STEPS.map(step => (
              <div key={step.n} className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[#e94560] text-white rounded-full flex items-center justify-center font-bold">{step.n}</div>
                <div>
                  <h3 className="font-semibold mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Form */}
        <section id="seller-form" className="bg-[#1a1a2e] text-white rounded-2xl p-8 mb-14">
          <h2 className="text-2xl font-bold mb-2">Оставить заявку на продажу</h2>
          <p className="text-gray-400 mb-8">Заполните форму — менеджер свяжется в течение 2 часов в рабочее время.</p>
          <div className="max-w-2xl">
            <LeadFormSell />
          </div>
        </section>

        {/* Supplier form anchor */}
        <section id="supplier-form" className="bg-blue-50 border border-blue-100 rounded-2xl p-8">
          <h2 className="text-xl font-bold mb-2">Вы поставщик оборудования или услуг?</h2>
          <p className="text-gray-600 mb-6">
            Разместите вашу компанию в каталоге поставщиков — более 5 000 предпринимателей в месяц ищут здесь оборудование и партнёров.
          </p>
          <LeadFormSupplier />
        </section>

      </div>
    </main>
  )
}
