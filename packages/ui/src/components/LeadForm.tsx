'use client'

import * as React from 'react'
import { Button } from './Button'
import { cn } from '../lib/cn'

type LeadType = 'BUY' | 'SELL' | 'OPEN' | 'SUPPLIER' | 'FRANCHISE' | 'GENERAL'

interface LeadFormProps {
  type: LeadType
  title?: string
  subtitle?: string
  className?: string
  onSubmit?: (data: { name: string; phone: string; email?: string }) => Promise<void>
}

const DEFAULT_TITLES: Record<LeadType, string> = {
  BUY: 'Хочу купить автомойку',
  SELL: 'Хочу продать автомойку',
  OPEN: 'Хочу открыть автомойку',
  SUPPLIER: 'Хочу получить КП от поставщика',
  FRANCHISE: 'Хочу купить франшизу',
  GENERAL: 'Получить консультацию',
}

export function LeadForm({ type, title, subtitle, className, onSubmit }: LeadFormProps) {
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [name, setName] = React.useState('')
  const [phone, setPhone] = React.useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !phone) return
    setStatus('loading')
    try {
      await onSubmit?.({ name, phone })
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className={cn('rounded-xl bg-green-50 p-6 text-center', className)}>
        <p className="text-lg font-semibold text-green-800">Заявка отправлена!</p>
        <p className="mt-1 text-green-700">Мы свяжемся с вами в течение 30 минут.</p>
      </div>
    )
  }

  return (
    <div className={cn('rounded-xl border border-gray-200 bg-white p-6', className)}>
      <h3 className="text-lg font-semibold">{title ?? DEFAULT_TITLES[type]}</h3>
      {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <input
          type="text"
          placeholder="Ваше имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e94560]"
        />
        <input
          type="tel"
          placeholder="+7 (___) ___-__-__"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e94560]"
        />
        {status === 'error' && (
          <p className="text-sm text-red-600">Ошибка отправки. Попробуйте ещё раз.</p>
        )}
        <Button type="submit" isLoading={status === 'loading'} className="w-full" size="lg">
          Отправить заявку
        </Button>
        <p className="text-center text-xs text-gray-400">
          Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
        </p>
      </form>
    </div>
  )
}
