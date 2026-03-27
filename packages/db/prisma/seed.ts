import { PrismaClient, CarWashType, ContentStatus, DataSource } from '@prisma/client'

const prisma = new PrismaClient()

const CITIES = [
  { name: 'Москва', slug: 'moskva', region: 'Московская область', population: 12655050, lat: 55.7558, lng: 37.6173 },
  { name: 'Санкт-Петербург', slug: 'sankt-peterburg', region: 'Ленинградская область', population: 5384342, lat: 59.9311, lng: 30.3609 },
  { name: 'Екатеринбург', slug: 'ekaterinburg', region: 'Свердловская область', population: 1544376, lat: 56.8389, lng: 60.6057 },
  { name: 'Новосибирск', slug: 'novosibirsk', region: 'Новосибирская область', population: 1625631, lat: 54.9885, lng: 82.9207 },
  { name: 'Казань', slug: 'kazan', region: 'Республика Татарстан', population: 1308660, lat: 55.7887, lng: 49.1221 },
  { name: 'Краснодар', slug: 'krasnodar', region: 'Краснодарский край', population: 1060797, lat: 45.0448, lng: 38.9760 },
  { name: 'Уфа', slug: 'ufa', region: 'Республика Башкортостан', population: 1128787, lat: 54.7388, lng: 55.9721 },
  { name: 'Ростов-на-Дону', slug: 'rostov-na-donu', region: 'Ростовская область', population: 1137904, lat: 47.2357, lng: 39.7015 },
  { name: 'Тюмень', slug: 'tyumen', region: 'Тюменская область', population: 847488, lat: 57.1553, lng: 65.5880 },
  { name: 'Волгоград', slug: 'volgograd', region: 'Волгоградская область', population: 1008998, lat: 48.7080, lng: 44.5133 },
]

const CARWASHES_BY_CITY: Record<string, Array<{
  name: string
  type: CarWashType
  address: string
  phone?: string
  rating: number
  reviewCount: number
  priceFrom?: number
  priceTo?: number
  description?: string
  workingHours?: string
  services: string[]
}>> = {
  moskva: [
    {
      name: 'АкваСервис на Ленинградке',
      type: 'self_service',
      address: 'Ленинградское шоссе, 85',
      phone: '+7 495 123-45-67',
      rating: 4.7,
      reviewCount: 234,
      priceFrom: 100,
      priceTo: 500,
      workingHours: '24/7',
      description: 'Современная мойка самообслуживания с 8 постами. Пылесосы, химчистка салона.',
      services: ['8 постов', 'Пылесосы', 'Бесконтактная оплата', 'Видеокамеры'],
    },
    {
      name: 'Чистый Автомобиль Детейлинг',
      type: 'detailing',
      address: 'ул. Профсоюзная, 130',
      phone: '+7 495 987-65-43',
      rating: 4.9,
      reviewCount: 89,
      priceFrom: 3000,
      priceTo: 25000,
      workingHours: '9:00–22:00',
      description: 'Профессиональный детейлинг: полировка, нанокерамика, химчистка салона.',
      services: ['Нанокерамика', 'Полировка', 'Химчистка', 'Антикор'],
    },
    {
      name: 'Автомойка на Автозаводской',
      type: 'manual',
      address: 'ул. Автозаводская, 17',
      phone: '+7 495 555-12-34',
      rating: 4.3,
      reviewCount: 456,
      priceFrom: 500,
      priceTo: 2000,
      workingHours: '8:00–23:00',
      description: 'Ручная мойка с опытным персоналом. Быстро и качественно.',
      services: ['Ручная мойка', 'Полировка', 'Шиномонтаж рядом'],
    },
    {
      name: 'WASH-GO Тоннельная',
      type: 'automatic',
      address: 'Кутузовский проспект, 45',
      rating: 4.1,
      reviewCount: 712,
      priceFrom: 350,
      priceTo: 900,
      workingHours: '8:00–22:00',
      description: 'Автоматическая тоннельная мойка. До 200 автомобилей в день.',
      services: ['Тоннельная', 'Сушка', 'Полировочный воск'],
    },
    {
      name: 'EcoWash Самообслуживание',
      type: 'self_service',
      address: 'Варшавское шоссе, 113',
      rating: 4.5,
      reviewCount: 178,
      priceFrom: 80,
      priceTo: 400,
      workingHours: '24/7',
      description: 'Экологичная мойка с рециркуляцией воды. Экономит воду на 70%.',
      services: ['Рециркуляция воды', '6 постов', 'Эко-химия', 'QR-оплата'],
    },
  ],
  'sankt-peterburg': [
    {
      name: 'Невская Мойка Самообслуживания',
      type: 'self_service',
      address: 'пр. Невский, 200',
      rating: 4.6,
      reviewCount: 312,
      priceFrom: 90,
      priceTo: 450,
      workingHours: '24/7',
      description: 'Крупная мойка самообслуживания в центре СПб. 10 постов.',
      services: ['10 постов', 'Тёплые боксы', 'СБП оплата'],
    },
    {
      name: 'Детейлинг Студия Премиум',
      type: 'detailing',
      address: 'ул. Звенигородская, 28',
      rating: 4.8,
      reviewCount: 67,
      priceFrom: 5000,
      priceTo: 30000,
      workingHours: '10:00–20:00',
      description: 'Элитный детейлинг. Сертифицированные мастера, работа с Ferrari и Porsche.',
      services: ['Нанокерамика', 'Бронепленка', 'Полировка', 'Кожаный салон'],
    },
    {
      name: 'АвтоЧистка у Витебского',
      type: 'manual',
      address: 'Загородный пр., 52',
      rating: 4.4,
      reviewCount: 289,
      priceFrom: 600,
      priceTo: 1800,
      workingHours: '8:00–22:00',
      description: 'Ручная мойка около Витебского вокзала.',
      services: ['Ручная мойка', 'Полировка кузова', 'Химчистка'],
    },
  ],
  ekaterinburg: [
    {
      name: 'САМОМОЙ на Сибирском',
      type: 'self_service',
      address: 'Сибирский тракт, 8а',
      rating: 4.5,
      reviewCount: 198,
      priceFrom: 80,
      priceTo: 350,
      workingHours: '24/7',
      description: 'Современная мойка самообслуживания. 6 постов, тёплые боксы.',
      services: ['6 постов', 'Тёплые боксы', 'Пылесосы', 'Оплата картой'],
    },
    {
      name: 'EkbDetailing Pro',
      type: 'detailing',
      address: 'ул. Малышева, 145',
      rating: 4.7,
      reviewCount: 43,
      priceFrom: 2500,
      priceTo: 20000,
      workingHours: '10:00–21:00',
      description: 'Профессиональный детейлинг в Екатеринбурге.',
      services: ['Нанокерамика', 'Полировка', 'Тонировка'],
    },
  ],
  novosibirsk: [
    {
      name: 'МойСам Новосибирск',
      type: 'self_service',
      address: 'ул. Большевистская, 101',
      rating: 4.4,
      reviewCount: 156,
      priceFrom: 70,
      priceTo: 300,
      workingHours: '24/7',
      description: 'Доступная мойка самообслуживания. 4 поста.',
      services: ['4 поста', 'Терминал оплаты', 'Пылесосы'],
    },
  ],
  kazan: [
    {
      name: 'АкваСтар Самообслуживание',
      type: 'self_service',
      address: 'пр. Победы, 87',
      rating: 4.6,
      reviewCount: 223,
      priceFrom: 85,
      priceTo: 380,
      workingHours: '24/7',
      description: 'Лучшая мойка самообслуживания в Казани. 8 постов.',
      services: ['8 постов', 'Тёплые боксы', 'QR-оплата', 'Камеры'],
    },
  ],
  krasnodar: [
    {
      name: 'КрасноДАР Мойка',
      type: 'self_service',
      address: 'ул. Красная, 176',
      rating: 4.5,
      reviewCount: 187,
      priceFrom: 75,
      priceTo: 320,
      workingHours: '24/7',
      description: 'Популярная мойка в центре Краснодара.',
      services: ['6 постов', 'Бесконтактная мойка', 'СБП'],
    },
  ],
  ufa: [
    {
      name: 'УфаМойка Самообслуживания',
      type: 'self_service',
      address: 'пр. Октября, 34',
      rating: 4.3,
      reviewCount: 134,
      priceFrom: 70,
      priceTo: 300,
      workingHours: '24/7',
      description: 'Доступная мойка с новым оборудованием.',
      services: ['4 поста', 'Пылесосы', 'Оплата картой'],
    },
  ],
  'rostov-na-donu': [
    {
      name: 'РостовМой',
      type: 'self_service',
      address: 'пр. Соколова, 62',
      rating: 4.2,
      reviewCount: 98,
      priceFrom: 75,
      priceTo: 280,
      workingHours: '24/7',
      description: 'Мойка самообслуживания в центре Ростова.',
      services: ['4 поста', 'Оплата картой'],
    },
  ],
  tyumen: [
    {
      name: 'ТюменьМойка 24',
      type: 'self_service',
      address: 'ул. Мельникайте, 117',
      rating: 4.4,
      reviewCount: 112,
      priceFrom: 80,
      priceTo: 320,
      workingHours: '24/7',
      description: 'Круглосуточная мойка самообслуживания.',
      services: ['6 постов', 'Тёплые боксы', 'Пылесосы'],
    },
  ],
  volgograd: [
    {
      name: 'ВолгоМой',
      type: 'self_service',
      address: 'пр. Ленина, 203',
      rating: 4.1,
      reviewCount: 87,
      priceFrom: 65,
      priceTo: 260,
      workingHours: '24/7',
      description: 'Мойка самообслуживания в Волгограде.',
      services: ['4 поста', 'Терминал оплаты'],
    },
  ],
}

const FRANCHISES = [
  {
    name: '150bar',
    slug: '150bar',
    description: 'Одна из крупнейших сетей автомоек самообслуживания России. Тёплые боксы, работа в -40°C, окупаемость менее 1 года.',
    investmentFrom: 1900000,
    investmentTo: 5000000,
    royalty: 5.0,
    paybackMonths: 10,
    postsCount: '2-6',
    supportLevel: 'full',
  },
  {
    name: 'Сухомой',
    slug: 'sukhomoy',
    description: 'Мойка без воды — уникальный формат с 2011 года. Низкие инвестиции, нет требований к канализации.',
    investmentFrom: 800000,
    investmentTo: 2500000,
    royalty: 6.0,
    paybackMonths: 15,
    postsCount: '1-3',
    supportLevel: 'partial',
  },
  {
    name: 'МОЙ-КА!',
    slug: 'moyka',
    description: 'Федеральная сеть с мобильным приложением и программой лояльности. 90+ точек по России.',
    investmentFrom: 2500000,
    investmentTo: 8000000,
    royalty: 7.0,
    paybackMonths: 22,
    postsCount: '4-8',
    supportLevel: 'full',
  },
  {
    name: 'GEIZER',
    slug: 'geizer',
    description: 'Автомойка самообслуживания 24/7. Более 60 авто в день, чистая прибыль от 100 тыс./пост.',
    investmentFrom: 2000000,
    investmentTo: 6000000,
    royalty: 5.0,
    paybackMonths: 18,
    postsCount: '3-6',
    supportLevel: 'full',
  },
  {
    name: 'ALLES',
    slug: 'alles',
    description: 'Топ-100 франшиз 2024 по версии Forbes. Немецкое оборудование Kärcher, стандарты качества.',
    investmentFrom: 3000000,
    investmentTo: 9000000,
    royalty: 6.0,
    paybackMonths: 24,
    postsCount: '4-10',
    supportLevel: 'full',
  },
  {
    name: 'Автомойка Экспресс',
    slug: 'avtomoyka-express',
    description: 'Самый низкий порог входа на рынке. Доход от 200 тыс./мес с первого месяца.',
    investmentFrom: 470000,
    investmentTo: 1500000,
    royalty: 4.0,
    paybackMonths: 8,
    postsCount: '1-2',
    supportLevel: 'partial',
  },
]

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

async function main() {
  console.log('🌱 Seeding database...')

  // Seed cities
  console.log('📍 Creating cities...')
  const cityMap: Record<string, string> = {}
  for (const city of CITIES) {
    const created = await prisma.city.upsert({
      where: { slug: city.slug },
      update: {},
      create: {
        name: city.name,
        slug: city.slug,
        region: city.region,
        population: city.population,
        lat: city.lat,
        lng: city.lng,
        isActive: true,
      },
    })
    cityMap[city.slug] = created.id
    console.log(`  ✓ ${city.name}`)
  }

  // Seed carwashes
  console.log('🚗 Creating carwashes...')
  for (const [citySlug, carwashes] of Object.entries(CARWASHES_BY_CITY)) {
    const cityId = cityMap[citySlug]
    if (!cityId) continue

    for (const cw of carwashes) {
      const slug = slugify(cw.name)
      const existing = await prisma.carWash.findUnique({ where: { slug } })
      if (existing) {
        console.log(`  ~ ${cw.name} (already exists)`)
        continue
      }
      await prisma.carWash.create({
        data: {
          cityId,
          name: cw.name,
          slug,
          type: cw.type,
          address: cw.address,
          phone: cw.phone,
          rating: cw.rating,
          reviewCount: cw.reviewCount,
          priceFrom: cw.priceFrom,
          priceTo: cw.priceTo,
          description: cw.description,
          workingHours: cw.workingHours,
          services: cw.services,
          status: ContentStatus.active,
          source: DataSource.manual,
        },
      })
      console.log(`  ✓ ${cw.name} (${citySlug})`)
    }
  }

  // Seed franchises
  console.log('🤝 Creating franchises...')
  for (const franchise of FRANCHISES) {
    await prisma.franchise.upsert({
      where: { slug: franchise.slug },
      update: {},
      create: {
        name: franchise.name,
        slug: franchise.slug,
        description: franchise.description,
        investmentFrom: franchise.investmentFrom,
        investmentTo: franchise.investmentTo,
        royalty: franchise.royalty,
        paybackMonths: franchise.paybackMonths,
        postsCount: franchise.postsCount,
        supportLevel: franchise.supportLevel,
        status: ContentStatus.active,
      },
    })
    console.log(`  ✓ ${franchise.name}`)
  }

  console.log('✅ Seed complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
