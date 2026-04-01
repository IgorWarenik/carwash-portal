import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Портал Автомоек — найти, купить, открыть автомойку'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#1a1a2e',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
          <span style={{ fontSize: 56, fontWeight: 800, color: '#ffffff' }}>Портал</span>
          <span style={{ fontSize: 56, fontWeight: 800, color: '#e94560', marginLeft: '4px' }}>Автомоек</span>
        </div>

        {/* Tagline */}
        <div style={{
          fontSize: 28,
          color: '#9ca3af',
          textAlign: 'center',
          maxWidth: '800px',
          lineHeight: 1.4,
          marginBottom: '48px',
        }}>
          Найти, купить, продать или открыть автомойку в России
        </div>

        {/* Pills */}
        <div style={{ display: 'flex', gap: '16px' }}>
          {['Каталог моек', 'Франшизы', '12 калькуляторов', 'Журнал'].map(label => (
            <div
              key={label}
              style={{
                background: 'rgba(233, 69, 96, 0.15)',
                border: '1px solid rgba(233, 69, 96, 0.4)',
                color: '#e94560',
                padding: '10px 20px',
                borderRadius: '999px',
                fontSize: 20,
                fontWeight: 600,
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* URL */}
        <div style={{ position: 'absolute', bottom: '40px', color: '#4b5563', fontSize: 18 }}>
          avtomoyki-portal.ru
        </div>
      </div>
    ),
    { ...size },
  )
}
