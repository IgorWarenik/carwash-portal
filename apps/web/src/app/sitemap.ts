import type { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://avtomoyki-portal.ru'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/otkryt-avtomoiku`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/postavshchiki`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/franshizy`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/guides`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/tools`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  ]

  // TODO: добавить динамические страницы из БД (города, автомойки, гайды)
  // const { prisma } = await import('@carwash/db')
  // const cities = await prisma.city.findMany({ where: { isActive: true } })
  // ...

  return staticPages
}
