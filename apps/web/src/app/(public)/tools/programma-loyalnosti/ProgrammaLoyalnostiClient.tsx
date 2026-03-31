'use client'

import { useState, useMemo } from 'react'

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} млн ₽`
  if (n >= 1_000) return `${Math.round(n / 1_000)} тыс. ₽`
  return `${Math.round(n)} ₽`
}

export function ProgrammaLoyalnostiClient() {
  const [regularPrice, setRegularPrice] = useState(600)
  const [abonWashes, setAbonWashes] = useState(10)
  const [abonPrice, setAbonPrice] = useState(4500)
  const [discountPct, setDiscountPct] = useState(10)
  const [clientsPerMonth, setClientsPerMonth] = useState(200)
  const [abonSharePct, setAbonSharePct] = useState(30)
  const [visitsPerMonth, setVisitsPerMonth] = useState(2)

  const r = useMemo(() => {
    const abonClients = Math.round(clientsPerMonth * abonSharePct / 100)
    const regularClients = clientsPerMonth - abonClients

    // Доход от обычных клиентов
    const regularRevenue = regularClients * visitsPerMonth * regularPrice

    // Доход от клиентов с абонементом
    // Абонемент даёт N моек за фиксированную цену
    // Клиент использует abonWashes моек, платит abonPrice
    const abonRevenuePerClient = abonPrice // фиксированная сумма
    const abonTotalRevenue = abonClients * abonRevenuePerClient
    // Но без абонемента они бы заплатили:
    const abonWithoutLoyalty = abonClients * abonWashes * regularPrice
    const abonLoss = abonWithoutLoyalty - abonTotalRevenue

    // Скидочная карта
    const discountedPrice = regularPrice * (1 - discountPct / 100)
    const discountRevenue = clientsPerMonth * visitsPerMonth * discountedPrice
    const noLoyaltyRevenue = clientsPerMonth * visitsPerMonth * regularPrice
    const discountLoss = noLoyaltyRevenue - discountRevenue

    // Итог абонемент
    const totalAbonRevenue = regularRevenue + abonTotalRevenue
    // Итог скидка
    const totalDiscountRevenue = discountRevenue

    const pricePerWashAbon = abonWashes > 0 ? abonPrice / abonWashes : 0
    const discountPerClient = (regularPrice - discountedPrice) * visitsPerMonth

    return {
      regularRevenue, abonTotalRevenue, totalAbonRevenue,
      totalDiscountRevenue, abonLoss, discountLoss,
      pricePerWashAbon, discountedPrice, discountPerClient,
      noLoyaltyRevenue, abonClients, regularClients,
    }
  }, [regularPrice, abonWashes, abonPrice, discountPct, clientsPerMonth, abonSharePct, visitsPerMonth])

  const best = r.totalAbonRevenue >= r.totalDiscountRevenue && r.totalAbonRevenue >= r.noLoyaltyRevenue
    ? 'Абонемент'
    : r.noLoyaltyRevenue >= r.totalDiscountRevenue
    ? 'Без программы'
    : 'Скидочная карта'

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5">
        <h2 className="text-lg font-semibold">Параметры</h2>
        {([
          { label: 'Обычная цена мойки', value: regularPrice, set: setRegularPrice, min: 100, max: 3000, step: 50, unit: '₽' },
          { label: 'Клиентов в месяц', value: clientsPerMonth, set: setClientsPerMonth, min: 20, max: 1000, step: 10, unit: 'чел.' },
          { label: 'Визитов в месяц (1 клиент)', value: visitsPerMonth, set: setVisitsPerMonth, min: 1, max: 8, step: 0.5, unit: 'раз' },
        ] as const).map(({ label, value, set, min, max, step, unit }) => (
          <div key={label}>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">{label}</label>
              <span className="text-[#e94560] font-bold">{value} {unit}</span>
            </div>
            <input type="range" min={min} max={max} step={step} value={value}
              onChange={e => (set as (v: number) => void)(Number(e.target.value))} className="w-full accent-[#e94560]" />
          </div>
        ))}

        <div className="border-t border-gray-100 pt-3 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">Абонемент</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Моек в абонементе</label>
              <input type="number" value={abonWashes} onChange={e => setAbonWashes(Number(e.target.value))} min={1}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#e94560]" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Цена абонемента, ₽</label>
              <input type="number" value={abonPrice} onChange={e => setAbonPrice(Number(e.target.value))} min={0}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#e94560]" />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm text-gray-600">% клиентов на абонементе</label>
              <span className="text-[#e94560] font-bold">{abonSharePct}%</span>
            </div>
            <input type="range" min={0} max={100} step={5} value={abonSharePct}
              onChange={e => setAbonSharePct(Number(e.target.value))} className="w-full accent-[#e94560]" />
          </div>
        </div>

        <div className="border-t border-gray-100 pt-3">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Скидочная карта</h3>
          <div className="flex justify-between mb-2">
            <label className="text-sm text-gray-600">Скидка для всех клиентов</label>
            <span className="text-[#e94560] font-bold">{discountPct}%</span>
          </div>
          <input type="range" min={5} max={40} step={5} value={discountPct}
            onChange={e => setDiscountPct(Number(e.target.value))} className="w-full accent-[#e94560]" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-[#1a1a2e] text-white rounded-2xl p-6 text-center">
          <p className="text-gray-400 text-sm mb-1">Выгоднее всего</p>
          <div className="text-3xl font-bold text-[#e94560] mb-3">{best}</div>
          <div className="grid grid-cols-3 gap-3 text-sm">
            {[
              { label: 'Без программы', value: r.noLoyaltyRevenue },
              { label: 'Абонемент', value: r.totalAbonRevenue },
              { label: 'Скидка', value: r.totalDiscountRevenue },
            ].map(({ label, value }) => (
              <div key={label} className={`rounded-xl p-3 ${best === label ? 'bg-[#e94560]' : 'bg-white/10'}`}>
                <div className="text-white/70 text-xs mb-0.5">{label}</div>
                <div className="font-bold">{fmt(value)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Абонемент</h3>
          <div className="flex justify-between py-2 border-b border-gray-100 text-sm">
            <span className="text-gray-600">Цена одной мойки по абонементу</span>
            <span className="font-semibold">{Math.round(r.pricePerWashAbon)} ₽</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100 text-sm">
            <span className="text-gray-600">Клиентов на абонементе</span>
            <span className="font-semibold">{r.abonClients} чел.</span>
          </div>
          <div className="flex justify-between py-2 text-sm">
            <span className="text-gray-600">Недополученная выручка vs без скидок</span>
            <span className="font-semibold text-red-500">−{fmt(r.abonLoss)}</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Скидочная карта {discountPct}%</h3>
          <div className="flex justify-between py-2 border-b border-gray-100 text-sm">
            <span className="text-gray-600">Цена со скидкой</span>
            <span className="font-semibold">{Math.round(r.discountedPrice)} ₽</span>
          </div>
          <div className="flex justify-between py-2 text-sm">
            <span className="text-gray-600">Потери выручки в месяц</span>
            <span className="font-semibold text-red-500">−{fmt(r.discountLoss)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
