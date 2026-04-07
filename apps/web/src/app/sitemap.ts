import type { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.businessmoyka.ru'

const BLOG_SLUGS = [
  // Existing 9 articles
  'kak-otkryt-avtomoiku-samobsluzhivaniya-2025',
  'deteyling-biznes-kak-nachat',
  'biznes-plan-avtomoiki-2025',
  'franshiza-ili-svoyo-delo',
  'rynok-avtomoeek-rossii-2024',
  'kak-vibrat-lokaciyu-dlya-avtomoiki',
  'nanockeramika-chto-eto-i-kogda-nuzhna',
  'kak-prodat-avtomoiku-po-rynochnoj-cene',
  'sezonnost-avtomoiki-kak-zarabotat-zimoy',
  // New 15 articles
  'skolko-zarabatyvaet-avtomoika-v-mesyac',
  'ruchnaya-avtomoika-kak-otkryt',
  'avtomaticheskaya-moika-portalka-plyusy-minusy',
  'oborudovanie-dlya-avtomoiki-sravnenie',
  'marketing-avtomoiki-kak-privlech-klientov',
  'programma-loyalnosti-dlya-avtomoiki',
  'moika-dlya-gruzovykh-avto-biznes',
  'khimiya-dlya-avtomoiki-chto-vybrat',
  'personal-dlya-ruchnoj-avtomoiki',
  'avtomatizaciya-avtomoiki-terminaly-crm',
  'oshibki-nachinayushchikh-vladelcev-avtomoek',
  'ekologiya-avtomoiki-oborotnaya-voda',
  'investicii-v-avtomoiku-roi',
  'kak-kupit-gotovuyu-avtomoiku',
  // Archive 21 articles
  'kak-rabotaet-moika-samoobsluzhivaniya',
  'avtomoika-v-garazhe-zakonno-ili-net',
  'raskhody-avtomoiki-polnyy-spisok',
  'kak-otkryt-ip-dlya-avtomoiki',
  'bescontactnaya-moika-plyusy-minusy',
  'korporativnye-klienty-dlya-avtomoiki',
  'shiномontazh-pri-avtomoike',
  'videonabyudenie-na-avtomoike',
  'cenovaya-politika-avtomoiki',
  'moika-v-torgovom-centre',
  'khimchistka-salona-kak-biznes',
  'elektromobili-i-avtomoyki',
  'moika-po-podpiske',
  'zapusk-avtomoiki-v-regione-vs-moskva',
  'kak-nanyat-upravlyayushchego-avtomoikoy',
  'deteyling-poliroka-i-zaschita',
  'kak-povysit-pribyl-avtomoiki',
  'zakryt-ili-prodat-avtomoiku',
  'trendy-avtomoeechnogo-rynka-2025',
  'antikrizisnyy-marketing-avtomoiki',
  'kak-uvelichit-sredny-chek-avtomoiki',
]

const TOOL_SLUGS = [
  'roi-calculator',
  'ocenka-biznesa',
  'nalog-usn-patent',
  'kredit-vs-reinvesticiya',
  'rentabelnost-uslug',
  'ocenka-lokacii',
  'raskhod-khimii',
  'optimalny-shtat',
  'elektropotreblenie',
  'ltv-klienta',
  'programma-loyalnosti',
  'povyshenie-ceny',
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
    { url: `${BASE_URL}/tools`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/avtomoyki/reyting`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/kupit-franshizu`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/dlya-vladeltcev`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
  ]

  const blogPages: MetadataRoute.Sitemap = BLOG_SLUGS.map(slug => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const toolPages: MetadataRoute.Sitemap = TOOL_SLUGS.map(slug => ({
    url: `${BASE_URL}/tools/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const franchisePages: MetadataRoute.Sitemap = FRANCHISE_SLUGS.map(slug => ({
    url: `${BASE_URL}/franshizy/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const TYPE_SLUGS = ['samobsluzhivanie', 'ruchnaya', 'avtomaticheskaya', 'deteyling', 'dlya_gruzovik']

  // Dynamic city pages from DB
  let cityPages: MetadataRoute.Sitemap = []
  let cityTypePages: MetadataRoute.Sitemap = []
  let cityBuyPages: MetadataRoute.Sitemap = []
  let cityPricePages: MetadataRoute.Sitemap = []
  let cityRatingPages: MetadataRoute.Sitemap = []
  let city24hPages: MetadataRoute.Sitemap = []
  let districtPages: MetadataRoute.Sitemap = []
  let carwashPages: MetadataRoute.Sitemap = []
  try {
    const { prisma } = await import('@carwash/db')
    const cities = await prisma.city.findMany({ where: { isActive: true }, select: { slug: true } })

    // Individual carwash pages
    const carwashes = await prisma.carWash.findMany({
      where: { status: 'active' },
      select: { slug: true, updatedAt: true, city: { select: { slug: true } } },
    })
    carwashPages = carwashes.map(cw => ({
      url: `${BASE_URL}/avtomoyki/${cw.city.slug}/${cw.slug}`,
      lastModified: cw.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    // District pages
    const districtRows = await prisma.carWash.findMany({
      where: { status: 'active', district: { not: null } },
      select: { district: true, city: { select: { slug: true } } },
      distinct: ['district', 'cityId'],
    })
    districtPages = districtRows
      .filter(r => r.district)
      .map(r => ({
        url: `${BASE_URL}/avtomoyki/${r.city.slug}/rayon/${r.district!.toLowerCase().replace(/\s+/g, '-')}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))
    cityPages = cities.map(c => ({
      url: `${BASE_URL}/avtomoyki/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
    cityTypePages = cities.flatMap(c =>
      TYPE_SLUGS.map(t => ({
        url: `${BASE_URL}/avtomoyki/${c.slug}/${t}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))
    )
    cityBuyPages = cities.map(c => ({
      url: `${BASE_URL}/kupit-avtomoiku/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }))
    cityPricePages = cities.map(c => ({
      url: `${BASE_URL}/avtomoyki/${c.slug}/ceny`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
    // Check which cities have 24h carwashes
    const cities24h = await prisma.carWash.findMany({
      where: { status: 'active', isOpen24h: true },
      select: { city: { select: { slug: true } } },
      distinct: ['cityId'],
    })
    cityRatingPages = cities.map(c => ({
      url: `${BASE_URL}/avtomoyki/${c.slug}/rejting`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
    city24hPages = cities24h.map(r => ({
      url: `${BASE_URL}/avtomoyki/${r.city.slug}/kruglosutochno`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch {
    // DB unavailable during build — skip dynamic pages
  }

  return [...staticPages, ...blogPages, ...toolPages, ...franchisePages, ...cityPages, ...cityTypePages, ...cityBuyPages, ...cityPricePages, ...cityRatingPages, ...city24hPages, ...districtPages, ...carwashPages]
}
