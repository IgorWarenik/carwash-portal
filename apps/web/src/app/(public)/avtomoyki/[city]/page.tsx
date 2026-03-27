import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface Props {
  params: { city: string }
  searchParams: { type?: string; page?: string; sort?: string }
}

// Временная заглушка — заменить на запрос из БД
const CITIES: Record<string, string> = {
  moskva: 'Москве',
  'sankt-peterburg': 'Санкт-Петербурге',
  ekaterinburg: 'Екатеринбурге',
  novosibirsk: 'Новосибирске',
  krasnodar: 'Краснодаре',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cityName = CITIES[params.city]
  if (!cityName) return {}
  return {
    title: `Автомойки в ${cityName} — каталог, цены, отзывы`,
    description: `Найдите лучшие автомойки в ${cityName}. Самообслуживание, автоматические, ручные. Цены, адреса, режим работы, отзывы.`,
    alternates: {
      canonical: `/avtomoyki/${params.city}`,
    },
  }
}

export default async function CityCarwashesPage({ params, searchParams }: Props) {
  const cityName = CITIES[params.city]
  if (!cityName) notFound()

  // TODO: загрузить автомойки из БД с фильтрацией
  const combosCount = Object.keys(searchParams).length

  return (
    <main>
      <h1>Автомойки в {cityName}</h1>
      {combosCount > 3 && (
        <meta name="robots" content="noindex" />
      )}
      <p>Список автомоек — скоро появится.</p>
    </main>
  )
}
