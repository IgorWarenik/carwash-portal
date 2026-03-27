import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Политика конфиденциальности',
  description: 'Политика конфиденциальности Портала Автомоек.',
  robots: { index: false, follow: false },
}

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-[#e94560]">Главная</Link>
        <span>›</span>
        <span>Политика конфиденциальности</span>
      </nav>

      <h1 className="text-3xl font-bold mb-2">Политика конфиденциальности</h1>
      <p className="text-gray-500 mb-10">Последнее обновление: 1 января 2025 года</p>

      <div className="prose prose-gray max-w-none space-y-8 text-gray-700">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">1. Общие положения</h2>
          <p>Настоящая Политика конфиденциальности (далее — «Политика») описывает, как ООО «Портал Автомоек» (далее — «Компания», «мы») собирает, использует и защищает персональные данные пользователей сайта avtomoyki-portal.ru (далее — «Сайт»).</p>
          <p className="mt-2">Используя Сайт, вы соглашаетесь с условиями настоящей Политики. Если вы не согласны — прекратите использование Сайта.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">2. Какие данные мы собираем</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Имя и контактные данные (телефон, email) — при заполнении форм обратной связи</li>
            <li>Данные об использовании Сайта: IP-адрес, браузер, страницы посещений (через Яндекс Метрику)</li>
            <li>Куки (cookies) — для корректной работы сайта и аналитики</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">3. Цели обработки данных</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Обработка заявок и обратная связь с пользователями</li>
            <li>Улучшение функциональности Сайта</li>
            <li>Аналитика посещаемости (агрегированные данные)</li>
            <li>Информирование об услугах (только с вашего согласия)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">4. Передача данных третьим лицам</h2>
          <p>Мы не продаём и не передаём ваши персональные данные третьим лицам, за исключением:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Случаев, когда это требуется по закону</li>
            <li>Передачи франчайзеру или продавцу бизнеса — только с вашего явного согласия при подаче заявки</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">5. Хранение и защита данных</h2>
          <p>Данные хранятся на защищённых серверах в России. Мы используем шифрование HTTPS, ограниченный доступ сотрудников и регулярный аудит безопасности.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">6. Ваши права</h2>
          <p>Вы вправе запросить доступ к вашим данным, их исправление или удаление. Для этого напишите на <a href="mailto:privacy@avtomoyki-portal.ru" className="text-[#e94560] hover:underline">privacy@avtomoyki-portal.ru</a>.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">7. Куки</h2>
          <p>Сайт использует куки для аналитики (Яндекс Метрика) и корректной работы форм. Вы можете отключить куки в настройках браузера, однако некоторые функции Сайта могут перестать работать.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">8. Контакты</h2>
          <p>По вопросам конфиденциальности: <a href="mailto:privacy@avtomoyki-portal.ru" className="text-[#e94560] hover:underline">privacy@avtomoyki-portal.ru</a></p>
        </section>
      </div>
    </main>
  )
}
