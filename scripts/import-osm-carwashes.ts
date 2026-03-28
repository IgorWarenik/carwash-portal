/**
 * Импорт автомоек из OpenStreetMap (Overpass API)
 * Запуск: DATABASE_URL=... npx tsx scripts/import-osm-carwashes.ts
 */

import { PrismaClient, CarWashType, DataSource, ContentStatus } from '@prisma/client'

const prisma = new PrismaClient()

// ── Helpers ─────────────────────────────────────────────────────────────────

function slugify(text: string): string {
  const map: Record<string, string> = {
    а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'yo',ж:'zh',з:'z',и:'i',й:'y',
    к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',
    х:'kh',ц:'ts',ч:'ch',ш:'sh',щ:'sch',ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya',
  }
  return text.toLowerCase()
    .split('').map(c => map[c] ?? c).join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

function uniqueSlug(base: string, used: Set<string>): string {
  let slug = base
  let i = 2
  while (used.has(slug)) slug = `${base}-${i++}`
  used.add(slug)
  return slug
}

function detectType(tags: Record<string, string>): CarWashType {
  const t = (tags['car_wash:type'] ?? tags['car_wash'] ?? '').toLowerCase()
  const name = (tags['name'] ?? '').toLowerCase()
  if (t === 'self-service' || t === 'self_service' || tags['self_service'] === 'yes') return 'self_service'
  if (t === 'automatic' || name.includes('тоннел') || name.includes('автомат')) return 'automatic'
  if (name.includes('детейл') || name.includes('detailing') || name.includes('полир')) return 'detailing'
  if (name.includes('самообслужив') || name.includes('само-') || name.includes('самомой')) return 'self_service'
  return 'manual'
}

function normalizePhone(raw?: string): string | undefined {
  if (!raw) return undefined
  const digits = raw.replace(/\D/g, '')
  if (digits.length === 11 && digits.startsWith('7')) return `+7 (${digits.slice(1,4)}) ${digits.slice(4,7)}-${digits.slice(7,9)}-${digits.slice(9)}`
  if (digits.length === 11 && digits.startsWith('8')) return `+7 (${digits.slice(1,4)}) ${digits.slice(4,7)}-${digits.slice(7,9)}-${digits.slice(9)}`
  return raw.trim()
}

function buildAddress(tags: Record<string, string>, cityName: string): string {
  const parts: string[] = []
  if (tags['addr:street']) parts.push(tags['addr:street'])
  if (tags['addr:housenumber']) parts.push(tags['addr:housenumber'])
  if (parts.length === 0 && tags['addr:full']) return tags['addr:full']
  if (parts.length === 0) return cityName
  return parts.join(', ')
}

// ── Overpass fetch ───────────────────────────────────────────────────────────

interface OsmElement {
  type: string
  id: number
  lat?: number
  lon?: number
  center?: { lat: number; lon: number }
  tags?: Record<string, string>
}

async function fetchCarwashesForCity(lat: number, lng: number, radius = 15000): Promise<OsmElement[]> {
  const query = `
[out:json][timeout:30];
(
  node["amenity"="car_wash"](around:${radius},${lat},${lng});
  way["amenity"="car_wash"](around:${radius},${lat},${lng});
  node["shop"="car_wash"](around:${radius},${lat},${lng});
  way["shop"="car_wash"](around:${radius},${lat},${lng});
);
out center tags;`

  const url = 'https://overpass-api.de/api/interpreter'
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `data=${encodeURIComponent(query)}`,
  })
  if (!res.ok) throw new Error(`Overpass error ${res.status}: ${await res.text()}`)
  const data = await res.json() as { elements: OsmElement[] }
  return data.elements
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const cities = await prisma.city.findMany({ where: { isActive: true } })
  console.log(`\n🗺️  Импорт автомоек из OpenStreetMap для ${cities.length} городов\n`)

  const existingSlugs = new Set(
    (await prisma.carWash.findMany({ select: { slug: true } })).map(c => c.slug)
  )

  let totalImported = 0
  let totalSkipped = 0

  for (const city of cities) {
    if (!city.lat || !city.lng) {
      console.log(`  ⚠️  ${city.name}: нет координат, пропуск`)
      continue
    }

    console.log(`  🔍 ${city.name} (${city.lat}, ${city.lng})...`)

    let elements: OsmElement[]
    try {
      elements = await fetchCarwashesForCity(city.lat, city.lng)
    } catch (e) {
      console.log(`     ❌ Ошибка запроса: ${e}`)
      // Пауза при ошибке и повтор
      await new Promise(r => setTimeout(r, 5000))
      try {
        elements = await fetchCarwashesForCity(city.lat, city.lng)
      } catch {
        console.log(`     ❌ Повторная ошибка, пропуск`)
        continue
      }
    }

    // Убираем дубли (way + node для одного объекта)
    const seen = new Set<number>()
    const unique = elements.filter(el => {
      if (seen.has(el.id)) return false
      seen.add(el.id)
      return true
    })

    console.log(`     📍 Найдено: ${unique.length} объектов`)

    let cityImported = 0
    for (const el of unique) {
      const tags = el.tags ?? {}
      const name = tags['name'] ?? tags['name:ru'] ?? 'Автомойка'
      if (!name || name === 'Автомойка' && !tags['addr:street']) {
        totalSkipped++
        continue
      }

      const lat = el.lat ?? el.center?.lat
      const lon = el.lon ?? el.center?.lon

      const baseSlug = uniqueSlug(
        `${slugify(name)}-${city.slug}`,
        existingSlugs
      )

      const type = detectType(tags)
      const address = buildAddress(tags, city.name)
      const phone = normalizePhone(tags['phone'] ?? tags['contact:phone'])
      const website = tags['website'] ?? tags['contact:website'] ?? tags['url'] ?? undefined
      const isOpen24h = tags['opening_hours'] === '24/7'
      const workingHours = tags['opening_hours'] && tags['opening_hours'] !== '24/7'
        ? tags['opening_hours'].replace(/Mo-Su/g, 'Пн-Вс').replace(/Mo-Fr/g, 'Пн-Пт')
        : undefined

      try {
        await prisma.carWash.create({
          data: {
            name,
            slug: baseSlug,
            type,
            address,
            district: tags['addr:suburb'] ?? tags['addr:district'] ?? undefined,
            lat: lat ?? undefined,
            lng: lon ?? undefined,
            phone,
            website,
            isOpen24h,
            workingHours: isOpen24h ? '24/7' : workingHours,
            services: [],
            photos: [],
            status: ContentStatus.active,
            source: DataSource.import,
            sourceUrl: `https://www.openstreetmap.org/${el.type}/${el.id}`,
            importedAt: new Date(),
            cityId: city.id,
          },
        })
        cityImported++
        totalImported++
      } catch (e: unknown) {
        if ((e as { code?: string }).code === 'P2002') {
          totalSkipped++ // slug collision
        } else {
          console.log(`     ⚠️  Ошибка записи "${name}": ${e}`)
        }
      }
    }

    console.log(`     ✅ Импортировано: ${cityImported}`)

    // Пауза между городами чтобы не перегрузить Overpass
    await new Promise(r => setTimeout(r, 2000))
  }

  const total = await prisma.carWash.count({ where: { status: 'active' } })
  console.log(`\n🏁 Готово!`)
  console.log(`   Импортировано: ${totalImported}`)
  console.log(`   Пропущено:     ${totalSkipped}`)
  console.log(`   Итого в базе:  ${total} автомоек\n`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
