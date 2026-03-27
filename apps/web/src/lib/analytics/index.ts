declare global {
  interface Window {
    ym?: (id: number, action: string, goal: string, params?: Record<string, unknown>) => void
  }
}

const METRIKA_ID = Number(process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID ?? 0)

type EventParams = Record<string, string | number | boolean | undefined>

export function trackEvent(name: string, params?: EventParams) {
  if (typeof window === 'undefined') return
  if (!METRIKA_ID) return
  window.ym?.(METRIKA_ID, 'reachGoal', name, params)
}

export function trackLeadStart(leadType: string, pageUrl: string, city?: string) {
  trackEvent('lead_form_start', { lead_type: leadType, page_url: pageUrl, city })
}

export function trackLeadSubmit(leadType: string, city?: string, hasPhone?: boolean, hasEmail?: boolean) {
  trackEvent('lead_form_submit', {
    lead_type: leadType,
    city,
    has_phone: hasPhone,
    has_email: hasEmail,
  })
}

export function trackCalculatorStart(calculatorType: string) {
  trackEvent('calculator_start', { calculator_type: calculatorType })
}

export function trackCalculatorComplete(calculatorType: string, resultSummary?: string) {
  trackEvent('calculator_complete', { calculator_type: calculatorType, result_summary: resultSummary })
}

export function trackPhoneClick(carwashSlug: string, city?: string, sourcePage?: string) {
  trackEvent('click_phone', { carwash_slug: carwashSlug, city, source_page: sourcePage })
}

export function trackSearch(query: string, city?: string, resultsCount?: number) {
  trackEvent('search_performed', { query, city, results_count: resultsCount })
}
