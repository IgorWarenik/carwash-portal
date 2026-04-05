'use client'

import { useState } from 'react'
import { submitLead } from '@/lib/actions/lead'

function sanitizePhone(value: string): string {
  return value.replace(/\D/g, '').slice(0, 11)
}

function isValidRuPhone(phone: string): boolean {
  return phone.length === 11 && (phone[0] === '7' || phone[0] === '8')
}

export function LeadFormBuy({ compact }: { compact?: boolean } = {}) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [budget, setBudget] = useState('')
  const [done, setDone] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  function validate() {
    const e: Record<string, string> = {}
    if (!name.trim() || name.trim().length < 2) e.name = 'Введите имя (минимум 2 символа)'
    if (!isValidRuPhone(phone)) e.phone = 'Введите номер: 79001234567 (11 цифр)'
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
    if (result.success) setDone(true)
    else setErrors({ phone: 'Ошибка при отправке заявки. Попробуйте ещё раз.' })
  }

  if (done) {
    return (
      <div className={`text-center ${compact ? 'py-4' : 'py-8'}`}>
        <div className="text-3xl mb-2">✅</div>
        <p className={`font-bold ${compact ? 'text-gray-900' : 'text-white'}`}>Заявка принята!</p>
        {!compact && <p className="text-gray-300 text-sm mt-1">Менеджер свяжется с вами в течение 2 часов.</p>}
      </div>
    )
  }

  const inputClass = (hasError: boolean) => compact
    ? `w-full border rounded-xl px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none transition-colors ${hasError ? 'border-red-400' : 'border-gray-200 focus:border-[#e94560]'}`
    : `w-full bg-white/10 border rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none transition-colors ${hasError ? 'border-red-400' : 'border-white/20 focus:border-[#e94560]'}`

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      <div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ваше имя"
          className={inputClass(!!errors.name)}
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>
      <div>
        <input
          type="tel"
          inputMode="numeric"
          value={phone}
          onChange={(e) => setPhone(sanitizePhone(e.target.value))}
          placeholder="Телефон: 79001234567"
          className={inputClass(!!errors.phone)}
        />
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
      </div>
      {!compact && (
        <select
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#e94560]"
        >
          <option value="">Бюджет (необязательно)</option>
          <option value="до 2 млн ₽">До 2 млн ₽</option>
          <option value="2–5 млн ₽">2–5 млн ₽</option>
          <option value="5–10 млн ₽">5–10 млн ₽</option>
          <option value="свыше 10 млн ₽">Свыше 10 млн ₽</option>
        </select>
      )}
      <button
        type="submit"
        disabled={loading}
        className={`w-full rounded-xl font-semibold bg-[#e94560] text-white hover:bg-[#c73652] transition-colors disabled:opacity-60 ${compact ? 'py-2.5 text-sm' : 'py-4'}`}
      >
        {loading ? 'Отправляем...' : 'Оставить заявку'}
      </button>
      {!compact && <p className="text-xs text-gray-500">Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности</p>}
    </form>
  )
}
