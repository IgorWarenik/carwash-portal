'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const ReviewSchema = z.object({
  carwashId: z.string().min(1),
  carwashSlug: z.string().min(1),
  citySlug: z.string().min(1),
  authorName: z.string().min(2).max(80).transform(s => s.trim()),
  rating: z.number().int().min(1).max(5),
  text: z.string().max(1000).optional().transform(s => s?.trim() || undefined),
})

export async function submitReview(input: z.infer<typeof ReviewSchema>) {
  const parsed = ReviewSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: 'Неверные данные' }
  }

  try {
    const { prisma } = await import('@carwash/db')

    // Rate limit: max 3 reviews per carwash with same authorName in 24h
    const recent = await prisma.review.count({
      where: {
        carwashId: parsed.data.carwashId,
        authorName: parsed.data.authorName,
        createdAt: { gte: new Date(Date.now() - 86400_000) },
      },
    })
    if (recent >= 3) {
      return { success: false, error: 'Вы уже оставляли отзыв сегодня' }
    }

    const review = await prisma.review.create({
      data: {
        carwashId: parsed.data.carwashId,
        authorName: parsed.data.authorName,
        rating: parsed.data.rating,
        text: parsed.data.text,
        source: 'manual',
        publishedAt: new Date(),
      },
    })

    // Update carwash aggregate rating
    const stats = await prisma.review.aggregate({
      where: { carwashId: parsed.data.carwashId },
      _avg: { rating: true },
      _count: { id: true },
    })
    await prisma.carWash.update({
      where: { id: parsed.data.carwashId },
      data: {
        rating: stats._avg.rating ?? 0,
        reviewCount: stats._count.id,
      },
    })

    revalidatePath(`/avtomoyki/${parsed.data.citySlug}/${parsed.data.carwashSlug}`)
    return { success: true, reviewId: review.id }
  } catch {
    return { success: false, error: 'Ошибка сервера. Попробуйте позже.' }
  }
}
