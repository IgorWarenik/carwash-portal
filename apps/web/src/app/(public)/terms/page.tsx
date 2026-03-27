import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Условия использования',
  description: 'Условия использования сайта Портал Автомоек.',
  robots: { index: false, follow: false },
}

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-[#e94560]">Главная</Link>
        <span>›</span>
        <span>Условия использования</span>
      </nav>

      <h1 className="text-3xl font-bold mb-2">Условия использования</h1>
      <p className="text-gray-500 mb-10">Последнее обновление: 1 января 2025 года</p>

      <div className="prose prose-gray max-w-none space-y-8 text-gray-700">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">1. Принятие условий</h2>
          <p>Используя сайт avtomoyki-portal.ru, вы принимаете настоящие Условия использования. Если вы не согласны — прекратите использование Сайта.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">2. Описание услуг</h2>
          <p>Портал Автомоек предоставляет:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Информационный каталог автомоек с адресами, ценами и отзывами</li>
            <li>Объявления о продаже автомоечного бизнеса</li>
            <li>Информацию о франшизах автомоек</li>
            <li>Онлайн-инструменты (калькуляторы) для расчёта окупаемости</li>
            <li>Статьи и аналитические материалы по рынку</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">3. Точность информации</h2>
          <p>Мы стремимся поддерживать актуальность данных, однако не несём ответственности за их достоверность. Данные о ценах, рейтингах и часах работы моек могут устаревать. Перед визитом рекомендуем уточнять информацию напрямую у предприятия.</p>
          <p className="mt-2">Финансовые показатели в объявлениях о продаже бизнеса предоставляются продавцами. Портал проводит базовую верификацию, но не гарантирует абсолютную точность данных. Рекомендуем проводить независимый аудит перед сделкой.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">4. Ограничение ответственности</h2>
          <p>Портал Автомоек не является стороной сделок купли-продажи бизнеса или франшизных соглашений. Все сделки совершаются напрямую между пользователями. Мы не несём ответственности за убытки, возникшие в результате таких сделок.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">5. Правила размещения объявлений</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Запрещено размещение заведомо ложной информации</li>
            <li>Объявления проходят модерацию перед публикацией</li>
            <li>Мы вправе удалить объявление без объяснения причин</li>
            <li>Одно объявление — один объект продажи</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">6. Интеллектуальная собственность</h2>
          <p>Все материалы Сайта (тексты, изображения, данные) защищены авторским правом. Копирование без письменного разрешения запрещено. Ссылка на источник обязательна при цитировании.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">7. Изменения условий</h2>
          <p>Мы вправе изменять настоящие Условия в любое время. Продолжение использования Сайта после изменений означает ваше согласие с новыми условиями.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">8. Контакты</h2>
          <p>По вопросам: <a href="mailto:info@avtomoyki-portal.ru" className="text-[#e94560] hover:underline">info@avtomoyki-portal.ru</a></p>
        </section>
      </div>
    </main>
  )
}
