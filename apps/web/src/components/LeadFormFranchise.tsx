'use client'

import { useState } from 'react'
import { submitLead } from '@/lib/actions/lead'

function sanitizePhone(value: string): string {
  return value.replace(/\D/g, '').slice(0, 11)
}

const FRANCHISES = ['150bar', 'Сухомой', 'МОЙ-КА!', 'GEIZER', 'ALLES', 'АкваСтандарт', 'Пока не определился']

export function LeadFormFranchise() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [budget, setBudget] = useState('')
  const [franchise, setFranchise] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  function validate() {
    const e: Record<string, string> = {}
    if (!name.trim() || name.trim().length < 2) e.name = 'Введите имя (минимум 2 символа)'
    if (!phone || phone.length < 10) e.phone = 'Введите корректный номер телефона'
    return e
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    setErrors({})
    setLoading(true)
    const parts = [budget && `Бюджет: ${budget}`, franchise && `Франшиза: ${franchise}`].filter(Boolean)
    const result = await submitLead({
      leadType: 'FRANCHISE',
      name: name.trim(),
      phone,
      city: city.trim() || undefined,
      message: parts.join(', ') || undefined,
      pageType: 'kupit-franshizu',
    })
    setLoading(false)
    if (result.success) setSuccess(true)
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-3">✅</div>
        <h3 className="font-bold text-xl mb-2 text-gray-900">Заявка принята!</h3>
        <p className="text-gray-500">Наш менеджер свяжется с вами в течение 2 часов.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ваше имя *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Александр"
            className={`w-full border rounded-xl px-4 py-3 focus:outline-none transition-colors ${errors.name ? 'border-red-400 focus:border-red-400' : 'border-gray-300 focus:border-[#e94560]'}`}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Телефон *</label>
          <input
            type="tel"
            inputMode="numeric"
            value={phone}
            onChange={(e) => setPhone(sanitizePhone(e.target.value))}
            placeholder="79001234567"
            className={`w-full border rounded-xl px-4 py-3 focus:outline-none transition-colors ${errors.phone ? 'border-red-400 focus:border-red-400' : 'border-gray-300 focus:border-[#e94560]'}`}
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Город</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Ваш город"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-[#e94560]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Бюджет</label>
          <select
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-[#e94560]"
          >
            <option value="">Выберите бюджет</option>
            <option value="до 1 млн ₽">До 1 млн ₽</option>
            <option value="1–3 млн ₽">1–3 млн ₽</option>
            <option value="3–7 млн ₽">3–7 млн ₽</option>
            <option value="свыше 7 млн ₽">Свыше 7 млн ₽</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Интересующая франшиза</label>
        <select
          value={franchise}
          onChange={(e) => setFranchise(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-[#e94560]"
        >
          <option value="">Выберите франшизу</option>
          {FRANCHISES.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-[#e94560] text-white rounded-xl font-semibold hover:bg-[#c73652] transition-colors disabled:opacity-60"
      >
        {loading ? 'Отправляем...' : 'Получить консультацию'}
      </button>
      <p className="text-xs text-gray-400">Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности</p>
    </form>
  )
}
