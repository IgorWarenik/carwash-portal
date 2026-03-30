'use client'

import { useState } from 'react'
import { submitLead } from '@/lib/actions/lead'

function sanitizePhone(value: string): string {
  return value.replace(/\D/g, '').slice(0, 11)
}

function isValidRuPhone(phone: string): boolean {
  return phone.length === 11 && (phone[0] === '7' || phone[0] === '8')
}

export function LeadFormBuy() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [budget, setBudget] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  function validate() {
    const e: Record<string, string> = {}
    if (!name.trim() || name.trim().length < 2) e.name = 'Введите имя (минимум 2 символа)'
    if (!isValidRuPhone(phone)) e.phone = 'Введите номер в формате 7XXXXXXXXXX или 8XXXXXXXXXX (11 цифр)'
    return e
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    setErrors({})
    setLoading(true)
    const result = await submitLead({
      leadType: 'BUY',
      name: name.trim(),
      phone,
      message: budget ? `Бюджет: ${budget}` : undefined,
      pageType: 'kupit-avtomoiku',
    })
    setLoading(false)
    if (result.success) setSuccess(true)
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-3">✅</div>
        <h3 className="font-bold text-xl mb-2">Заявка принята!</h3>
        <p className="text-gray-300">Менеджер свяжется с вами в течение 2 часов.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Ваше имя</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Иван"
            className={`w-full bg-white/10 border rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none transition-colors ${errors.name ? 'border-red-400' : 'border-white/20 focus:border-[#e94560]'}`}
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Телефон</label>
          <input
            type="tel"
            inputMode="numeric"
            value={phone}
            onChange={(e) => setPhone(sanitizePhone(e.target.value))}
            placeholder="79001234567"
            className={`w-full bg-white/10 border rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none transition-colors ${errors.phone ? 'border-red-400' : 'border-white/20 focus:border-[#e94560]'}`}
          />
          {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
        </div>
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Бюджет</label>
        <select
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#e94560]"
        >
          <option value="">Выберите бюджет</option>
          <option value="до 2 млн ₽">До 2 млн ₽</option>
          <option value="2–5 млн ₽">2–5 млн ₽</option>
          <option value="5–10 млн ₽">5–10 млн ₽</option>
          <option value="свыше 10 млн ₽">Свыше 10 млн ₽</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-[#e94560] rounded-xl font-semibold hover:bg-[#c73652] transition-colors disabled:opacity-60"
      >
        {loading ? 'Отправляем...' : 'Отправить заявку'}
      </button>
      <p className="text-xs text-gray-500">Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности</p>
    </form>
  )
}
