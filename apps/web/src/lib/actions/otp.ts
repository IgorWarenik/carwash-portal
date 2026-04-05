'use server'

import { z } from 'zod'

const PhoneSchema = z.string().regex(/^[78]\d{10}$/, 'Неверный формат телефона')

function generateCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

async function sendSms(phone: string, code: string): Promise<boolean> {
  const apiKey = process.env.SMSRU_API_KEY
  if (!apiKey) {
    // Dev mode: log code instead of sending SMS
    console.log(`[SMS OTP] phone=${phone} code=${code}`)
    return true
  }
  try {
    const e164 = phone.startsWith('8') ? `7${phone.slice(1)}` : phone
    const url = `https://sms.ru/sms/send?api_id=${apiKey}&to=${e164}&msg=Ваш+код+подтверждения:+${code}.+Портал+Автомоек&json=1`
    const res = await fetch(url)
    const data = await res.json()
    return data.status === 'OK'
  } catch {
    return false
  }
}

export async function requestPhoneOtp(phone: string): Promise<{ success: boolean; error?: string }> {
  const parsed = PhoneSchema.safeParse(phone)
  if (!parsed.success) {
    return { success: false, error: 'Неверный формат номера' }
  }

  const code = generateCode()
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

  try {
    const { prisma } = await import('@carwash/db')

    // Invalidate any existing unused OTPs for this phone
    await prisma.phoneOtp.updateMany({
      where: { phone, used: false },
      data: { used: true },
    })

    await prisma.phoneOtp.create({
      data: { phone, code, expiresAt },
    })

    const sent = await sendSms(phone, code)
    if (!sent) {
      return { success: false, error: 'Не удалось отправить SMS. Попробуйте позже.' }
    }

    return { success: true }
  } catch {
    return { success: false, error: 'Ошибка сервера. Попробуйте позже.' }
  }
}

export async function verifyPhoneOtp(
  phone: string,
  code: string
): Promise<{ success: boolean; error?: string }> {
  const parsed = PhoneSchema.safeParse(phone)
  if (!parsed.success) return { success: false, error: 'Неверный формат номера' }
  if (!/^\d{4}$/.test(code)) return { success: false, error: 'Код должен состоять из 4 цифр' }

  try {
    const { prisma } = await import('@carwash/db')

    const otp = await prisma.phoneOtp.findFirst({
      where: { phone, code, used: false },
      orderBy: { createdAt: 'desc' },
    })

    if (!otp) return { success: false, error: 'Неверный код' }
    if (otp.expiresAt < new Date()) return { success: false, error: 'Код истёк. Запросите новый.' }

    await prisma.phoneOtp.update({ where: { id: otp.id }, data: { used: true } })

    return { success: true }
  } catch {
    return { success: false, error: 'Ошибка сервера' }
  }
}
