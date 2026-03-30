'use client'

import { useState } from 'react'
import { submitLead } from '@/lib/actions/lead'

function sanitizePhone(value: string): string {
  return value.replace(/\D/g, '').slice(0, 11)
}

function isValidRuPhone(phone: string): boolean {
  return phone.length === 11 && (phone[0] === '7' || phone[0] === '8')
}

const WASH_TYPES = [
  { value: 'self_service', label: 'Самообслуживание' },
  { value: 'manual', label: 'Ручная мойка' },
  { value: 'automatic', label: 'Портальная / автоматическая' },
  { value: 'detailing', label: 'Детейлинг' },
]

export function LeadFormSell() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [washType, setWashType] = useState('')
  const [city, setCity] = useState('')
  const [price, setPrice] = useState('')
  const [profit, setProfit] = useState('')
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
    const parts = [
      washType && `Тип: ${WASH_TYPES.find(t => t.value === washType)?.label}`,
      price && `Цена: ${price}`,
      profit && `Прибыль: ${profit}`,
    ].filter(Boolean)
    const result = await submitLead({
      leadType: 'SELL',
      name: name.trim(),
      phone,
      city: city.trim() || undefined,
      message: parts.join(', ') || undefined,
      pageType: 'prodaty-avtomoiku',
    })
    setLoading(false)
    if (result.success) setSuccess(true)
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-3">✅</div>
        <h3 className="font-bold text-xl mb-2">Заявка принята!</h3>
        <p className="text-gray-300">Аналитик свяжется в течение 24 часов для оценки бизнеса.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Ваше имя *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Александр"
            className={`w-full bg-white/10 border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors ${errors.name ? 'border-red-400' : 'border-white/20 focus:border-[#e94560]'}`}
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Телефон *</label>
          <input
            type="tel"
            inputMode="numeric"
            value={phone}
            onChange={(e) => setPhone(sanitizePhone(e.target.value))}
            placeholder="79001234567"
            className={`w-full bg-white/10 border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors ${errors.phone ? 'border-red-400' : 'border-white/20 focus:border-[#e94560]'}`}
          />
          {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Тип мойки</label>
          <select
            value={washType}
            onChange={(e) => setWashType(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#e94560]"
          >
            <option value="">Выберите тип</option>
            {WASH_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Город</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Москва"
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#e94560]"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Ожидаемая цена</label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="5 000 000 ₽"
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#e94560]"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Ежемесячная прибыль</label>
          <input
            type="text"
            value={profit}
            onChange={(e) => setProfit(e.target.value)}
            placeholder="150 000 ₽"
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#e94560]"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-[#e94560] rounded-xl font-semibold hover:bg-[#c73652] transition-colors disabled:opacity-60"
      >
        {loading ? 'Отправляем...' : 'Разместить объявление'}
      </button>
      <p className="text-xs text-gray-500">Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности</p>
    </form>
  )
}
