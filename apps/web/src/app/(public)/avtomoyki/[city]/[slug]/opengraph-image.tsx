import { ImageResponse } from 'next/og'
import { prisma } from '@carwash/db'

export const runtime = 'nodejs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

interface Props { params: { city: string; slug: string } }

const TYPE_LABELS: Record<string, string> = {
  self_service: 'Самообслуживание',
  automatic: 'Автоматическая мойка',
  manual: 'Ручная мойка',
  detailing: 'Детейлинг',
  truck: 'Для грузовых',
}

// Type-SEO slugs must not render as carwash OG — fall back to default OG
const TYPE_SLUGS = new Set(['samobsluzhivanie', 'ruchnaya', 'avtomaticheskaya', 'deteyling', 'dlya_gruzovik'])

export default async function CarwashOgImage({ params }: Props) {
  if (TYPE_SLUGS.has(params.slug)) {
    // For type-SEO pages, render a generic city+type card
    const city = await prisma.city.findUnique({ where: { slug: params.city } }).catch(() => null)
    const cityName = city?.name ?? ''
    const typeLabel = {
      samobsluzhivanie: 'Самообслуживание',
      ruchnaya: 'Ручная мойка',
      avtomaticheskaya: 'Автоматическая мойка',
      deteyling: 'Детейлинг',
      dlya_gruzovik: 'Для грузовых',
    }[params.slug] ?? 'Автомойки'

    return new ImageResponse(
      (
        <div style={{ background: '#1a1a2e', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '60px 72px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: 26, fontWeight: 700, color: '#fff' }}>Портал</span>
            <span style={{ fontSize: 26, fontWeight: 700, color: '#e94560', marginLeft: '4px' }}>Автомоек</span>
            <span style={{ marginLeft: 'auto', fontSize: 18, color: '#4b5563' }}>businessmoyka.ru</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ fontSize: 22, color: '#e94560', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{typeLabel}</div>
            <div style={{ fontSize: 68, fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>{cityName}</div>
            <div style={{ fontSize: 26, color: '#9ca3af' }}>Адреса, цены и отзывы</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '4px', background: '#e94560', borderRadius: '2px' }} />
            <span style={{ fontSize: 20, color: '#6b7280' }}>Каталог автомоек России</span>
          </div>
        </div>
      ),
      { ...size },
    )
  }

  const cw = await prisma.carWash.findUnique({
    where: { slug: params.slug },
    select: { name: true, type: true, address: true, rating: true, reviewCount: true, priceFrom: true, city: { select: { name: true } } },
  }).catch(() => null)

  const name = cw?.name ?? 'Автомойка'
  const typeLabel = TYPE_LABELS[cw?.type ?? ''] ?? 'Автомойка'
  const cityName = cw?.city.name ?? ''
  const rating = cw?.rating ?? null
  const reviewCount = cw?.reviewCount ?? 0
  const priceFrom = cw?.priceFrom ?? null

  const displayName = name.length > 40 ? name.slice(0, 38) + '…' : name

  return new ImageResponse(
    (
      <div
        style={{
          background: '#1a1a2e',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 72px',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: 26, fontWeight: 700, color: '#fff' }}>Портал</span>
          <span style={{ fontSize: 26, fontWeight: 700, color: '#e94560', marginLeft: '4px' }}>Автомоек</span>
          <span style={{ marginLeft: 'auto', fontSize: 18, color: '#4b5563' }}>businessmoyka.ru</span>
        </div>

        {/* Main */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Type + city */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{
              background: 'rgba(233,69,96,0.15)',
              border: '1px solid rgba(233,69,96,0.35)',
              color: '#e94560',
              padding: '7px 18px',
              borderRadius: '999px',
              fontSize: 20,
              fontWeight: 600,
            }}>
              {typeLabel}
            </div>
            <span style={{ fontSize: 20, color: '#6b7280' }}>{cityName}</span>
          </div>

          {/* Name */}
          <div style={{ fontSize: displayName.length > 28 ? 56 : 68, fontWeight: 800, color: '#fff', lineHeight: 1.15 }}>
            {displayName}
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center', marginTop: '8px' }}>
            {rating && rating > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: 32, color: '#facc15' }}>★</span>
                <span style={{ fontSize: 32, fontWeight: 700, color: '#fff' }}>{rating.toFixed(1)}</span>
                <span style={{ fontSize: 20, color: '#6b7280' }}>({reviewCount} отзывов)</span>
              </div>
            )}
            {priceFrom && (
              <div style={{ fontSize: 26, color: '#9ca3af' }}>
                от <span style={{ color: '#fff', fontWeight: 700 }}>{priceFrom} ₽</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '4px', background: '#e94560', borderRadius: '2px' }} />
          <span style={{ fontSize: 20, color: '#6b7280' }}>Адрес, цены, отзывы, режим работы</span>
        </div>
      </div>
    ),
    { ...size },
  )
}
