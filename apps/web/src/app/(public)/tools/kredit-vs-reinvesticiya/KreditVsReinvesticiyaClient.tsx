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

export function KreditVsReinvesticiyaClient() {
  const [equipCost, setEquipCost] = useState(2_000_000)
  const [monthlyProfit, setMonthlyProfit] = useState(200_000)
  const [rate, setRate] = useState(18)
  const [termMonths, setTermMonths] = useState(36)
  const [extraIncome, setExtraIncome] = useState(80_000)

  const r = useMemo(() => {
    // Кредит: аннуитетный платёж
    const monthRate = rate / 100 / 12
    const payment = equipCost * (monthRate * Math.pow(1 + monthRate, termMonths)) / (Math.pow(1 + monthRate, termMonths) - 1)
    const totalPay = payment * termMonths
    const overpay = totalPay - equipCost

    // Срок окупаемости кредита за счёт доп. дохода (нетто = доп.доход - платёж)
    const nettoCredit = extraIncome - payment
    const paybackCredit = nettoCredit > 0 ? Math.ceil(equipCost / extraIncome) : Infinity

    // Реинвестиция: сколько месяцев копить из прибыли
    const savingsMonths = Math.ceil(equipCost / monthlyProfit)

    // Суммарная стоимость денег: кредит = переплата, накопление = упущенная прибыль (мойка не расширялась)
    const opportunityCost = extraIncome * savingsMonths // недополученный доход за время накопления
    const creditTotalCost = overpay

    const creditWins = creditTotalCost < opportunityCost

    return { payment: Math.round(payment), totalPay: Math.round(totalPay), overpay: Math.round(overpay), nettoCredit: Math.round(nettoCredit), paybackCredit, savingsMonths, opportunityCost: Math.round(opportunityCost), creditTotalCost: Math.round(creditTotalCost), creditWins }
  }, [equipCost, monthlyProfit, rate, termMonths, extraIncome])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5">
        <h2 className="text-lg font-semibold">Параметры расширения</h2>
        {[
          { label: 'Стоимость оборудования', value: equipCost, set: setEquipCost, min: 200_000, max: 15_000_000, step: 100_000 },
          { label: 'Текущая прибыль в месяц', value: monthlyProfit, set: setMonthlyProfit, min: 30_000, max: 2_000_000, step: 10_000 },
          { label: 'Доп. доход от нового оборудования', value: extraIncome, set: setExtraIncome, min: 10_000, max: 500_000, step: 5_000 },
        ].map(({ label, value, set, min, max, step }) => (
          <div key={label}>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">{label}</label>
              <span className="text-[#e94560] font-bold">{fmt(value)}</span>
            </div>
            <input type="range" min={min} max={max} step={step} value={value}
              onChange={e => set(Number(e.target.value))} className="w-full accent-[#e94560]" />
          </div>
        ))}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Ставка кредита</label>
            <span className="text-[#e94560] font-bold">{rate}% годовых</span>
          </div>
          <input type="range" min={8} max={35} step={0.5} value={rate}
            onChange={e => setRate(Number(e.target.value))} className="w-full accent-[#e94560]" />
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Срок кредита</label>
            <span className="text-[#e94560] font-bold">{termMonths} мес.</span>
          </div>
          <input type="range" min={6} max={84} step={6} value={termMonths}
            onChange={e => setTermMonths(Number(e.target.value))} className="w-full accent-[#e94560]" />
        </div>
      </div>

      <div className="space-y-4">
        <div className={`rounded-2xl p-6 text-white ${r.creditWins ? 'bg-green-700' : 'bg-[#1a1a2e]'}`}>
          <p className="text-white/70 text-sm mb-1">Выгоднее</p>
          <div className="text-3xl font-bold mb-2">{r.creditWins ? '🏦 Взять кредит' : '💰 Копить прибыль'}</div>
          <p className="text-white/70 text-sm">
            {r.creditWins
              ? `Экономия: ${fmt(r.opportunityCost - r.creditTotalCost)} за счёт быстрого старта`
              : `Переплата по кредиту (${fmt(r.overpay)}) дороже упущенной прибыли`}
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Кредит</h3>
          <Row label="Ежемесячный платёж" value={fmt(r.payment)} highlight />
          <Row label="Итого выплат" value={fmt(r.totalPay)} />
          <Row label="Переплата банку" value={fmt(r.overpay)} />
          <Row label="Чистый доп. доход в месяц" value={fmt(r.nettoCredit)} sub="доп. доход минус платёж по кредиту" />
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Реинвестиция</h3>
          <Row label="Месяцев на накопление" value={`${r.savingsMonths} мес.`} highlight />
          <Row label="Упущенный доход за это время" value={fmt(r.opportunityCost)} sub="доп. выручка, которую не получили" />
        </div>
      </div>
    </div>
  )
}
