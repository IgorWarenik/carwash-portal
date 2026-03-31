'use client'

import { useState, useMemo } from 'react'

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} млн ₽`
  if (n >= 1_000) return `${Math.round(n / 1_000)} тыс. ₽`
  return `${Math.round(n)} ₽`
}

interface Chemical { name: string; normMl: number; pricePerL: number }

const DEFAULT_CHEMICALS: Chemical[] = [
  { name: 'Активная пена', normMl: 30, pricePerL: 180 },
  { name: 'Шампунь', normMl: 20, pricePerL: 150 },
  { name: 'Воск / защитное покрытие', normMl: 10, pricePerL: 600 },
  { name: 'Чернитель резины', normMl: 8, pricePerL: 400 },
  { name: 'Стеклоочиститель', normMl: 15, pricePerL: 120 },
]

export function RaskhodKhimiiClient() {
  const [carsPerDay, setCarsPerDay] = useState(60)
  const [workDaysPerMonth, setWorkDaysPerMonth] = useState(28)
  const [chemicals, setChemicals] = useState<Chemical[]>(DEFAULT_CHEMICALS)
  const [safetyStock, setSafetyStock] = useState(1.2) // запас 20%

  function updateChem(i: number, field: keyof Chemical, raw: string) {
    const value = field === 'name' ? raw : Math.max(0, Number(raw) || 0)
    setChemicals(prev => prev.map((c, idx) => idx === i ? { ...c, [field]: value } : c))
  }

  const r = useMemo(() => {
    const carsPerMonth = carsPerDay * workDaysPerMonth
    return chemicals.map(c => {
      const mlPerMonth = c.normMl * carsPerMonth
      const litersPerMonth = mlPerMonth / 1000
      const cost = litersPerMonth * c.pricePerL
      const litersWithStock = litersPerMonth * safetyStock
      return { ...c, mlPerMonth, litersPerMonth, cost, litersWithStock }
    })
  }, [carsPerDay, workDaysPerMonth, chemicals, safetyStock])

  const totalCost = r.reduce((s, c) => s + c.cost, 0)
  const totalLiters = r.reduce((s, c) => s + c.litersPerMonth, 0)
  const costPerCar = carsPerDay * workDaysPerMonth > 0 ? totalCost / (carsPerDay * workDaysPerMonth) : 0

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Машин в день</label>
            <span className="text-[#e94560] font-bold">{carsPerDay}</span>
          </div>
          <input type="range" min={5} max={300} step={5} value={carsPerDay}
            onChange={e => setCarsPerDay(Number(e.target.value))} className="w-full accent-[#e94560]" />
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Рабочих дней в месяце</label>
            <span className="text-[#e94560] font-bold">{workDaysPerMonth}</span>
          </div>
          <input type="range" min={20} max={31} step={1} value={workDaysPerMonth}
            onChange={e => setWorkDaysPerMonth(Number(e.target.value))} className="w-full accent-[#e94560]" />
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Страховой запас</label>
            <span className="text-[#e94560] font-bold">+{Math.round((safetyStock - 1) * 100)}%</span>
          </div>
          <input type="range" min={1.0} max={2.0} step={0.1} value={safetyStock}
            onChange={e => setSafetyStock(Number(e.target.value))} className="w-full accent-[#e94560]" />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 overflow-x-auto">
        <h2 className="text-lg font-semibold mb-4">Химикаты</h2>
        <table className="w-full text-sm min-w-[500px]">
          <thead>
            <tr className="text-left text-gray-400 text-xs uppercase border-b border-gray-100">
              <th className="pb-2 font-medium">Название</th>
              <th className="pb-2 font-medium text-right">Норма, мл/авто</th>
              <th className="pb-2 font-medium text-right">Цена, ₽/л</th>
              <th className="pb-2 font-medium text-right">Расход/мес, л</th>
              <th className="pb-2 font-medium text-right">Закупить с запасом</th>
              <th className="pb-2 font-medium text-right">Стоимость</th>
            </tr>
          </thead>
          <tbody>
            {r.map((c, i) => (
              <tr key={i} className="border-b border-gray-50 last:border-0">
                <td className="py-2">
                  <input value={c.name} onChange={e => updateChem(i, 'name', e.target.value)}
                    className="border-b border-dashed border-gray-200 focus:outline-none focus:border-[#e94560] w-full bg-transparent text-sm" />
                </td>
                <td className="py-2 text-right">
                  <input type="number" value={c.normMl} onChange={e => updateChem(i, 'normMl', e.target.value)} min={0}
                    className="w-16 text-right border-b border-dashed border-gray-200 focus:outline-none bg-transparent" />
                </td>
                <td className="py-2 text-right">
                  <input type="number" value={c.pricePerL} onChange={e => updateChem(i, 'pricePerL', e.target.value)} min={0}
                    className="w-16 text-right border-b border-dashed border-gray-200 focus:outline-none bg-transparent" />
                </td>
                <td className="py-2 text-right text-gray-700">{c.litersPerMonth.toFixed(1)} л</td>
                <td className="py-2 text-right font-medium">{c.litersWithStock.toFixed(1)} л</td>
                <td className="py-2 text-right font-semibold text-[#e94560]">{fmt(c.cost)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Бюджет на химию в месяц', value: fmt(totalCost), color: 'bg-[#1a1a2e] text-white' },
          { label: 'Химия на одну машину', value: `${Math.round(costPerCar)} ₽`, color: 'bg-white border border-gray-200' },
          { label: 'Всего жидкостей в месяц', value: `${totalLiters.toFixed(0)} л`, color: 'bg-white border border-gray-200' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`${color} rounded-2xl p-5 text-center`}>
            <p className="text-sm opacity-60 mb-1">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
