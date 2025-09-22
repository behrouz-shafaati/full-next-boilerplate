'use client'

import { useSearchParams } from 'next/navigation'

/**
 * هوکی برای ساختن آدرس جدید با پارامترهای دلخواه.
 *
 * این هوک از `useSearchParams` در Next.js استفاده می‌کنه
 * تا همیشه پارامترهای فعلی URL رو داشته باشه و روی اون‌ها
 * پارامترهای جدید رو اضافه یا جایگزین کنه.
 *
 * @returns یک آبجکت شامل تابع `buildUrlWithParams`
 */
export function useUpdatedUrl() {
  const searchParams = useSearchParams()

  /**
   * ساخت URL جدید با پارامترهای ترکیب‌شده از
   * آدرس فعلی و ورودی‌های جدید.
   *
   * @template T
   * @param baseUrl - آدرس پایه:
   *   - اگر `null` باشه → از آدرس فعلی مرورگر (`origin + pathname`) استفاده می‌شه.
   *   - اگر `string` باشه → همون رشته به‌عنوان آدرس پایه در نظر گرفته می‌شه.
   *
   * @param params - آبجکتی شامل کلید و مقدارهایی که می‌خوای
   *   در query string قرار بگیره یا مقدار فعلی‌شون جایگزین بشه.
   *   - key: رشته (نام پارامتر)
   *   - value: `string | number | boolean`
   *     → به صورت `String(value)` به query string اضافه می‌شه.
   *
   * @returns یک رشته‌ی کامل URL شامل:
   *   - آدرس پایه (`baseUrl` یا URL فعلی)
   *   - query string نهایی با همه‌ی پارامترها
   *
   * @example
   * ```ts
   * const { buildUrlWithParams } = useUpdatedUrl()
   *
   * // وقتی baseUrl = null باشه
   * const url1 = buildUrlWithParams(null, { page: 2, search: "test" })
   * // خروجی مثلاً: "https://example.com/products?page=2&search=test"
   *
   * // وقتی baseUrl مشخص باشه
   * const url2 = buildUrlWithParams("/dashboard", { tab: "settings" })
   * // خروجی: "/dashboard?tab=settings"
   * ```
   */
  function buildUrlWithParams(
    baseUrl: string | null,
    params: Record<string, string | number | boolean> = {}
  ): string {
    const currentUrl = new URL(window.location.href)
    const currentUrlParams = new URLSearchParams(searchParams.toString())

    // override or add new params
    Object.entries(params).forEach(([key, value]) => {
      currentUrlParams.set(key, String(value))
    })

    // اگر baseUrl خالی بود، از url فعلی استفاده می‌کنیم
    const finalBase = baseUrl ?? currentUrl.origin + currentUrl.pathname

    // رشته‌ی کامل نهایی
    return `${finalBase}?${currentUrlParams.toString()}`
  }

  return { buildUrlWithParams }
}
