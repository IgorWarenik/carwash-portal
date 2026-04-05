'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const LeadSchema = z.object({
  leadType: z.enum(['BUY', 'SELL', 'OPEN', 'SUPPLIER', 'FRANCHISE', 'GENERAL']),
  name: z.string().min(2).max(100),
  phone: z.string().regex(/^\+?[0-9\s\-()]{7,20}$/).optional(),
  email: z.string().email().optional(),
  message: z.string().max(1000).optional(),
  city: z.string().optional(),
  pageType: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  phoneVerified: z.boolean().optional(),
}).refine(
  (data) => data.phone || data.email,
  { message: 'Укажите телефон или email' }
)

export type LeadInput = z.infer<typeof LeadSchema>

export async function submitLead(input: LeadInput) {
  const parsed = LeadSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().fieldErrors }
  }

  try {
    // Dynamic import to avoid edge runtime issues
    const { prisma } = await import('@carwash/db')
    await prisma.lead.create({
      data: {
        leadType: parsed.data.leadType,
        name: parsed.data.name,
        phone: parsed.data.phone,
        email: parsed.data.email,
        message: parsed.data.message,
        city: parsed.data.city,
        pageType: parsed.data.pageType,
        utmSource: parsed.data.utmSource,
        utmMedium: parsed.data.utmMedium,
        utmCampaign: parsed.data.utmCampaign,
        phoneVerified: parsed.data.phoneVerified ?? false,
      },
    })
    revalidatePath('/admin/leads')
    return { success: true }
  } catch (error) {
    console.error('Lead submission error:', error)
    return { success: false, error: 'Ошибка при отправке заявки. Попробуйте ещё раз.' }
  }
}
