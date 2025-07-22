import { slugify } from '@/lib/utils'
import postCtrl from './controller'
const jalaali = require('jalaali-js')
import readingTime from 'reading-time'

/**
 * تولید اسلاگ یکتا با بررسی دیتابیس
 */
export async function generateUniquePostSlug(
  params: { slug: string; title: string },
  postId: string = ''
): Promise<object> {
  console.log('#237s8 params: ', params)
  const baseSlug =
    params.slug != '' && params.slug != null
      ? slugify(params.slug)
      : slugify(params.title)
  console.log('#237s8 baseSlug: ', baseSlug)
  // if it is update and slug doesn't change remove slug from parameters
  if (postId !== '') {
    const findedPostBySlug = await postCtrl.findOne({
      filters: { slug: baseSlug },
    })
    if (findedPostBySlug && findedPostBySlug.id == postId) {
      const { slug, ...rest } = params
      return rest
    }
  }

  // if it is new post need to generate new slug
  let slug = baseSlug
  let count = 1
  while (await postCtrl.existSlug(slug)) {
    slug = `${baseSlug}-${count}`
    count++
  }

  return { ...params, slug }
}

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

export function getReadingTime(text: string): string {
  const stats = readingTime(text)
  console.log('#00 99 stats: ', stats)
  return stats.text // مثل "3 دقیقه"
}
