'use client'

import { useState, useMemo } from 'react'

interface Service { name: string; price: number; timeMin: number; varCost: number }

const DEFAULT_SERVICES: Service[] = [
  { name: 'Экспресс-мойка', price: 350, timeMin: 15, varCost: 40 },
  { name: 'Стандарт', price: 600, timeMin: 25, varCost: 60 },
  { name: 'Комплексная', price: 900, timeMin: 40, varCost: 90 },
  { name: 'Химчистка салона', price: 3500, timeMin: 180, varCost: 400 },
  { name: 'Полировка', price: 5000, timeMin: 240, varCost: 600 },
]

function fmtRub(n: number) { return `${Math.round(n)} ₽` }
function fmtPct(n: number) { return `${Math.round(n)}%` }

export function RentabelnostUslugClient() {
  const [services, setServices] = useState<Service[]>(DEFAULT_SERVICES)
  const [fixedPerHour, setFixedPerHour] = useState(500)

  function update(i: number, field: keyof Service, raw: string) {
    const value = field === 'name' ? raw : Math.max(0, Number(raw) || 0)
    setServices(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s))
  }

  const results = useMemo(() => services.map(s => {
    const fixedAlloc = (s.timeMin / 60) * fixedPerHour
    const totalCost = s.varCost + fixedAlloc
    const margin = s.price - totalCost
    const marginPct = s.price > 0 ? (margin / s.price) * 100 : 0
    const revenuePerHour = (60 / s.timeMin) * s.price
    return { ...s, fixedAlloc, totalCost, margin, marginPct, revenuePerHour }
  }).sort((a, b) => b.marginPct - a.marginPct), [services, fixedPerHour])

  const best = results[0]
  const worst = results[results.length - 1]

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Постоянные расходы</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Постоянные расходы в час:</span>
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <input type="number" value={fixedPerHour} min={0} max={5000} step={50}
                onChange={e => setFixedPerHour(Number(e.target.value))}
                className="w-24 px-3 py-1.5 text-sm text-right focus:outline-none" />
              <span className="px-2 py-1.5 bg-gray-50 text-sm text-gray-500">₽/ч</span>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-400">Аренда + ФОТ + коммунальные, делённые на рабочие часы в месяц. Пример: 300 000 ₽/мес ÷ 600 ч = 500 ₽/ч</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 overflow-x-auto">
        <h2 className="text-lg font-semibold mb-4">Услуги</h2>
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="text-left text-gray-400 text-xs uppercase border-b border-gray-100">
              <th className="pb-2 font-medium">Услуга</th>
              <th className="pb-2 font-medium text-right">Цена, ₽</th>
              <th className="pb-2 font-medium text-right">Время, мин</th>
              <th className="pb-2 font-medium text-right">Перем. расходы, ₽</th>
              <th className="pb-2 font-medium text-right">Маржа</th>
              <th className="pb-2 font-medium text-right">%</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s, i) => {
              const res = results.find(r => r.name === s.name && r.price === s.price)
              const pct = res?.marginPct ?? 0
              return (
                <tr key={i} className="border-b border-gray-50 last:border-0">
                  <td className="py-2">
                    <input value={s.name} onChange={e => update(i, 'name', e.target.value)}
                      className="border-b border-dashed border-gray-200 focus:outline-none focus:border-[#e94560] w-full bg-transparent" />
                  </td>
                  {(['price', 'timeMin', 'varCost'] as const).map(f => (
                    <td key={f} className="py-2 text-right">
                      <input type="number" value={s[f]} onChange={e => update(i, f, e.target.value)} min={0}
                        className="w-20 text-right border-b border-dashed border-gray-200 focus:outline-none focus:border-[#e94560] bg-transparent" />
                    </td>
                  ))}
                  <td className="py-2 text-right font-medium">{fmtRub(res?.margin ?? 0)}</td>
                  <td className="py-2 text-right">
                    <span className={`font-bold ${pct >= 50 ? 'text-green-600' : pct >= 30 ? 'text-yellow-600' : 'text-red-500'}`}>
                      {fmtPct(pct)}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
          <p className="text-xs text-green-600 font-medium mb-1">🏆 Самая выгодная</p>
          <p className="font-bold text-lg">{best?.name}</p>
          <p className="text-green-700 font-semibold">{fmtPct(best?.marginPct ?? 0)} маржи · {fmtRub(best?.revenuePerHour ?? 0)}/ч</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
          <p className="text-xs text-red-500 font-medium mb-1">⚠️ Наименее выгодная</p>
          <p className="font-bold text-lg">{worst?.name}</p>
          <p className="text-red-600 font-semibold">{fmtPct(worst?.marginPct ?? 0)} маржи · {fmtRub(worst?.revenuePerHour ?? 0)}/ч</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Рейтинг по марже</h3>
        <div className="space-y-2">
          {results.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-gray-400 text-sm w-4">{i + 1}</span>
              <span className="text-sm flex-1">{s.name}</span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-[#e94560]"
                  style={{ width: `${Math.max(0, s.marginPct)}%`, opacity: 1 - i * 0.15 }} />
              </div>
              <span className={`text-sm font-bold w-12 text-right ${s.marginPct >= 50 ? 'text-green-600' : s.marginPct >= 30 ? 'text-yellow-600' : 'text-red-500'}`}>
                {fmtPct(s.marginPct)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
