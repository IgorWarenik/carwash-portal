import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@carwash/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const city = searchParams.get('city')
  const type = searchParams.get('type') // optional CarWashType enum value
  const limit = Math.min(Number(searchParams.get('limit') ?? 3), 6)

  if (!city) {
    return NextResponse.json({ error: 'city required' }, { status: 400 })
  }

  try {
    const carwashes = await prisma.carWash.findMany({
      where: {
        city: { slug: city },
        status: 'active',
        ...(type ? { type: type as never } : {}),
      },
      orderBy: [{ featured: 'desc' }, { rating: 'desc' }],
      take: limit,
      select: {
        id: true, name: true, slug: true, type: true,
        address: true, rating: true, reviewCount: true,
        priceFrom: true, phone: true, isOpen24h: true, workingHours: true,
        city: { select: { slug: true, name: true } },
      },
    })
    return NextResponse.json({ carwashes })
  } catch {
    return NextResponse.json({ carwashes: [] })
  }
}
