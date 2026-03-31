'use client'

import { useState, useMemo } from 'react'

function fmt(n: number) { return `${Math.round(n).toLocaleString('ru')} ₽` }

export function OptimalnyShtatClient() {
  const [carsPerDay, setCarsPerDay] = useState(80)
  const [washTimeMin, setWashTimeMin] = useState(20)
  const [shiftHours, setShiftHours] = useState(12)
  const [shiftsPerDay, setShiftsPerDay] = useState(2)
  const [salary, setSalary] = useState(55_000)
  const [posts, setPosts] = useState(4)

  const r = useMemo(() => {
    const washesPerWorkerPerShift = Math.floor((shiftHours * 60) / washTimeMin)
    const workersNeededPerShift = Math.ceil(carsPerDay / shiftsPerDay / washesPerWorkerPerShift)
    const totalWorkers = workersNeededPerShift * shiftsPerDay
    const totalWorkersWithReserve = Math.ceil(totalWorkers * 1.2) // 20% резерв на больничные

    const postUtilization = carsPerDay > 0 && posts > 0
      ? Math.min(100, Math.round(((carsPerDay * washTimeMin) / (posts * shiftHours * shiftsPerDay * 60)) * 100))
      : 0

    const fot = totalWorkersWithReserve * salary
    const fotWithTaxes = fot * 1.30 // страховые взносы

    return { washesPerWorkerPerShift, workersNeededPerShift, totalWorkers, totalWorkersWithReserve, postUtilization, fot, fotWithTaxes }
  }, [carsPerDay, washTimeMin, shiftHours, shiftsPerDay, salary, posts])

  const utilizationColor = r.postUtilization >= 85 ? 'text-red-600' : r.postUtilization >= 60 ? 'text-green-600' : 'text-yellow-600'

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5">
        <h2 className="text-lg font-semibold">Параметры работы</h2>

        {([
          { label: 'Машин в день', value: carsPerDay, set: setCarsPerDay, min: 10, max: 400, step: 5, unit: 'авт.' },
          { label: 'Время одной мойки', value: washTimeMin, set: setWashTimeMin, min: 5, max: 90, step: 5, unit: 'мин' },
          { label: 'Часов в смене', value: shiftHours, set: setShiftHours, min: 6, max: 24, step: 1, unit: 'ч' },
          { label: 'Смен в день', value: shiftsPerDay, set: setShiftsPerDay, min: 1, max: 3, step: 1, unit: '' },
          { label: 'Количество постов', value: posts, set: setPosts, min: 1, max: 20, step: 1, unit: '' },
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
            <label className="text-sm font-medium text-gray-700">Зарплата мойщика (на руки)</label>
            <span className="text-[#e94560] font-bold">{fmt(salary)}</span>
          </div>
          <input type="range" min={25_000} max={150_000} step={2_500} value={salary}
            onChange={e => setSalary(Number(e.target.value))} className="w-full accent-[#e94560]" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-[#1a1a2e] text-white rounded-2xl p-6">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <p className="text-gray-400 text-sm">Мойщиков на смену</p>
              <p className="text-4xl font-bold text-[#e94560]">{r.workersNeededPerShift}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Всего в штате (с резервом)</p>
              <p className="text-4xl font-bold">{r.totalWorkersWithReserve}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Загрузка и эффективность</h3>
          <div className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Загрузка постов</span>
              <span className={`font-bold ${utilizationColor}`}>{r.postUtilization}%</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all"
                style={{ width: `${r.postUtilization}%`, background: r.postUtilization >= 85 ? '#ef4444' : r.postUtilization >= 60 ? '#22c55e' : '#f59e0b' }} />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {r.postUtilization >= 85 ? 'Перегрузка — нужен дополнительный пост' : r.postUtilization >= 60 ? 'Оптимальная загрузка' : 'Недозагрузка — можно сократить посты'}
            </p>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600 text-sm">Мойок на мойщика за смену</span>
            <span className="font-semibold">{r.washesPerWorkerPerShift} авт.</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600 text-sm">Сотрудников всего (без резерва)</span>
            <span className="font-semibold">{r.totalWorkers} чел.</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Фонд оплаты труда</h3>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">ФОТ (зарплата на руки)</span>
            <span className="font-semibold">{fmt(r.fot)}/мес</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">ФОТ со страховыми взносами (+30%)</span>
            <span className="font-bold text-[#e94560] text-lg">{fmt(r.fotWithTaxes)}/мес</span>
          </div>
        </div>
      </div>
    </div>
  )
}
