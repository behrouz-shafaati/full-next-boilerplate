const bcrypt = require('bcryptjs')
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export const haveAccess = (
  roles: string[] = [],
  AuthorizedRoles: string[] = []
) => {
  // console.log('#6345 roles in have access:', roles);
  if (AuthorizedRoles.length == 0) return true
  const isSuperAdmin = roles.includes('super_admin')
  // console.log('#6345 isSuperAdmin flg:', isSuperAdmin);
  if (isSuperAdmin) return true
  return !!roles.some((element) => AuthorizedRoles.includes(element))
}

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages]
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages]
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ]
}

export const createCatrgoryBreadcrumb = (
  category: any,
  title: string,
  locale: string = 'fa'
): string => {
  if (category?.parent) {
    const translation: any =
      category.parent?.translations?.find((t: any) => t.lang === locale) ||
      category.parent?.translations[0] ||
      {}
    title = `${translation?.title} > ${title}`
    return createCatrgoryBreadcrumb(category.parent, title)
  }
  return title
}

/**
 * تبدیل عنوان به اسلاگ خوانا
 */
const arabicDiacriticsRegex = /[\u064B-\u0652]/g // اعراب عربی و فارسی مثل ً ُ ِ ّ

export function slugify(title: string): string {
  return title
    .normalize('NFC') // نرمال‌سازی حروف فارسی/عربی
    .replace(arabicDiacriticsRegex, '') // حذف اعراب
    .replace(/[^\w\u0600-\u06FF\s-]/g, '') // حذف کاراکترهای غیرحرفی (غیراز حروف فارسی و عدد و فاصله)
    .replace(/\s+/g, '-') // فاصله به خط تیره
    .replace(/-+/g, '-') // چند خط تیره → یکی
    .replace(/^-+|-+$/g, '') // حذف خط تیره‌ی اول و آخر
    .toLowerCase()
}

type Filters = Record<string, string[]>

/**
 * @param filtersArray از params.catchAll یا params.filters میاد
 * @returns فیلترها به صورت آبجکت
 */
export function extractFiltersFromParams(filtersArray: string[] = []): Filters {
  const filters: Filters = {}

  for (let i = 0; i < filtersArray.length; i += 2) {
    const key = filtersArray[i]
    const rawValue = filtersArray[i + 1]

    if (key && rawValue) {
      const decoded = decodeURIComponent(rawValue)
      filters[key] = decoded.split(',').filter(Boolean)
    }
  }

  return filters
}

export function buildUrlFromFilters(filters: Filters): string {
  const parts: string[] = []

  for (const key in filters) {
    const value = filters[key]
    if (value?.length > 0) {
      parts.push(`${key}/${value.join(',')}`)
    }
  }

  return `${parts.join('/')}`
}

export function getTemplateFor(templateFor: string): string {
  if (!templateFor) return 'allPages'
  const parts = templateFor[0].split('-')
  return parts[0] || templateFor
}

//************************************* Multi language function *****************************************/
// اگر بخوای زبان‌های مجاز رو محدود کنی:
export const SUPPORTED_LANGUAGE = ['fa', 'en'] as const
type Locale = (typeof SUPPORTED_LANGUAGE)[number]

export function pickLocale(paramsLang?: string): Locale {
  const cand = paramsLang
  return (SUPPORTED_LANGUAGE as readonly string[]).includes(cand ?? '')
    ? (cand as Locale)
    : 'fa'
}
//******************************************************************************/
