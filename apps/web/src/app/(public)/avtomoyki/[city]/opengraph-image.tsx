import { ImageResponse } from 'next/og'
import { prisma } from '@carwash/db'

export const runtime = 'nodejs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

interface Props { params: { city: string } }

export default async function CityOgImage({ params }: Props) {
  const city = await prisma.city.findUnique({
    where: { slug: params.city },
    include: { _count: { select: { carwashes: { where: { status: 'active' } } } } },
  }).catch(() => null)

  const cityName = city?.name ?? 'Ваш город'
  const count = city?._count.carwashes ?? 0

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
          <span style={{ fontSize: 28, fontWeight: 700, color: '#ffffff' }}>Портал</span>
          <span style={{ fontSize: 28, fontWeight: 700, color: '#e94560', marginLeft: '4px' }}>Автомоек</span>
          <span style={{ marginLeft: 'auto', fontSize: 20, color: '#4b5563' }}>businessmoyka.ru</span>
        </div>

        {/* Main */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ fontSize: 22, color: '#e94560', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Автомойки в городе
          </div>
          <div style={{ fontSize: 72, fontWeight: 800, color: '#ffffff', lineHeight: 1.1 }}>
            {cityName}
          </div>
          {count > 0 && (
            <div style={{ fontSize: 28, color: '#9ca3af', marginTop: '8px' }}>
              {count} моек в каталоге — адреса, цены, отзывы
            </div>
          )}
        </div>

        {/* Footer pills */}
        <div style={{ display: 'flex', gap: '12px' }}>
          {['Самообслуживание', 'Ручная мойка', 'Детейлинг', 'Рейтинг'].map(label => (
            <div
              key={label}
              style={{
                background: 'rgba(233, 69, 96, 0.15)',
                border: '1px solid rgba(233, 69, 96, 0.35)',
                color: '#e94560',
                padding: '8px 18px',
                borderRadius: '999px',
                fontSize: 18,
                fontWeight: 600,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  )
}
