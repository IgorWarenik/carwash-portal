import { ImageResponse } from 'next/og'
import { NEW_ARTICLES_DATA } from '../articles-data'
import { ARCHIVE_ARTICLES } from '../articles-archive'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Inline titles for the original 9 articles defined in page.tsx
const ORIGINAL_TITLES: Record<string, { title: string; category: string }> = {
  'kak-otkryt-avtomoiku-samobsluzhivaniya-2025': { title: 'Как открыть автомойку самообслуживания с нуля в 2025 году', category: 'Открыть бизнес' },
  'deteyling-biznes-kak-nachat': { title: 'Детейлинг как бизнес: как начать с нуля', category: 'Открыть бизнес' },
  'biznes-plan-avtomoiki-2025': { title: 'Бизнес-план автомойки 2025: цифры и расчёты', category: 'Финансы' },
  'franshiza-ili-svoyo-delo': { title: 'Франшиза или своё дело: что выбрать', category: 'Стратегия' },
  'rynok-avtomoeek-rossii-2024': { title: 'Рынок автомоек России 2024: аналитика', category: 'Аналитика' },
  'kak-vibrat-lokaciyu-dlya-avtomoiki': { title: 'Как выбрать локацию для автомойки', category: 'Открыть бизнес' },
  'nanockeramika-chto-eto-i-kogda-nuzhna': { title: 'Нанокерамика: что это и когда нужна', category: 'Услуги' },
  'kak-prodat-avtomoiku-po-rynochnoj-cene': { title: 'Как продать автомойку по рыночной цене', category: 'Продажа' },
  'sezonnost-avtomoiki-kak-zarabotat-zimoy': { title: 'Сезонность автомойки: как зарабатывать зимой', category: 'Стратегия' },
}

interface Props { params: { slug: string } }

export default function BlogOgImage({ params }: Props) {
  const slug = params.slug

  // Find article across all sources
  let title = 'Журнал Портала Автомоек'
  let category = 'Статья'

  if (ORIGINAL_TITLES[slug]) {
    title = ORIGINAL_TITLES[slug].title
    category = ORIGINAL_TITLES[slug].category
  } else if (NEW_ARTICLES_DATA[slug]) {
    title = NEW_ARTICLES_DATA[slug].title
    category = NEW_ARTICLES_DATA[slug].category
  } else if (ARCHIVE_ARTICLES[slug]) {
    title = (ARCHIVE_ARTICLES[slug] as { title: string; category: string }).title
    category = (ARCHIVE_ARTICLES[slug] as { title: string; category: string }).category
  }

  // Truncate title for display
  const displayTitle = title.length > 72 ? title.slice(0, 70) + '…' : title

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
          <span style={{ fontSize: 26, fontWeight: 700, color: '#ffffff' }}>Портал</span>
          <span style={{ fontSize: 26, fontWeight: 700, color: '#e94560', marginLeft: '4px' }}>Автомоек</span>
          <span style={{ marginLeft: 'auto', fontSize: 18, color: '#4b5563' }}>businessmoyka.ru</span>
        </div>

        {/* Main */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Category badge */}
          <div style={{
            display: 'flex',
            alignSelf: 'flex-start',
            background: 'rgba(233, 69, 96, 0.15)',
            border: '1px solid rgba(233, 69, 96, 0.35)',
            color: '#e94560',
            padding: '8px 20px',
            borderRadius: '999px',
            fontSize: 20,
            fontWeight: 600,
          }}>
            {category}
          </div>

          {/* Title */}
          <div style={{
            fontSize: displayTitle.length > 50 ? 52 : 62,
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.15,
            maxWidth: '900px',
          }}>
            {displayTitle}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ width: '48px', height: '4px', background: '#e94560', borderRadius: '2px' }} />
          <span style={{ fontSize: 20, color: '#6b7280' }}>Журнал для владельцев и покупателей автомоек</span>
        </div>
      </div>
    ),
    { ...size },
  )
}
