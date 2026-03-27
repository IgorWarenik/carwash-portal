import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Купить франшизу автомойки — заявка и консультация',
  description: 'Подайте заявку на покупку франшизы автомойки. 6 проверенных франшиз от 470 тыс. ₽. Бесплатная консультация.',
}

export default function BuyFranchisePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-[#e94560]">Главная</Link>
        <span>›</span>
        <Link href="/franshizy" className="hover:text-[#e94560]">Франшизы</Link>
        <span>›</span>
        <span>Получить предложение</span>
      </nav>

      <h1 className="text-3xl font-bold mb-3">Получить предложение по франшизе</h1>
      <p className="text-gray-500 mb-10">
        Оставьте заявку — подберём франшизу под ваш бюджет и регион. Консультация бесплатна.
      </p>

      <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-10">
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ваше имя *</label>
              <input type="text" placeholder="Александр" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-[#e94560]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Телефон *</label>
              <input type="tel" placeholder="+7 (___) ___-__-__" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-[#e94560]" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Город</label>
              <input type="text" placeholder="Ваш город" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-[#e94560]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Бюджет</label>
              <select className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-[#e94560]">
                <option>До 1 млн ₽</option>
                <option>1–3 млн ₽</option>
                <option>3–6 млн ₽</option>
                <option>Более 6 млн ₽</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Интересующая франшиза</label>
            <select className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-[#e94560]">
              <option value="">Помогите подобрать</option>
              <option>150bar</option>
              <option>Сухомой</option>
              <option>МОЙ-КА!</option>
              <option>GEIZER</option>
              <option>ALLES</option>
              <option>Автомойка Экспресс</option>
            </select>
          </div>
          <button className="w-full py-4 bg-[#e94560] text-white rounded-xl font-semibold hover:bg-[#c73652] transition-colors">
            Отправить заявку
          </button>
          <p className="text-xs text-gray-400 text-center">Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности. Менеджер свяжется в течение 2 часов.</p>
        </div>
      </div>

      <Link href="/franshizy" className="flex items-center gap-2 text-[#e94560] font-semibold hover:underline">
        ← Вернуться к сравнению франшиз
      </Link>
    </main>
  )
}
