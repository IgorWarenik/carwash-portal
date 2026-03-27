export interface CityConfig {
  slug: string
  name: string
  nameIn: string   // "в Москве"
  region: string
  population: number
}

export const CITIES: CityConfig[] = [
  { slug: 'moskva', name: 'Москва', nameIn: 'Москве', region: 'Москва', population: 12_600_000 },
  { slug: 'sankt-peterburg', name: 'Санкт-Петербург', nameIn: 'Санкт-Петербурге', region: 'Санкт-Петербург', population: 5_400_000 },
  { slug: 'ekaterinburg', name: 'Екатеринбург', nameIn: 'Екатеринбурге', region: 'Свердловская область', population: 1_500_000 },
  { slug: 'novosibirsk', name: 'Новосибирск', nameIn: 'Новосибирске', region: 'Новосибирская область', population: 1_620_000 },
  { slug: 'krasnodar', name: 'Краснодар', nameIn: 'Краснодаре', region: 'Краснодарский край', population: 1_000_000 },
]

export function getCityBySlug(slug: string): CityConfig | undefined {
  return CITIES.find((c) => c.slug === slug)
}
