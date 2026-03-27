import type { Metadata } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://avtomoyki-portal.ru'

export function buildCityCarwashMetadata(city: string, cityName: string): Metadata {
  return {
    title: `Автомойки в ${cityName} — каталог, цены, отзывы 2025`,
    description: `Полный каталог автомоек в ${cityName}. Самообслуживание, автоматические, ручные, детейлинг. Адреса, цены, режим работы, отзывы.`,
    alternates: { canonical: `${BASE_URL}/avtomoyki/${city}` },
    openGraph: {
      title: `Автомойки в ${cityName}`,
      description: `Каталог автомоек в ${cityName}`,
      type: 'website',
    },
  }
}

export function buildCarWashMetadata(name: string, city: string, slug: string): Metadata {
  return {
    title: `${name} — автомойка в ${city}`,
    description: `${name} в ${city}: адрес, телефон, цены, режим работы, отзывы. Запись онлайн.`,
    alternates: { canonical: `${BASE_URL}/avtomoyki/${slug}` },
  }
}

export function buildGuideMetadata(title: string, description: string, slug: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/guides/${slug}` },
    openGraph: {
      title,
      description,
      type: 'article',
    },
  }
}
