'use client'

import { useState } from 'react'
import { submitLead } from '@/lib/actions/lead'

function sanitizePhone(value: string): string {
  return value.replace(/\D/g, '').slice(0, 11)
}

export function LeadFormSupplier() {
  const [company, setCompany] = useState('')
  const [phone, setPhone] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  function validate() {
    const e: Record<string, string> = {}
    if (!company.trim() || company.trim().length < 2) e.company = 'Введите название компании'
    if (!phone || phone.length < 10) e.phone = 'Введите корректный номер телефона'
    return e
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    setErrors({})
    setLoading(true)
    const result = await submitLead({
      leadType: 'SUPPLIER',
      name: company.trim(),
      phone,
      pageType: 'prodaty-avtomoiku-supplier',
    })
    setLoading(false)
    if (result.success) setSuccess(true)
  }

  if (success) {
    return (
      <div className="py-4">
        <div className="text-3xl mb-2">✅</div>
        <h3 className="font-bold text-lg mb-1">Заявка принята!</h3>
        <p className="text-gray-600 text-sm">Свяжемся в течение 1 рабочего дня.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
      <div>
        <label className="block text-sm text-gray-600 mb-1">Название компании</label>
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="ООО «ТехМойка»"
          className={`w-full border rounded-xl px-4 py-3 focus:outline-none transition-colors ${errors.company ? 'border-red-400 focus:border-red-400' : 'border-gray-300 focus:border-[#e94560]'}`}
        />
        {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company}</p>}
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-1">Телефон</label>
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
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-[#1a1a2e] text-white rounded-xl font-semibold hover:bg-[#0f0f20] transition-colors disabled:opacity-60"
        >
          {loading ? 'Отправляем...' : 'Подать заявку на размещение'}
        </button>
      </div>
    </form>
  )
}
