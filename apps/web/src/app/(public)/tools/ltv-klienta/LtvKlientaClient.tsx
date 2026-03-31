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

export function LtvKlientaClient() {
  const [avgCheck, setAvgCheck] = useState(600)
  const [visitsPerMonth, setVisitsPerMonth] = useState(2)
  const [retentionMonths, setRetentionMonths] = useState(18)
  const [marginPct, setMarginPct] = useState(40)
  const [cac, setCac] = useState(500)

  const r = useMemo(() => {
    const revenuePerMonth = avgCheck * visitsPerMonth
    const ltv = revenuePerMonth * retentionMonths
    const ltvMargin = ltv * (marginPct / 100)
    const maxCac = ltvMargin / 3 // правило 1:3 LTV/CAC
    const cacRoi = cac > 0 ? ((ltvMargin - cac) / cac) * 100 : 0
    const paybackMonths = revenuePerMonth > 0 ? Math.ceil(cac / (revenuePerMonth * (marginPct / 100))) : 0
    const retainVsAcquire = cac / 5 // удержать в 5 раз дешевле

    return { revenuePerMonth, ltv, ltvMargin, maxCac, cacRoi, paybackMonths, retainVsAcquire }
  }, [avgCheck, visitsPerMonth, retentionMonths, marginPct, cac])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5">
        <h2 className="text-lg font-semibold">Параметры клиента</h2>
        {([
          { label: 'Средний чек', value: avgCheck, set: setAvgCheck, min: 100, max: 5000, step: 50, unit: '₽' },
          { label: 'Визитов в месяц', value: visitsPerMonth, set: setVisitsPerMonth, min: 0.5, max: 8, step: 0.5, unit: 'раз' },
          { label: 'Срок удержания клиента', value: retentionMonths, set: setRetentionMonths, min: 1, max: 60, step: 1, unit: 'мес.' },
          { label: 'Маржинальность', value: marginPct, set: setMarginPct, min: 10, max: 80, step: 5, unit: '%' },
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

        <div className="border-t border-gray-100 pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Стоимость привлечения (CAC)</h3>
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
            <input type="number" value={cac} onChange={e => setCac(Number(e.target.value))} min={0}
              className="flex-1 px-4 py-3 focus:outline-none text-right" />
            <span className="px-3 py-3 bg-gray-50 text-gray-500 text-sm">₽</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Затраты на рекламу ÷ количество новых клиентов</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-[#1a1a2e] text-white rounded-2xl p-6">
          <p className="text-gray-400 text-sm mb-1">LTV клиента</p>
          <div className="text-4xl font-bold text-[#e94560] mb-1">{fmt(r.ltv)}</div>
          <p className="text-gray-400 text-sm">Прибыль с клиента: <span className="text-white font-semibold">{fmt(r.ltvMargin)}</span></p>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-400">Выручка/мес от клиента</div>
              <div className="font-semibold">{fmt(r.revenuePerMonth)}</div>
            </div>
            <div>
              <div className="text-gray-400">Окупаемость привлечения</div>
              <div className="font-semibold">{r.paybackMonths} мес.</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Анализ CAC</h3>
          <Row label="Текущий CAC" value={fmt(cac)} />
          <Row label="Максимально допустимый CAC" value={fmt(r.maxCac)} sub="правило LTV/CAC ≥ 3" highlight />
          <Row label="ROI на привлечение" value={`${Math.round(r.cacRoi)}%`} />
          <Row label="Удержать vs привлечь" value={fmt(r.retainVsAcquire)} sub="удержание в ~5 раз дешевле" />
        </div>

        <div className={`border rounded-2xl p-5 ${cac <= r.maxCac ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          {cac <= r.maxCac ? (
            <>
              <p className="font-bold text-green-700 mb-1">✅ CAC в норме</p>
              <p className="text-sm text-green-600">Можно увеличить рекламный бюджет до <b>{fmt(r.maxCac)}</b> на клиента и оставаться прибыльным.</p>
            </>
          ) : (
            <>
              <p className="font-bold text-red-700 mb-1">⚠️ CAC слишком высокий</p>
              <p className="text-sm text-red-600">При текущем CAC привлечение убыточно. Снизьте стоимость рекламы или увеличьте средний чек/частоту визитов.</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
