const jalaali = require('jalaali-js')
import readingTime from 'reading-time'
import { Category } from '../category/interface'
import { Post, PostTranslationSchema } from './interface'
import { FileDetails } from '@/lib/entity/file/interface'

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
  return msToMinutes(stats.time)
}

function msToMinutes(ms: number): number {
  return Math.ceil(ms / 60000)
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

export function updateFileDetailsInContentJson({
  post,
  fileDetails,
}: {
  post: Post
  fileDetails: FileDetails
}): Post {
  const translation = post.translations.find(
    (t) => t.lang == fileDetails.locale
  )
  const parsedContent = JSON.parse(translation.contentJson)
  const content = parsedContent?.content || []
  const contentJsonSetedFileData = content.map((block: any) => {
    if (block.type === 'image') {
      const image = block.attrs
      if (fileDetails.id == image.id)
        return { type: 'image', attrs: fileDetails }
    }
    return block
  })
  const updatedContentJson = {
    type: 'doc',
    content: contentJsonSetedFileData,
  }
  const newTranslations = post.translations.filter(
    (t) => t.lang != fileDetails.locale
  )
  return {
    ...post,
    translations: [
      ...newTranslations,
      { ...translation, contentJson: JSON.stringify(updatedContentJson) },
    ],
  }
}
