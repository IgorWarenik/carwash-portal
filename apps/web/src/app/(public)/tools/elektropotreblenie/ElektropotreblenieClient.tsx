'use client'

import { useState, useMemo } from 'react'

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} млн ₽`
  if (n >= 1_000) return `${Math.round(n / 1_000)} тыс. ₽`
  return `${Math.round(n)} ₽`
}

interface Device { name: string; powerKw: number; hoursPerDay: number }

const DEFAULT_DEVICES: Device[] = [
  { name: 'Насосы высокого давления', powerKw: 7.5, hoursPerDay: 14 },
  { name: 'Компрессор', powerKw: 2.2, hoursPerDay: 8 },
  { name: 'Пылесосы', powerKw: 1.5, hoursPerDay: 6 },
  { name: 'Освещение (LED)', powerKw: 2.0, hoursPerDay: 16 },
  { name: 'Обогрев / вентиляция', powerKw: 5.0, hoursPerDay: 10 },
  { name: 'Терминалы оплаты', powerKw: 0.1, hoursPerDay: 24 },
]

export function ElektropotreblenieClient() {
  const [devices, setDevices] = useState<Device[]>(DEFAULT_DEVICES)
  const [tariff, setTariff] = useState(5.5)
  const [workDays, setWorkDays] = useState(30)
  const [carsPerDay, setCarsPerDay] = useState(60)

  function update(i: number, field: keyof Device, raw: string) {
    const value = field === 'name' ? raw : Math.max(0, Number(raw) || 0)
    setDevices(prev => prev.map((d, idx) => idx === i ? { ...d, [field]: value } : d))
  }

  const r = useMemo(() => {
    const items = devices.map(d => {
      const kwhPerDay = d.powerKw * d.hoursPerDay
      const kwhPerMonth = kwhPerDay * workDays
      const costPerMonth = kwhPerMonth * tariff
      return { ...d, kwhPerDay, kwhPerMonth, costPerMonth }
    })
    const totalKwhMonth = items.reduce((s, d) => s + d.kwhPerMonth, 0)
    const totalCostMonth = items.reduce((s, d) => s + d.costPerMonth, 0)
    const carsPerMonth = carsPerDay * workDays
    const kwhPerCar = carsPerMonth > 0 ? totalKwhMonth / carsPerMonth : 0
    const costPerCar = carsPerMonth > 0 ? totalCostMonth / carsPerMonth : 0
    return { items, totalKwhMonth, totalCostMonth, kwhPerCar, costPerCar }
  }, [devices, tariff, workDays, carsPerDay])

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Тариф на электричество</label>
            <span className="text-[#e94560] font-bold">{tariff} ₽/кВт·ч</span>
          </div>
          <input type="range" min={3} max={12} step={0.1} value={tariff}
            onChange={e => setTariff(Number(e.target.value))} className="w-full accent-[#e94560]" />
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Рабочих дней в месяце</label>
            <span className="text-[#e94560] font-bold">{workDays} дн.</span>
          </div>
          <input type="range" min={20} max={31} step={1} value={workDays}
            onChange={e => setWorkDays(Number(e.target.value))} className="w-full accent-[#e94560]" />
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Машин в день</label>
            <span className="text-[#e94560] font-bold">{carsPerDay} авт.</span>
          </div>
          <input type="range" min={5} max={300} step={5} value={carsPerDay}
            onChange={e => setCarsPerDay(Number(e.target.value))} className="w-full accent-[#e94560]" />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 overflow-x-auto">
        <h2 className="text-lg font-semibold mb-4">Оборудование</h2>
        <table className="w-full text-sm min-w-[500px]">
          <thead>
            <tr className="text-left text-gray-400 text-xs uppercase border-b border-gray-100">
              <th className="pb-2 font-medium">Оборудование</th>
              <th className="pb-2 font-medium text-right">кВт</th>
              <th className="pb-2 font-medium text-right">Ч/день</th>
              <th className="pb-2 font-medium text-right">кВт·ч/мес</th>
              <th className="pb-2 font-medium text-right">Стоимость/мес</th>
            </tr>
          </thead>
          <tbody>
            {r.items.map((d, i) => (
              <tr key={i} className="border-b border-gray-50 last:border-0">
                <td className="py-2">
                  <input value={d.name} onChange={e => update(i, 'name', e.target.value)}
                    className="border-b border-dashed border-gray-200 focus:outline-none focus:border-[#e94560] w-full bg-transparent text-sm" />
                </td>
                {(['powerKw', 'hoursPerDay'] as const).map(f => (
                  <td key={f} className="py-2 text-right">
                    <input type="number" value={d[f]} onChange={e => update(i, f, e.target.value)} min={0} step={0.1}
                      className="w-14 text-right border-b border-dashed border-gray-200 focus:outline-none bg-transparent" />
                  </td>
                ))}
                <td className="py-2 text-right text-gray-700">{Math.round(d.kwhPerMonth)}</td>
                <td className="py-2 text-right font-semibold text-[#e94560]">{fmt(d.costPerMonth)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Электричество в месяц', value: fmt(r.totalCostMonth), sub: `${Math.round(r.totalKwhMonth).toLocaleString('ru')} кВт·ч` },
          { label: 'На одну машину', value: `${Math.round(r.costPerCar)} ₽`, sub: `${r.kwhPerCar.toFixed(1)} кВт·ч/авто` },
          { label: 'В год', value: fmt(r.totalCostMonth * 12), sub: 'прогноз' },
        ].map(({ label, value, sub }, i) => (
          <div key={label} className={`${i === 0 ? 'bg-[#1a1a2e] text-white' : 'bg-white border border-gray-200'} rounded-2xl p-5 text-center`}>
            <p className={`text-sm mb-1 ${i === 0 ? 'text-gray-400' : 'text-gray-500'}`}>{label}</p>
            <p className="text-2xl font-bold">{value}</p>
            <p className={`text-xs mt-1 ${i === 0 ? 'text-gray-400' : 'text-gray-400'}`}>{sub}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
