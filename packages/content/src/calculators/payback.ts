// Калькулятор окупаемости автомойки

export interface PaybackInput {
  carwashType: 'self_service' | 'automatic' | 'manual' | 'detailing'
  posts: number
  capex: number           // Общий CAPEX в рублях
  rent: number            // Аренда/ипотека в месяц
  utilities: number       // Коммунальные расходы в месяц
  payroll: number         // ФОТ в месяц
  consumables: number     // Химия и расходники в месяц
  avgCheck: number        // Средний чек в рублях
  carsPerDay: number      // Машин в день
  seasonalityWinter: number // Коэффициент зима (0.5-1.0)
  seasonalitySummer: number // Коэффициент лето (0.8-1.5)
}

export interface PaybackResult {
  monthlyRevenue: number
  monthlyExpenses: number
  monthlyEbitda: number
  paybackMonths: number
  annualRevenue: number
  sensitivityMinus20: { revenue: number; ebitda: number; payback: number }
  sensitivityPlus20: { revenue: number; ebitda: number; payback: number }
  warnings: string[]
}

export function calculatePayback(input: PaybackInput): PaybackResult {
  const warnings: string[] = []

  // Средняя выручка (учитываем сезонность — 4 мес зима + 8 мес обычно)
  const avgSeasonality = (input.seasonalityWinter * 4 + 1.0 * 8) / 12
  const monthlyRevenue = input.avgCheck * input.carsPerDay * 30 * avgSeasonality

  // Расходы
  const monthlyExpenses = input.rent + input.utilities + input.payroll + input.consumables

  // EBITDA
  const monthlyEbitda = monthlyRevenue - monthlyExpenses

  // Окупаемость
  const paybackMonths = monthlyEbitda > 0 ? Math.ceil(input.capex / monthlyEbitda) : Infinity

  // Чувствительность ±20%
  const calcEbitda = (carsMultiplier: number) => {
    const rev = input.avgCheck * input.carsPerDay * carsMultiplier * 30 * avgSeasonality
    return rev - monthlyExpenses
  }

  const ebitdaMinus = calcEbitda(0.8)
  const ebitdaPlus = calcEbitda(1.2)

  // Предупреждения
  if (paybackMonths > 60) warnings.push('Срок окупаемости превышает 5 лет — высокий риск')
  if (input.carsPerDay < 20 && input.carwashType === 'self_service')
    warnings.push('Для самообслуживания менее 20 машин в день — низкая загрузка')
  if (monthlyEbitda <= 0) warnings.push('Расходы превышают выручку при текущих параметрах')
  if (input.capex < 500_000) warnings.push('CAPEX кажется заниженным — проверьте все статьи затрат')

  return {
    monthlyRevenue: Math.round(monthlyRevenue),
    monthlyExpenses: Math.round(monthlyExpenses),
    monthlyEbitda: Math.round(monthlyEbitda),
    paybackMonths: Math.round(paybackMonths),
    annualRevenue: Math.round(monthlyRevenue * 12),
    sensitivityMinus20: {
      revenue: Math.round(input.avgCheck * input.carsPerDay * 0.8 * 30),
      ebitda: Math.round(ebitdaMinus),
      payback: ebitdaMinus > 0 ? Math.ceil(input.capex / ebitdaMinus) : Infinity,
    },
    sensitivityPlus20: {
      revenue: Math.round(input.avgCheck * input.carsPerDay * 1.2 * 30),
      ebitda: Math.round(ebitdaPlus),
      payback: ebitdaPlus > 0 ? Math.ceil(input.capex / ebitdaPlus) : Infinity,
    },
    warnings,
  }
}
