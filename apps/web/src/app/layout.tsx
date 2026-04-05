import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  metadataBase: new URL((() => { const u = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://avtomoyki-portal.ru'; return u.startsWith('http') ? u : `https://${u}`; })()),
  title: {
    default: 'Портал Автомоек — каталог, покупка, открытие',
    template: '%s | Портал Автомоек',
  },
  description:
    'Каталог автомоек России: найти, купить, продать, открыть автомойку. ' +
    'Поставщики оборудования, франшизы, калькуляторы окупаемости.',
  robots: { index: true, follow: true },
  verification: { yandex: 'a40a7017bdc1929e' },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'Портал Автомоек',
    title: 'Портал Автомоек — найти, купить, открыть автомойку',
    description: 'Каталог автомоек, франшизы, калькуляторы ROI. Самообслуживание, ручные, детейлинг.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Портал Автомоек' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Портал Автомоек',
    description: 'Найти, купить или открыть автомойку в России',
    images: ['/opengraph-image'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <head>
        <Script id="ym-init" strategy="beforeInteractive">{`
          (function(m,e,t,r,i,k,a){
            m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
          })(window,document,'script','https://mc.yandex.ru/metrika/tag.js?id=108281366','ym');
          ym(108281366,'init',{ssr:true,webvisor:true,clickmap:true,ecommerce:"dataLayer",referrer:document.referrer,url:location.href,accurateTrackBounce:true,trackLinks:true});
        `}</Script>
        <noscript>
          <div><img src="https://mc.yandex.ru/watch/108281366" style={{position:'absolute',left:'-9999px'}} alt="" /></div>
        </noscript>
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
