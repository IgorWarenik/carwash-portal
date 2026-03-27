// Калькулятор оценки автомойки как бизнеса

export interface ValuationInput {
  carwashType: 'self_service' | 'automatic' | 'manual' | 'detailing'
  monthlyRevenue: number       // Выручка в месяц
  isRevenueConfirmed: boolean  // Подтверждена документально
  monthlyProfit: number        // Чистая прибыль в месяц
  equipmentAge: number         // Возраст оборудования, лет
  landStatus: 'owned' | 'lease'
  posts: number
  leaseYearsRemaining?: number // Лет до конца аренды (если аренда)
}

export interface ValuationResult {
  valuationMin: number
  valuationMax: number
  ebitdaMultiplier: number
  annualProfit: number
  riskFlags: string[]
  recommendations: string[]
}

// Мультипликаторы EBITDA по типу мойки
const MULTIPLIERS: Record<string, { min: number; max: number }> = {
  detailing: { min: 3.0, max: 5.0 },
  automatic: { min: 2.5, max: 4.0 },
  manual: { min: 2.0, max: 3.5 },
  self_service: { min: 2.0, max: 3.5 },
}

export function calculateValuation(input: ValuationInput): ValuationResult {
  const riskFlags: string[] = []
  const recommendations: string[] = []

  const annualProfit = input.monthlyProfit * 12
  const { min, max } = MULTIPLIERS[input.carwashType]

  let multiplierMin = min
  let multiplierMax = max

  // Корректировки мультипликатора
  if (!input.isRevenueConfirmed) {
    multiplierMin *= 0.7
    multiplierMax *= 0.8
    riskFlags.push('Выручка не подтверждена документально — дисконт 20-30%')
  }

  if (input.equipmentAge > 5) {
    multiplierMin *= 0.85
    multiplierMax *= 0.9
    riskFlags.push(`Оборудование ${input.equipmentAge} лет — требуется оценка износа`)
  }

  if (input.landStatus === 'lease') {
    if ((input.leaseYearsRemaining ?? 0) < 3) {
      multiplierMin *= 0.7
      multiplierMax *= 0.8
      riskFlags.push('Аренда заканчивается менее чем через 3 года — высокий риск')
    } else {
      multiplierMin *= 0.9
      multiplierMax *= 0.95
      riskFlags.push('Объект на аренде — проверьте условия переуступки')
    }
  }

  // Оценка
  const valuationMin = Math.round(annualProfit * multiplierMin)
  const valuationMax = Math.round(annualProfit * multiplierMax)
  const ebitdaMultiplier = (multiplierMin + multiplierMax) / 2

  // Рекомендации
  if (input.monthlyRevenue / input.posts < 100_000)
    recommendations.push('Выручка на пост ниже рыночной — потенциал роста или завышенная оценка')
  recommendations.push('Запросите управленческую отчётность за 12+ месяцев')
  recommendations.push('Проверьте договор аренды земли/помещения')
  if (input.equipmentAge > 3)
    recommendations.push('Закажите технический аудит оборудования')

  return {
    valuationMin,
    valuationMax,
    ebitdaMultiplier,
    annualProfit,
    riskFlags,
    recommendations,
  }
}
