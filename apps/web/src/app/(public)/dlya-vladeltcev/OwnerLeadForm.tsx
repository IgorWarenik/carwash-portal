'use client'

import { useState } from 'react'
import { submitLead } from '@/lib/actions/lead'

function sanitizePhone(v: string) { return v.replace(/\D/g, '').slice(0, 11) }
function isValidPhone(p: string) { return p.length === 11 && (p[0] === '7' || p[0] === '8') }

export function OwnerLeadForm() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [plan, setPlan] = useState('Pro')
  const [city, setCity] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate() {
    const e: Record<string, string> = {}
    if (name.trim().length < 2) e.name = 'Введите имя'
    if (!isValidPhone(phone)) e.phone = 'Введите номер: 79001234567'
    return e
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    setLoading(true)
    await submitLead({
      leadType: 'GENERAL',
      name: name.trim(),
      phone,
      message: `Тариф: ${plan}`,
      city: city || undefined,
      pageType: 'dlya-vladeltcev',
    })
    setLoading(false)
    setDone(true)
  }

  if (done) {
    return (
      <div className="text-center py-8">
        <div className="text-3xl mb-2">✅</div>
        <p className="font-bold text-white">Заявка принята!</p>
        <p className="text-gray-300 text-sm mt-1">Менеджер позвонит в течение 2 часов.</p>
      </div>
    )
  }

  const inputClass = (err: boolean) =>
    `w-full bg-white/10 border rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none transition-colors ${err ? 'border-red-400' : 'border-white/20 focus:border-[#e94560]'}`

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      <div>
        <input type="text" value={name} onChange={e => setName(e.target.value)}
          placeholder="Ваше имя" className={inputClass(!!errors.name)} />
        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
      </div>
      <div>
        <input type="tel" inputMode="numeric" value={phone}
          onChange={e => setPhone(sanitizePhone(e.target.value))}
          placeholder="Телефон: 79001234567" className={inputClass(!!errors.phone)} />
        {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
      </div>
      <select value={plan} onChange={e => setPlan(e.target.value)}
        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#e94560]">
        <option value="Базовый">Базовый — бесплатно</option>
        <option value="Pro">Pro — 2 990 ₽/мес</option>
        <option value="Premium">Premium — 7 900 ₽/мес</option>
      </select>
      <input type="text" value={city} onChange={e => setCity(e.target.value)}
        placeholder="Город (необязательно)" className={inputClass(false)} />
      <button type="submit" disabled={loading}
        className="w-full py-4 bg-[#e94560] text-white rounded-xl font-semibold hover:bg-[#c73652] transition-colors disabled:opacity-60">
        {loading ? 'Отправляем...' : 'Оставить заявку'}
      </button>
      <p className="text-xs text-gray-500">Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности</p>
    </form>
  )
}
