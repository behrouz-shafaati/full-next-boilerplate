const jalaali = require('jalaali-js')
import readingTime from 'reading-time'
import { Category } from '../category/interface'
import { Post } from './interface'

/**
 * تولید اسلاگ یکتا با بررسی دیتابیس
 */

export function generateExcerpt(content: string, wordCount = 20): string {
  return content.split(' ').slice(0, wordCount).join(' ') + '...'
}

export function extractExcerptFromContentJson(
  contentJson: string,
  wordCount = 20
): string {
  try {
    const content = JSON.parse(contentJson)

    if (!content || !Array.isArray(content.content)) return ''

    // بازگشتی متن‌ها رو از همه‌ی نودها می‌کشه بیرون
    function extractText(nodes: any[]): string[] {
      let texts: string[] = []

      for (const node of nodes) {
        if (node.type === 'text' && node.text) {
          texts.push(node.text)
        }
        if (Array.isArray(node.content)) {
          texts = texts.concat(extractText(node.content))
        }
      }

      return texts
    }

    const allTexts = extractText(content.content)
    const fullText = allTexts.join(' ').trim()
    const words = fullText.split(/\s+/).slice(0, wordCount).join(' ')

    return words + (fullText.split(/\s+/).length > wordCount ? '...' : '')
  } catch (err) {
    console.error('خطا در پردازش contentJson:', err)
    return ''
  }
}

export function formatToJalali(dateString: string): string {
  const date = new Date(dateString)
  const { jy, jm, jd } = jalaali.toJalaali(date)
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${jy}/${pad(jm)}/${pad(jd)}`
}

export function getReadingTime(text: string): number {
  const stats = readingTime(text)
  console.log('#00 99 stats: ', stats)
  return msToMinutes(stats.time)
}

function msToMinutes(ms: number): number {
  return Math.ceil(ms / 60000)
}

export function timeAgo(createdAt: string): string {
  const now = new Date()
  const past = new Date(createdAt)
  const diffMs = now.getTime() - past.getTime()

  if (diffMs < 0) return 'در آینده است!'

  const minutes = Math.floor(diffMs / 60000)
  const hours = Math.floor(diffMs / 3600000)
  const days = Math.floor(diffMs / 86400000)
  const months = Math.floor(diffMs / (30 * 86400000))
  const years = Math.floor(diffMs / (365 * 86400000))

  if (minutes < 60) {
    return `${minutes} دقیقه قبل`
  } else if (hours < 24) {
    return `${hours} ساعت قبل`
  } else if (days < 30) {
    return `${days} روز قبل`
  } else if (months < 12) {
    return `${months} ماه قبل`
  } else {
    // اگر چند سال و چند ماه گذشته باشد
    const remainingMonths = months % 12
    if (remainingMonths === 0) {
      return `${years} سال قبل`
    } else {
      return `${years} سال و ${remainingMonths} ماه قبل`
    }
  }
}

export function createPostHref(post: Post) {
  const categorySection: string = buildCategoryHref(
    post.mainCategory as Category
  )
  return `/${categorySection}${post.slug}`
}

export function buildCategoryHref(category: Category, href: string = '') {
  if (!category) return href
  return buildCategoryHref(
    category?.parent,
    (href = `${category.slug}/${href}`)
  )
}
