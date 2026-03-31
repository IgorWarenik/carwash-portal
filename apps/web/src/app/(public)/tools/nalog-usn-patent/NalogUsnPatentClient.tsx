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

// Средняя стоимость патента по РФ для автомойки
const PATENT_BASE = 36_000 // руб/год (примерное базовое значение)

export function NalogUsnPatentClient() {
  const [revenue, setRevenue] = useState(3_000_000)
  const [expenses, setExpenses] = useState(1_800_000)
  const [employees, setEmployees] = useState(3)
  const [patentCost, setPatentCost] = useState(PATENT_BASE)

  const r = useMemo(() => {
    const profit = Math.max(0, revenue - expenses)

    // УСН 6%
    const usn6base = revenue * 0.06
    // Страховые взносы за сотрудников (~30% от среднего оклада 40 000)
    const svEmployees = employees * 40_000 * 12 * 0.30
    // Взносы ИП за себя (фиксированная часть 2024)
    const svSelf = 49_500
    const totalSv = svSelf + svEmployees
    // УСН 6% уменьшается на взносы, но не более чем на 50%
    const usn6reduction = Math.min(usn6base * 0.5, totalSv)
    const usn6 = Math.max(0, usn6base - usn6reduction)

    // УСН 15%
    const usn15base = profit * 0.15
    // Минимальный налог 1% от выручки
    const usn15min = revenue * 0.01
    const usn15 = Math.max(usn15base, usn15min)

    // Патент
    const patentSvReduction = Math.min(patentCost * 0.5, totalSv)
    const patent = Math.max(0, patentCost - patentSvReduction)

    const best = Math.min(usn6, usn15, patent)
    let recommendation = ''
    if (best === usn6) recommendation = 'УСН 6%'
    else if (best === usn15) recommendation = 'УСН 15%'
    else recommendation = 'Патент'

    return { usn6, usn15, patent, best, recommendation, totalSv, profit }
  }, [revenue, expenses, employees, patentCost])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
        <h2 className="text-lg font-semibold">Параметры бизнеса</h2>

        {[
          { label: 'Годовая выручка', value: revenue, set: setRevenue, min: 300_000, max: 30_000_000, step: 100_000 },
          { label: 'Годовые расходы', value: expenses, set: setExpenses, min: 100_000, max: 25_000_000, step: 100_000 },
          { label: 'Стоимость патента в год', value: patentCost, set: setPatentCost, min: 10_000, max: 300_000, step: 1_000 },
        ].map(({ label, value, set, min, max, step }) => (
          <div key={label}>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">{label}</label>
              <span className="text-[#e94560] font-bold">{fmt(value)}</span>
            </div>
            <input type="range" min={min} max={max} step={step} value={value}
              onChange={e => set(Number(e.target.value))} className="w-full accent-[#e94560]" />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{fmt(min)}</span><span>{fmt(max)}</span>
            </div>
          </div>
        ))}

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Наёмных сотрудников</label>
            <span className="text-[#e94560] font-bold">{employees} чел.</span>
          </div>
          <input type="range" min={0} max={20} step={1} value={employees}
            onChange={e => setEmployees(Number(e.target.value))} className="w-full accent-[#e94560]" />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0</span><span>20</span>
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-3 text-xs text-blue-700">
          <b>Стоимость патента</b> зависит от региона и вида деятельности. Уточните в налоговой или на сайте ФНС. Среднее по РФ для автомойки — 30 000–90 000 ₽/год.
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-[#1a1a2e] text-white rounded-2xl p-6 text-center">
          <p className="text-gray-400 text-sm mb-1">Выгоднее всего</p>
          <div className="text-4xl font-bold text-[#e94560] mb-1">{r.recommendation}</div>
          <p className="text-gray-400 text-sm">Налог: <span className="text-white font-semibold">{fmt(r.best)}/год</span></p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Сравнение режимов</h3>
          <Row label="УСН 6% (от выручки)" value={fmt(r.usn6)} highlight={r.recommendation === 'УСН 6%'} sub="с учётом вычета страховых взносов" />
          <Row label="УСН 15% (от прибыли)" value={fmt(r.usn15)} highlight={r.recommendation === 'УСН 15%'} sub={r.profit <= 0 ? 'мин. налог 1% от выручки' : ''} />
          <Row label="Патент" value={fmt(r.patent)} highlight={r.recommendation === 'Патент'} sub="с учётом вычета страховых взносов" />
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Справочно</h3>
          <Row label="Прибыль в год" value={fmt(r.profit)} />
          <Row label="Страховые взносы (все)" value={fmt(r.totalSv)} sub="ИП за себя + 30% на сотрудников" />
          <Row label="Экономия на лучшем режиме" value={fmt(Math.max(r.usn6, r.usn15, r.patent) - r.best)} highlight />
        </div>
      </div>
    </div>
  )
}
