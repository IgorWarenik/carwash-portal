'use client'

import { useState } from 'react'
import { submitReview } from '@/lib/actions/review'

interface ReviewFormProps {
  carwashId: string
  carwashSlug: string
  citySlug: string
}

export function ReviewForm({ carwashId, carwashSlug, citySlug }: ReviewFormProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    if (!name.trim() || rating === 0) {
      setError('Укажите имя и поставьте оценку')
      return
    }
    setLoading(true)
    setError('')
    const result = await submitReview({ carwashId, carwashSlug, citySlug, authorName: name, rating, text: text || undefined })
    setLoading(false)
    if (result.success) setDone(true)
    else setError(result.error ?? 'Ошибка')
  }

  if (done) {
    return (
      <div className="bg-green-50 border border-green-100 rounded-2xl p-5 text-center">
        <div className="text-2xl mb-1">✅</div>
        <p className="font-semibold text-green-800">Спасибо за отзыв!</p>
        <p className="text-sm text-green-600 mt-1">Он появится на странице после проверки.</p>
      </div>
    )
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-sm text-gray-500 hover:border-[#e94560] hover:text-[#e94560] transition-colors font-medium"
      >
        + Оставить отзыв
      </button>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5">
      <h3 className="font-semibold text-gray-900 mb-4">Ваш отзыв</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1.5">Ваше имя</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Александр"
            maxLength={80}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#e94560] transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">Оценка</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(i => (
              <button
                key={i}
                type="button"
                onClick={() => setRating(i)}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(0)}
                className="text-3xl leading-none transition-transform hover:scale-110"
              >
                <span className={(hovered || rating) >= i ? 'text-yellow-400' : 'text-gray-200'}>★</span>
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 text-sm text-gray-500 self-center">
                {['', 'Ужасно', 'Плохо', 'Нормально', 'Хорошо', 'Отлично'][rating]}
              </span>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1.5">Комментарий <span className="text-gray-400">(необязательно)</span></label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            rows={3}
            maxLength={1000}
            placeholder="Что понравилось или не понравилось?"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#e94560] transition-colors resize-none"
          />
          <div className="text-right text-xs text-gray-400 mt-1">{text.length}/1000</div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2.5 bg-[#e94560] text-white rounded-xl text-sm font-semibold hover:bg-[#c73652] transition-colors disabled:opacity-60"
          >
            {loading ? 'Отправляем...' : 'Отправить отзыв'}
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="px-4 py-2.5 text-sm text-gray-400 hover:text-gray-600 border border-gray-200 rounded-xl"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  )
}
