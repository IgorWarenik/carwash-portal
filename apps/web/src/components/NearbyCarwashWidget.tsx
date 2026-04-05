'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

const CITIES = [
  { slug: 'moskva', name: 'Москва' },
  { slug: 'sankt-peterburg', name: 'Санкт-Петербург' },
  { slug: 'ekaterinburg', name: 'Екатеринбург' },
  { slug: 'novosibirsk', name: 'Новосибирск' },
  { slug: 'kazan', name: 'Казань' },
  { slug: 'krasnodar', name: 'Краснодар' },
  { slug: 'ufa', name: 'Уфа' },
  { slug: 'tyumen', name: 'Тюмень' },
  { slug: 'rostov-na-donu', name: 'Ростов-на-Дону' },
  { slug: 'volgograd', name: 'Волгоград' },
]

const TYPE_LABELS: Record<string, string> = {
  self_service: 'Самообслуживание',
  automatic: 'Автоматическая',
  manual: 'Ручная',
  detailing: 'Детейлинг',
  truck: 'Для грузовых',
}

interface Carwash {
  id: string; name: string; slug: string; type: string
  address: string; rating: number | null; priceFrom: number | null
  phone: string | null; isOpen24h: boolean; workingHours: string | null
  city: { slug: string; name: string }
}

export function NearbyCarwashWidget({ suggestedType }: { suggestedType?: string }) {
  const [city, setCity] = useState('')
  const [carwashes, setCarwashes] = useState<Carwash[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    if (!city) return
    setLoading(true)
    setSearched(true)
    const params = new URLSearchParams({ city, limit: '3' })
    if (suggestedType) params.set('type', suggestedType)
    fetch(`/api/carwashes/nearby?${params}`)
      .then(r => r.json())
      .then(d => { setCarwashes(d.carwashes ?? []); setLoading(false) })
      .catch(() => { setCarwashes([]); setLoading(false) })
  }, [city, suggestedType])

  return (
    <div className="bg-[#1a1a2e] rounded-2xl p-6 text-white">
      <h3 className="font-bold text-lg mb-1">Найти автомойку в вашем городе</h3>
      <p className="text-gray-400 text-sm mb-4">Выберите город — покажем лучшие варианты из каталога</p>

      <select
        value={city}
        onChange={e => setCity(e.target.value)}
        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#e94560] transition-colors mb-4"
      >
        <option value="" className="text-gray-900">Выберите город...</option>
        {CITIES.map(c => (
          <option key={c.slug} value={c.slug} className="text-gray-900">{c.name}</option>
        ))}
      </select>

      {loading && (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white/5 rounded-xl p-4 animate-pulse h-20" />
          ))}
        </div>
      )}

      {!loading && searched && carwashes.length === 0 && (
        <div className="text-center py-4 text-gray-400 text-sm">
          Моек в каталоге пока нет.{' '}
          <Link href={`/avtomoyki/${city}`} className="text-[#e94560] hover:underline">
            Смотреть каталог →
          </Link>
        </div>
      )}

      {!loading && carwashes.length > 0 && (
        <div className="space-y-3">
          {carwashes.map(cw => (
            <Link
              key={cw.id}
              href={`/avtomoyki/${cw.city.slug}/${cw.slug}`}
              className="group flex items-start justify-between bg-white/10 hover:bg-white/15 rounded-xl p-4 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-semibold group-hover:text-[#e94560] transition-colors line-clamp-1">{cw.name}</span>
                  {cw.isOpen24h && <span className="text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded flex-shrink-0">24/7</span>}
                </div>
                <p className="text-xs text-gray-400 line-clamp-1">{cw.address}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-300">
                  <span>{TYPE_LABELS[cw.type] ?? cw.type}</span>
                  {cw.rating && cw.rating > 0 && <span>★ {cw.rating.toFixed(1)}</span>}
                  {cw.priceFrom && <span>от {cw.priceFrom} ₽</span>}
                </div>
              </div>
              {cw.phone && (
                <a
                  href={`tel:${cw.phone}`}
                  onClick={e => e.stopPropagation()}
                  className="flex-shrink-0 ml-3 text-xs text-[#e94560] font-semibold hover:underline"
                >
                  Позвонить
                </a>
              )}
            </Link>
          ))}
          <Link
            href={`/avtomoyki/${city}`}
            className="block text-center text-sm text-[#e94560] hover:underline mt-2"
          >
            Все мойки в городе →
          </Link>
        </div>
      )}
    </div>
  )
}
