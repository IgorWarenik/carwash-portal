'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

type WashType = 'self_service' | 'manual' | 'automatic' | 'detailing'
type CitySize = 'million' | 'large' | 'medium' | 'small'

const CITY_MULTIPLIERS: Record<CitySize, number> = {
  million: 1.3,  // Москва, СПб, Екатеринбург
  large: 1.1,    // 500к–1 млн
  medium: 1.0,   // 200к–500к
  small: 0.85,   // <200к
}

const BASE_METRICS: Record<WashType, {
  investPerPost: number
  avgCheckMin: number
  avgCheckMax: number
  carsPerDayPerPost: number
  operatingCostRatio: number
  label: string
}> = {
  self_service: {
    investPerPost: 500000,
    avgCheckMin: 200,
    avgCheckMax: 400,
    carsPerDayPerPost: 25,
    operatingCostRatio: 0.35,
    label: 'Самообслуживание',
  },
  manual: {
    investPerPost: 800000,
    avgCheckMin: 700,
    avgCheckMax: 1100,
    carsPerDayPerPost: 12,
    operatingCostRatio: 0.65,
    label: 'Ручная мойка',
  },
  automatic: {
    investPerPost: 2500000,
    avgCheckMin: 400,
    avgCheckMax: 900,
    carsPerDayPerPost: 40,
    operatingCostRatio: 0.45,
    label: 'Автоматическая',
  },
  detailing: {
    investPerPost: 1500000,
    avgCheckMin: 3000,
    avgCheckMax: 15000,
    carsPerDayPerPost: 2,
    operatingCostRatio: 0.55,
    label: 'Детейлинг',
  },
}

function formatRub(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} млн ₽`
  if (n >= 1_000) return `${Math.round(n / 1_000)} тыс. ₽`
  return `${Math.round(n)} ₽`
}

function ResultRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`flex justify-between items-center py-3 border-b border-gray-100 last:border-0 ${highlight ? 'font-semibold text-lg' : ''}`}>
      <span className={highlight ? 'text-gray-900' : 'text-gray-600'}>{label}</span>
      <span className={highlight ? 'text-[#e94560]' : 'text-gray-900'}>{value}</span>
    </div>
  )
}

export function RoiCalculatorClient({ nationalBenchmarks = {} }: { nationalBenchmarks?: Record<string, number> }) {
  const [washType, setWashType] = useState<WashType>('self_service')
  const [posts, setPosts] = useState(4)
  const [citySize, setCitySize] = useState<CitySize>('million')
  const [ownLand, setOwnLand] = useState(false)
  const [is24h, setIs24h] = useState(true)

  const results = useMemo(() => {
    const base = BASE_METRICS[washType]
    const cityMult = CITY_MULTIPLIERS[citySize]
    const hoursMult = is24h ? 1.0 : 0.75

    // Use real benchmark avg_check if available, else fall back to hardcoded midpoint
    const baseAvgCheck = nationalBenchmarks[washType] ?? ((base.avgCheckMin + base.avgCheckMax) / 2)
    const avgCheck = baseAvgCheck * cityMult
    const carsPerDay = base.carsPerDayPerPost * posts * hoursMult
    const dailyRevenue = carsPerDay * avgCheck
    const monthlyRevenue = dailyRevenue * 26 // 26 working days avg
    const monthlyOperating = monthlyRevenue * base.operatingCostRatio
    const monthlyProfit = monthlyRevenue - monthlyOperating

    const investBase = base.investPerPost * posts
    const landCost = ownLand ? 0 : (washType === 'automatic' ? 800000 : 500000)
    const totalInvest = investBase + landCost

    const paybackMonths = totalInvest / monthlyProfit
    const roi = (monthlyProfit * 12 / totalInvest) * 100
    const breakEvenCars = Math.ceil(monthlyOperating / avgCheck / 26)

    return {
      avgCheck: Math.round(avgCheck),
      carsPerDay: Math.round(carsPerDay),
      monthlyRevenue: Math.round(monthlyRevenue),
      monthlyOperating: Math.round(monthlyOperating),
      monthlyProfit: Math.round(monthlyProfit),
      totalInvest: Math.round(totalInvest),
      paybackMonths: Math.round(paybackMonths),
      roi: Math.round(roi),
      breakEvenCars,
    }
  }, [washType, posts, citySize, ownLand, is24h])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input panel */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
        <h2 className="text-lg font-semibold">Параметры вашей мойки</h2>

        {/* Wash type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Тип мойки</label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(BASE_METRICS) as WashType[]).map((t) => (
              <button
                key={t}
                onClick={() => setWashType(t)}
                className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-colors text-left ${
                  washType === t
                    ? 'bg-[#e94560] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {BASE_METRICS[t].label}
              </button>
            ))}
          </div>
        </div>

        {/* Posts */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Количество постов: <span className="text-[#e94560] font-bold">{posts}</span>
          </label>
          <input
            type="range"
            min={1}
            max={12}
            value={posts}
            onChange={(e) => setPosts(Number(e.target.value))}
            className="w-full accent-[#e94560]"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1 пост</span>
            <span>12 постов</span>
          </div>
        </div>

        {/* City size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Размер города</label>
          <div className="grid grid-cols-2 gap-2">
            {([
              { value: 'million', label: 'Миллионник' },
              { value: 'large', label: '500к–1 млн' },
              { value: 'medium', label: '200к–500к' },
              { value: 'small', label: 'До 200к' },
            ] as const).map((c) => (
              <button
                key={c.value}
                onClick={() => setCitySize(c.value)}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  citySize === c.value
                    ? 'bg-[#1a1a2e] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-3">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm font-medium text-gray-700">Работа 24/7</span>
            <button
              onClick={() => setIs24h(!is24h)}
              className={`relative w-11 h-6 rounded-full transition-colors ${is24h ? 'bg-[#e94560]' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${is24h ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm font-medium text-gray-700">Собственная земля</span>
            <button
              onClick={() => setOwnLand(!ownLand)}
              className={`relative w-11 h-6 rounded-full transition-colors ${ownLand ? 'bg-[#e94560]' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${ownLand ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </label>
        </div>
      </div>

      {/* Results panel */}
      <div className="space-y-4">
        {/* Main result card */}
        <div className="bg-[#1a1a2e] text-white rounded-2xl p-6">
          {nationalBenchmarks[washType] && (
            <div className="inline-flex items-center gap-1.5 text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full mb-3">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
              Средний чек — реальные данные рынка РФ 2025
            </div>
          )}
          <h2 className="text-sm font-medium text-gray-400 mb-1">Ежемесячная прибыль</h2>
          <div className="text-4xl font-bold text-[#e94560] mb-4">
            {formatRub(results.monthlyProfit)}
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-400">Инвестиции</div>
              <div className="font-semibold text-lg">{formatRub(results.totalInvest)}</div>
            </div>
            <div>
              <div className="text-gray-400">Окупаемость</div>
              <div className="font-semibold text-lg">{results.paybackMonths} мес.</div>
            </div>
          </div>
        </div>

        {/* Detailed breakdown */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Детализация</h3>
          <ResultRow label="Средний чек" value={`${results.avgCheck} ₽`} />
          <ResultRow label="Авто в день" value={`${results.carsPerDay} шт.`} />
          <ResultRow label="Выручка в месяц" value={formatRub(results.monthlyRevenue)} />
          <ResultRow label="Операционные расходы" value={`−${formatRub(results.monthlyOperating)}`} />
          <ResultRow label="Прибыль в месяц" value={formatRub(results.monthlyProfit)} highlight />
          <ResultRow label="ROI в год" value={`${results.roi}%`} highlight />
          <ResultRow label="Точка безубыточности" value={`${results.breakEvenCars} авто/день`} />
        </div>

        {/* CTA */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 text-sm">
          <p className="font-semibold text-gray-900 mb-2">Хотите открыть мойку?</p>
          <p className="text-gray-600 mb-4">
            Читайте пошаговый гайд или оставьте заявку — мы подберём оборудование и локацию.
          </p>
          <div className="flex gap-3">
            <Link href="/otkryt-avtomoiku" className="px-4 py-2 bg-[#e94560] text-white rounded-lg font-medium text-sm hover:bg-[#c73652] transition-colors">
              Гайд по открытию
            </Link>
            <Link href="/franshizy" className="px-4 py-2 bg-white border border-gray-200 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors">
              Смотреть франшизы
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
