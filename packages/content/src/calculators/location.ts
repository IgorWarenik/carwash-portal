// Wizard оценки локации для автомойки

export interface LocationInput {
  city: string
  trafficLevel: 'high' | 'medium' | 'low'
  isResidentialArea: boolean
  competitorsNearby: number       // в радиусе 1 км
  format: 'standalone' | 'embedded'
  nearGasStation: boolean
  nearShoppingCenter: boolean
  nearAutoService: boolean
  visibilityFromRoad: 'excellent' | 'good' | 'poor'
  accessConvenience: 'convenient' | 'average' | 'inconvenient'
}

export interface LocationResult {
  score: number                   // 0-100
  grade: 'A' | 'B' | 'C' | 'D'
  recommendedFormat: string
  warnings: string[]
  strengths: string[]
}

export function evaluateLocation(input: LocationInput): LocationResult {
  let score = 0
  const warnings: string[] = []
  const strengths: string[] = []

  // Трафик (0-25 очков)
  if (input.trafficLevel === 'high') { score += 25; strengths.push('Высокий трафик') }
  else if (input.trafficLevel === 'medium') score += 15
  else { score += 5; warnings.push('Низкий трафик — высокий риск') }

  // Жилой массив (0-15 очков)
  if (input.isResidentialArea) { score += 15; strengths.push('Жилой массив рядом') }

  // Конкуренты (0-20 очков)
  if (input.competitorsNearby === 0) { score += 20; strengths.push('Нет конкурентов в радиусе 1 км') }
  else if (input.competitorsNearby === 1) score += 10
  else if (input.competitorsNearby === 2) score += 5
  else { warnings.push(`${input.competitorsNearby} конкурента в радиусе 1 км`) }

  // Синергия (0-15 очков)
  if (input.nearGasStation) { score += 5; strengths.push('Рядом АЗС') }
  if (input.nearShoppingCenter) { score += 5; strengths.push('Рядом ТЦ') }
  if (input.nearAutoService) { score += 5; strengths.push('Рядом автосервис') }

  // Видимость (0-15 очков)
  if (input.visibilityFromRoad === 'excellent') { score += 15; strengths.push('Отличная видимость с дороги') }
  else if (input.visibilityFromRoad === 'good') score += 8
  else { score += 0; warnings.push('Плохая видимость с дороги') }

  // Подъезд (0-10 очков)
  if (input.accessConvenience === 'convenient') { score += 10; strengths.push('Удобный подъезд') }
  else if (input.accessConvenience === 'average') score += 5
  else { warnings.push('Неудобный подъезд — ключевой фактор оттока') }

  // Формат: отдельно стоящая бонус
  if (input.format === 'standalone') score += 5

  score = Math.min(100, score)

  const grade: LocationResult['grade'] =
    score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : 'D'

  const recommendedFormat =
    score >= 70
      ? 'Самообслуживание 4-6 постов или автоматическая мойка'
      : score >= 50
      ? 'Самообслуживание 2-3 поста'
      : 'Не рекомендуется для открытия автомойки'

  return { score, grade, recommendedFormat, warnings, strengths }
}
