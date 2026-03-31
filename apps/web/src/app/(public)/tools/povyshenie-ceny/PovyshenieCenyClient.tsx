'use client'

import { useState, useMemo } from 'react'

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} млн ₽`
  if (n >= 1_000) return `${Math.round(n / 1_000)} тыс. ₽`
  return `${Math.round(n)} ₽`
}

function Row({ label, value, highlight, sub }: { label: string; value: string; highlight?: boolean; sub?: string }) {
  return (
    <div className={`flex justify-between items-center py-3 border-b border-gray-100 last:border-0 ${highlight ? 'font-semibold' : ''}`}>
      <div>
        <div className={highlight ? 'text-gray-900' : 'text-gray-600'}>{label}</div>
        {sub && <div className="text-xs text-gray-400">{sub}</div>}
      </div>
      <span className={highlight ? 'text-[#e94560] text-lg' : 'text-gray-900'}>{value}</span>
    </div>
  )
}

export function PovyshenieCenyClient() {
  const [currentPrice, setCurrentPrice] = useState(500)
  const [newPrice, setNewPrice] = useState(600)
  const [carsPerMonth, setCarsPerMonth] = useState(1500)
  const [fixedCosts, setFixedCosts] = useState(200_000)
  const [varCostPerCar, setVarCostPerCar] = useState(80)

  const r = useMemo(() => {
    const currentRevenue = currentPrice * carsPerMonth
    const currentVarCosts = varCostPerCar * carsPerMonth
    const currentProfit = currentRevenue - fixedCosts - currentVarCosts

    const newRevenue = newPrice * carsPerMonth
    const newVarCosts = varCostPerCar * carsPerMonth
    const newProfit = newRevenue - fixedCosts - newVarCosts

    // Сколько клиентов можно потерять и остаться при той же прибыли
    // newPrice * x - fixedCosts - varCostPerCar * x = currentProfit
    // x * (newPrice - varCostPerCar) = currentProfit + fixedCosts
    const marginPerCarNew = newPrice - varCostPerCar
    const breakEvenCarsNew = marginPerCarNew > 0
      ? Math.ceil((currentProfit + fixedCosts) / marginPerCarNew)
      : carsPerMonth

    const allowedAttrition = carsPerMonth - breakEvenCarsNew
    const allowedAttritionPct = carsPerMonth > 0 ? (allowedAttrition / carsPerMonth) * 100 : 0
    const priceIncreasePct = currentPrice > 0 ? ((newPrice - currentPrice) / currentPrice) * 100 : 0

    // При каком оттоке выгода сходит на нет
    const elasticityNote = allowedAttritionPct > 0 && priceIncreasePct > 0
      ? (allowedAttritionPct / priceIncreasePct).toFixed(1)
      : '—'

    return {
      currentProfit, newProfit, breakEvenCarsNew, allowedAttrition, allowedAttritionPct,
      priceIncreasePct, elasticityNote, currentRevenue, newRevenue,
    }
  }, [currentPrice, newPrice, carsPerMonth, fixedCosts, varCostPerCar])

  const isWorthIt = r.allowedAttritionPct > 5
  const priceDiff = newPrice - currentPrice

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5">
        <h2 className="text-lg font-semibold">Параметры</h2>
        {([
          { label: 'Текущая цена', value: currentPrice, set: setCurrentPrice, min: 100, max: 5000, step: 50, unit: '₽' },
          { label: 'Новая цена', value: newPrice, set: setNewPrice, min: 100, max: 8000, step: 50, unit: '₽' },
          { label: 'Машин в месяц', value: carsPerMonth, set: setCarsPerMonth, min: 100, max: 10000, step: 50, unit: 'авт.' },
          { label: 'Переменные расходы на авто', value: varCostPerCar, set: setVarCostPerCar, min: 10, max: 500, step: 10, unit: '₽' },
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
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Постоянные расходы в месяц</label>
            <span className="text-[#e94560] font-bold">{fmt(fixedCosts)}</span>
          </div>
          <input type="range" min={30_000} max={2_000_000} step={10_000} value={fixedCosts}
            onChange={e => setFixedCosts(Number(e.target.value))} className="w-full accent-[#e94560]" />
        </div>

        {priceDiff > 0 && (
          <div className="bg-blue-50 rounded-xl p-3 text-xs text-blue-700">
            Повышение цены на <b>+{Math.round(r.priceIncreasePct)}%</b> (+{priceDiff} ₽).
            Эластичность: при каждом проценте повышения цены вы можете потерять до <b>{r.elasticityNote}%</b> клиентов.
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className={`rounded-2xl p-6 text-white ${isWorthIt ? 'bg-green-700' : 'bg-[#1a1a2e]'}`}>
          <p className="text-white/70 text-sm mb-1">
            {isWorthIt ? '✅ Повышение выгодно' : '⚠️ Риск: мало запаса'}
          </p>
          <div className="text-3xl font-bold mb-1">
            Можно потерять {Math.max(0, Math.round(r.allowedAttritionPct))}% клиентов
          </div>
          <p className="text-white/70 text-sm">
            Это {Math.max(0, r.allowedAttrition)} авт/мес — и вы всё равно останетесь в той же прибыли
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Сравнение</h3>
          <Row label="Прибыль сейчас" value={fmt(r.currentProfit)} />
          <Row label="Прибыль при новой цене (без оттока)" value={fmt(r.newProfit)} highlight />
          <Row label="Прирост прибыли" value={`+${fmt(r.newProfit - r.currentProfit)}`} />
          <Row label="Минимальный поток для безубыточности" value={`${r.breakEvenCarsNew} авт/мес`} sub="при новой цене" />
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 text-sm text-gray-600 space-y-2">
          <p className="font-semibold text-gray-900 mb-2">💡 Совет</p>
          <p>По статистике рынка, повышение цены до 15% при хорошей локации и качестве приводит к оттоку клиентов не более 5–8%. Ниже порога в {Math.round(r.allowedAttritionPct)}% — повышение выгодно.</p>
        </div>
      </div>
    </div>
  )
}
