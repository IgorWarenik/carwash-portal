'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { processClaimUpdate } from '@/lib/actions/claim'

interface ClaimFormProps {
  token: string
  initial: {
    phone: string
    workingHours: string
    priceFrom?: number
    priceTo?: number
    description: string
    services: string[]
  }
}

export function ClaimForm({ token, initial }: ClaimFormProps) {
  const router = useRouter()
  const [phone, setPhone] = useState(initial.phone)
  const [workingHours, setWorkingHours] = useState(initial.workingHours)
  const [priceFrom, setPriceFrom] = useState(initial.priceFrom?.toString() ?? '')
  const [priceTo, setPriceTo] = useState(initial.priceTo?.toString() ?? '')
  const [description, setDescription] = useState(initial.description)
  const [servicesText, setServicesText] = useState(initial.services.join(', '))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    setLoading(true)
    setError('')

    const result = await processClaimUpdate({
      token,
      phone: phone || undefined,
      workingHours: workingHours || undefined,
      priceFrom: priceFrom ? Number(priceFrom) : undefined,
      priceTo: priceTo ? Number(priceTo) : undefined,
      description: description || undefined,
      services: servicesText ? servicesText.split(',').map(s => s.trim()).filter(Boolean) : undefined,
    })

    setLoading(false)
    if (result.success && result.citySlug && result.carwashSlug) {
      router.push(`/avtomoyki/${result.citySlug}/${result.carwashSlug}?claimed=1`)
    } else {
      setError(result.error ?? 'Что-то пошло не так')
    }
  }

  const inputClass = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#e94560] transition-colors'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Телефон</label>
        <input
          type="tel"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder="+7 900 123-45-67"
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Режим работы</label>
        <input
          type="text"
          value={workingHours}
          onChange={e => setWorkingHours(e.target.value)}
          placeholder="Например: 8:00–22:00 или 24/7"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Цена от (₽)</label>
          <input
            type="number"
            value={priceFrom}
            onChange={e => setPriceFrom(e.target.value)}
            placeholder="100"
            min={0}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Цена до (₽)</label>
          <input
            type="number"
            value={priceTo}
            onChange={e => setPriceTo(e.target.value)}
            placeholder="500"
            min={0}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Описание</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
          placeholder="Расскажите о вашей мойке: особенности, оборудование, преимущества..."
          className={`${inputClass} resize-none`}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Услуги <span className="text-gray-400 font-normal">(через запятую)</span>
        </label>
        <input
          type="text"
          value={servicesText}
          onChange={e => setServicesText(e.target.value)}
          placeholder="Пылесосы, Химчистка, Полировка, Бесконтактная оплата"
          className={inputClass}
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-lg px-4 py-2">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-[#e94560] text-white rounded-xl font-semibold hover:bg-[#c73652] transition-colors disabled:opacity-60"
      >
        {loading ? 'Сохраняем...' : 'Сохранить и опубликовать'}
      </button>

      <p className="text-xs text-gray-400 text-center">
        Данные будут отображены на странице вашей автомойки после сохранения.
        Карточка получит отметку «Верифицировано владельцем».
      </p>
    </form>
  )
}
