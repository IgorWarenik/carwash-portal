import type { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://avtomoyki-portal.ru'

const BLOG_SLUGS = [
  'kak-otkryt-avtomoiku-samobsluzhivaniya-2025',
  'deteyling-biznes-kak-nachat',
  'franshiza-ili-svoyo-delo',
  'rynok-avtomoeek-rossii-2024',
  'kak-vibrat-lokaciyu-dlya-avtomoiki',
  'nanockeramika-chto-eto-i-kogda-nuzhna',
  'kak-prodat-avtomoiku-po-rynochnoj-cene',
  'sezonnost-avtomoiki-kak-zarabotat-zimoy',
]

const FRANCHISE_SLUGS = ['150bar', 'sukhomoy', 'moyka', 'geizer', 'alles', 'avtomoyka-express']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/avtomoyki`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/franshizy`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/otkryt-avtomoiku`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/kupit-avtomoiku`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/prodaty-avtomoiku`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/postavshchiki`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/tools/roi-calculator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/kupit-franshizu`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/tools`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
  ]

  const blogPages: MetadataRoute.Sitemap = BLOG_SLUGS.map(slug => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const franchisePages: MetadataRoute.Sitemap = FRANCHISE_SLUGS.map(slug => ({
    url: `${BASE_URL}/franshizy/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Dynamic city + carwash pages from DB
  let cityPages: MetadataRoute.Sitemap = []
  try {
    const { prisma } = await import('@carwash/db')
    const cities = await prisma.city.findMany({ where: { isActive: true }, select: { slug: true } })
    cityPages = cities.map(c => ({
      url: `${BASE_URL}/avtomoyki/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch {
    // DB unavailable during build — skip dynamic pages
  }

  return [...staticPages, ...blogPages, ...franchisePages, ...cityPages]
}
