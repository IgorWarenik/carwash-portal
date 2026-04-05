'use server'

import { z } from 'zod'
import crypto from 'crypto'

const EmailSchema = z.string().email('Неверный email')
const ClaimUpdateSchema = z.object({
  token: z.string().min(1),
  phone: z.string().optional(),
  workingHours: z.string().optional(),
  priceFrom: z.number().min(0).optional(),
  priceTo: z.number().min(0).optional(),
  description: z.string().max(2000).optional(),
  services: z.array(z.string()).optional(),
})

export async function initiateOwnerClaim(
  carwashId: string,
  email: string
): Promise<{ success: boolean; error?: string }> {
  const emailParsed = EmailSchema.safeParse(email)
  if (!emailParsed.success) return { success: false, error: 'Неверный email' }

  try {
    const { prisma } = await import('@carwash/db')

    const carwash = await prisma.carWash.findUnique({ where: { id: carwashId } })
    if (!carwash) return { success: false, error: 'Автомойка не найдена' }

    const token = crypto.randomBytes(32).toString('hex')

    await prisma.carWash.update({
      where: { id: carwashId },
      data: { claimToken: token, ownerEmail: email },
    })

    const claimUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://avtomoyki-portal.ru'}/claim/${token}`

    // Send email (Resend or log in dev)
    const resendKey = process.env.RESEND_API_KEY
    if (resendKey) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'Портал Автомоек <noreply@avtomoyki-portal.ru>',
          to: email,
          subject: `Подтвердите владение: ${carwash.name}`,
          html: `<p>Вы запросили права владельца для мойки <b>${carwash.name}</b>.</p>
<p><a href="${claimUrl}" style="background:#e94560;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin:16px 0">Подтвердить и обновить данные →</a></p>
<p style="color:#888;font-size:12px">Ссылка действительна 48 часов. Если вы не запрашивали это — просто проигнорируйте письмо.</p>`,
        }),
      })
    } else {
      console.log(`[Claim] carwash=${carwash.name} email=${email} url=${claimUrl}`)
    }

    return { success: true }
  } catch {
    return { success: false, error: 'Ошибка сервера. Попробуйте позже.' }
  }
}

export async function processClaimUpdate(
  input: z.infer<typeof ClaimUpdateSchema>
): Promise<{ success: boolean; error?: string; carwashSlug?: string; citySlug?: string }> {
  const parsed = ClaimUpdateSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: 'Неверные данные' }

  try {
    const { prisma } = await import('@carwash/db')

    const carwash = await prisma.carWash.findUnique({
      where: { claimToken: parsed.data.token },
      include: { city: { select: { slug: true } } },
    })

    if (!carwash) return { success: false, error: 'Недействительная ссылка' }

    const updateData: Record<string, unknown> = {
      claimedByOwner: true,
      claimedAt: new Date(),
      claimToken: null, // invalidate after use
    }
    if (parsed.data.phone !== undefined) updateData.phone = parsed.data.phone
    if (parsed.data.workingHours !== undefined) updateData.workingHours = parsed.data.workingHours
    if (parsed.data.priceFrom !== undefined) updateData.priceFrom = parsed.data.priceFrom
    if (parsed.data.priceTo !== undefined) updateData.priceTo = parsed.data.priceTo
    if (parsed.data.description !== undefined) updateData.description = parsed.data.description
    if (parsed.data.services !== undefined) updateData.services = parsed.data.services

    await prisma.carWash.update({ where: { id: carwash.id }, data: updateData })

    return { success: true, carwashSlug: carwash.slug, citySlug: carwash.city.slug }
  } catch {
    return { success: false, error: 'Ошибка сервера' }
  }
}
