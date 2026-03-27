const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://avtomoyki-portal.ru'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BreadcrumbItem {
  name: string
  url: string
}

export interface CarWashJsonLdProps {
  name: string
  description?: string
  address: string
  city: string
  lat?: number
  lng?: number
  phone?: string
  url: string
  priceRange?: string
}

export interface ArticleJsonLdProps {
  title: string
  description?: string
  url: string
  publishedAt: string
  updatedAt?: string
}

export interface FaqItem {
  question: string
  answer: string
}

// ─── Generators ───────────────────────────────────────────────────────────────

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`,
    })),
  }
}

export function carWashJsonLd(props: CarWashJsonLdProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AutoWash',
    name: props.name,
    description: props.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: props.address,
      addressLocality: props.city,
      addressCountry: 'RU',
    },
    ...(props.lat && props.lng
      ? { geo: { '@type': 'GeoCoordinates', latitude: props.lat, longitude: props.lng } }
      : {}),
    ...(props.phone ? { telephone: props.phone } : {}),
    url: props.url.startsWith('http') ? props.url : `${BASE_URL}${props.url}`,
    ...(props.priceRange ? { priceRange: props.priceRange } : {}),
  }
}

export function articleJsonLd(props: ArticleJsonLdProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: props.title,
    description: props.description,
    url: props.url.startsWith('http') ? props.url : `${BASE_URL}${props.url}`,
    datePublished: props.publishedAt,
    dateModified: props.updatedAt ?? props.publishedAt,
    author: {
      '@type': 'Organization',
      name: 'Портал Автомоек',
      url: BASE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Портал Автомоек',
      url: BASE_URL,
    },
  }
}

export function faqJsonLd(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
