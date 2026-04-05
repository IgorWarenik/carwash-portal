import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { prisma } from '@carwash/db'
import { ClaimForm } from './ClaimForm'

interface Props { params: { token: string } }

export const metadata: Metadata = {
  title: 'Подтверждение владения автомойкой',
  robots: 'noindex',
}

export default async function ClaimPage({ params }: Props) {
  const carwash = await prisma.carWash.findUnique({
    where: { claimToken: params.token },
    include: { city: { select: { name: true, slug: true } } },
  }).catch(() => null)

  if (!carwash) notFound()

  return (
    <main className="max-w-2xl mx-auto px-4 py-16">
      <div className="bg-white border border-gray-200 rounded-2xl p-8">
        <div className="mb-6">
          <span className="inline-block text-xs font-medium bg-green-100 text-green-700 px-3 py-1 rounded-full mb-4">
            ✓ Ссылка подтверждена
          </span>
          <h1 className="text-2xl font-bold mb-2">Обновите данные вашей мойки</h1>
          <p className="text-gray-500 text-sm">
            <span className="font-semibold text-gray-900">{carwash.name}</span>{' '}
            — {carwash.city.name}
          </p>
        </div>

        <ClaimForm
          token={params.token}
          initial={{
            phone: carwash.phone ?? '',
            workingHours: carwash.workingHours ?? '',
            priceFrom: carwash.priceFrom ?? undefined,
            priceTo: carwash.priceTo ?? undefined,
            description: carwash.description ?? '',
            services: carwash.services ?? [],
          }}
        />
      </div>
    </main>
  )
}
