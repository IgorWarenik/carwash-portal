'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

type WashType = 'self_service' | 'manual' | 'automatic' | 'detailing'

const TYPE_LABELS: Record<WashType, string> = {
  self_service: 'Самообслуживание',
  manual: 'Ручная мойка',
  automatic: 'Автоматическая',
  detailing: 'Детейлинг',
}

// Base equipment value per post (ликвидационная стоимость)
const EQUIP_VALUE_PER_POST: Record<WashType, number> = {
  self_service: 300_000,
  manual: 200_000,
  automatic: 1_500_000,
  detailing: 400_000,
}

function formatRub(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} млн ₽`
  if (n >= 1_000) return `${Math.round(n / 1_000)} тыс. ₽`
  return `${Math.round(n)} ₽`
}

function ResultRow({ label, value, sub, highlight }: { label: string; value: string; sub?: string; highlight?: boolean }) {
  return (
    <div className={`flex justify-between items-center py-3 border-b border-gray-100 last:border-0 ${highlight ? 'font-semibold' : ''}`}>
      <div>
        <span className={highlight ? 'text-gray-900' : 'text-gray-600'}>{label}</span>
        {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
      </div>
      <span className={highlight ? 'text-[#e94560] text-lg' : 'text-gray-900'}>{value}</span>
    </div>
  )
}

function SliderInput({ label, value, min, max, step, unit, onChange, hint }: {
  label: string; value: number; min: number; max: number; step: number
  unit: string; onChange: (v: number) => void; hint?: string
}) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-[#e94560] font-bold">{formatRub(value)}{unit !== '₽' ? '' : ''}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#e94560]"
      />
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{formatRub(min)}</span>
        <span>{formatRub(max)}</span>
      </div>
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  )
}

export function OcenkaBiznesaClient() {
  const [washType, setWashType] = useState<WashType>('self_service')
  const [posts, setPosts] = useState(4)
  const [monthlyRevenue, setMonthlyRevenue] = useState(400_000)
  const [monthlyExpenses, setMonthlyExpenses] = useState(160_000)
  const [yearsRunning, setYearsRunning] = useState(3)
  const [ownBuilding, setOwnBuilding] = useState(false)
  const [goodLocation, setGoodLocation] = useState(true)

  const result = useMemo(() => {
    const monthlyProfit = monthlyRevenue - monthlyExpenses
    const annualEbitda = monthlyProfit * 12

    // Мультипликатор зависит от срока работы и качества локации
    let multMin = 2.0
    let multMax = 3.0
    if (yearsRunning >= 2 && yearsRunning < 5) { multMin = 2.5; multMax = 4.0 }
    if (yearsRunning >= 5) { multMin = 3.5; multMax = 5.0 }
    if (goodLocation) { multMin += 0.25; multMax += 0.25 }

    const valuationMin = annualEbitda * multMin
    const valuationMax = annualEbitda * multMax
    const equipValue = EQUIP_VALUE_PER_POST[washType] * posts
    const buildingValue = ownBuilding ? 3_000_000 : 0

    const totalMin = valuationMin + buildingValue
    const totalMax = valuationMax + buildingValue

    const recommendedPrice = (totalMin + totalMax) / 2

    const marginPct = monthlyRevenue > 0 ? Math.round((monthlyProfit / monthlyRevenue) * 100) : 0
    const paybackForBuyer = recommendedPrice > 0 && monthlyProfit > 0
      ? Math.round(recommendedPrice / monthlyProfit)
      : 0

    return {
      monthlyProfit,
      annualEbitda,
      multMin,
      multMax,
      valuationMin: Math.max(0, totalMin),
      valuationMax: Math.max(0, totalMax),
      recommendedPrice: Math.max(0, recommendedPrice),
      equipValue,
      marginPct,
      paybackForBuyer,
    }
  }, [washType, posts, monthlyRevenue, monthlyExpenses, yearsRunning, ownBuilding, goodLocation])

  const isNegative = result.monthlyProfit <= 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Inputs */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
        <h2 className="text-lg font-semibold">Данные вашего бизнеса</h2>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Тип мойки</label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(TYPE_LABELS) as WashType[]).map((t) => (
              <button
                key={t}
                onClick={() => setWashType(t)}
                className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-colors text-left ${
                  washType === t ? 'bg-[#e94560] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {TYPE_LABELS[t]}
              </button>
            ))}
          </div>
        </div>

        {/* Posts */}
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <label className="text-sm font-medium text-gray-700">Количество постов</label>
            <span className="text-[#e94560] font-bold">{posts} постов</span>
          </div>
          <input
            type="range" min={1} max={20} step={1} value={posts}
            onChange={(e) => setPosts(Number(e.target.value))}
            className="w-full accent-[#e94560]"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1</span><span>20</span>
          </div>
        </div>

        {/* Revenue */}
        <SliderInput
          label="Выручка в месяц"
          value={monthlyRevenue} min={50_000} max={3_000_000} step={10_000} unit="₽"
          onChange={setMonthlyRevenue}
          hint="Среднее за последние 6–12 месяцев"
        />

        {/* Expenses */}
        <SliderInput
          label="Расходы в месяц"
          value={monthlyExpenses} min={20_000} max={2_000_000} step={10_000} unit="₽"
          onChange={setMonthlyExpenses}
          hint="Аренда, зарплаты, химия, коммуналка, обслуживание"
        />

        {/* Years */}
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <label className="text-sm font-medium text-gray-700">Лет на рынке</label>
            <span className="text-[#e94560] font-bold">{yearsRunning} {yearsRunning === 1 ? 'год' : yearsRunning < 5 ? 'года' : 'лет'}</span>
          </div>
          <input
            type="range" min={1} max={15} step={1} value={yearsRunning}
            onChange={(e) => setYearsRunning(Number(e.target.value))}
            className="w-full accent-[#e94560]"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1 год</span><span>15 лет</span>
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-3 pt-1">
          {([
            { label: 'Здание / помещение в собственности', value: ownBuilding, set: setOwnBuilding },
            { label: 'Хорошая локация (высокий трафик)', value: goodLocation, set: setGoodLocation },
          ] as const).map((item) => (
            <label key={item.label} className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-gray-700">{item.label}</span>
              <button
                onClick={() => item.set(!item.value)}
                className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${item.value ? 'bg-[#e94560]' : 'bg-gray-300'}`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${item.value ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </label>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {isNegative ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-3">⚠️</div>
            <h3 className="font-bold text-red-700 mb-2">Бизнес убыточен</h3>
            <p className="text-sm text-red-600">
              При расходах выше выручки оценить стоимость по доходному подходу невозможно.
              Скорректируйте показатели или рассмотрите ликвидационную стоимость оборудования: {formatRub(result.equipValue)}.
            </p>
          </div>
        ) : (
          <div className="bg-[#1a1a2e] text-white rounded-2xl p-6">
            <h2 className="text-sm font-medium text-gray-400 mb-1">Рыночная стоимость</h2>
            <div className="text-3xl font-bold text-[#e94560] mb-1">
              {formatRub(result.valuationMin)} — {formatRub(result.valuationMax)}
            </div>
            <p className="text-sm text-gray-400 mb-5">Рекомендуемая цена листинга: <span className="text-white font-semibold">{formatRub(result.recommendedPrice)}</span></p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-400">Мультипликатор</div>
                <div className="font-semibold text-lg">{result.multMin.toFixed(1)}x — {result.multMax.toFixed(1)}x EBITDA</div>
              </div>
              <div>
                <div className="text-gray-400">Окупаемость для покупателя</div>
                <div className="font-semibold text-lg">{result.paybackForBuyer} мес.</div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Расчёт EBITDA</h3>
          <ResultRow label="Выручка в месяц" value={formatRub(monthlyRevenue)} />
          <ResultRow label="Расходы в месяц" value={`−${formatRub(monthlyExpenses)}`} />
          <ResultRow label="Прибыль в месяц" value={formatRub(result.monthlyProfit)} highlight />
          <ResultRow label="EBITDA в год" value={formatRub(result.annualEbitda)} sub="основа для оценки" />
          <ResultRow label="Рентабельность" value={`${result.marginPct}%`} />
          <ResultRow label="Стоимость оборудования" value={formatRub(result.equipValue)} sub="ликвидационная оценка" />
          {ownBuilding && <ResultRow label="Здание / помещение" value="+3 млн ₽" sub="добавлено к стоимости" />}
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 text-sm">
          <p className="font-semibold text-gray-900 mb-2">💡 Как получить больше</p>
          <ul className="space-y-1.5 text-gray-600">
            <li>• Долгосрочный договор аренды (5+ лет) повышает мультипликатор</li>
            <li>• Наличие финансовой отчётности за 2+ года снижает скидку при торге</li>
            <li>• Готовая база постоянных клиентов добавляет 10–15% к цене</li>
          </ul>
          <div className="mt-4">
            <Link
              href="/blog/kak-prodat-avtomoiku-po-rynochnoj-cene"
              className="text-[#e94560] font-semibold hover:underline text-sm"
            >
              Читать: как продать по рыночной цене →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
