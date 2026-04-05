'use client'

import { useState } from 'react'
import { initiateOwnerClaim } from '@/lib/actions/claim'

export function OwnerClaimBlock({ carwashId }: { carwashId: string }) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    if (!email) { setError('Введите email'); return }
    setLoading(true)
    setError('')
    const result = await initiateOwnerClaim(carwashId, email)
    setLoading(false)
    if (result.success) setSent(true)
    else setError(result.error ?? 'Ошибка. Попробуйте позже.')
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full text-sm text-gray-400 hover:text-[#e94560] transition-colors py-2 border border-dashed border-gray-200 rounded-xl hover:border-[#e94560]"
      >
        Владелец этой мойки? Подтвердите права →
      </button>
    )
  }

  if (sent) {
    return (
      <div className="bg-green-50 border border-green-100 rounded-2xl p-4 text-sm text-green-700">
        <p className="font-semibold mb-1">Письмо отправлено!</p>
        <p className="text-xs text-green-600">Проверьте почту — ссылка для подтверждения действительна 48 часов.</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
      <p className="text-sm font-semibold text-gray-900 mb-1">Вы владелец этой мойки?</p>
      <p className="text-xs text-gray-500 mb-3">Введите email — мы пришлём ссылку для подтверждения и обновления данных.</p>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#e94560]"
        />
        {error && <p className="text-red-500 text-xs">{error}</p>}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2 bg-[#e94560] text-white rounded-lg text-sm font-semibold hover:bg-[#c73652] transition-colors disabled:opacity-60"
          >
            {loading ? 'Отправляем...' : 'Отправить письмо'}
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="px-3 py-2 text-sm text-gray-400 hover:text-gray-600"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  )
}
