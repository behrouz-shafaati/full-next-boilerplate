const jalaali = require('jalaali-js')
import readingTime from 'reading-time'
import { Category } from '../category/interface'
import { Article, ArticleTranslationSchema } from './interface'
import { FileDetails } from '@/lib/entity/file/interface'
import { addIfExists, getTranslation } from '@/lib/utils'

export const articleUrl = 'api/dashboard/articles'

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

export function createArticleHref(article: Article) {
  const categorySection: string = buildCategoryHref(
    article.mainCategory as Category
  )
  return `/${categorySection}${article.slug}`
}

export function buildCategoryHref(category: Category, href: string = '') {
  if (!category) return href
  return buildCategoryHref(
    category?.parent,
    (href = `${category.slug}/${href}`)
  )
}

export function updateFileDetailsInContentJson({
  article,
  fileDetails,
}: {
  article: Article
  fileDetails: FileDetails
}): Article {
  const translation = article.translations.find(
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
  const newTranslations = article.translations.filter(
    (t) => t.lang != fileDetails.locale
  )
  return {
    ...article,
    translations: [
      ...newTranslations,
      { ...translation, contentJson: JSON.stringify(updatedContentJson) },
    ],
  }
}

/**
 * Generate JSON-LD schema.org data for a blog article.
 *
 * This function builds an `Article` structured data object
 * based on the given article and locale. It is intended to be used
 * for SEO and rich results in search engines.
 *
 * @param {Object} params
 * @param {Article} params.article - The article document fetched from the database.
 * @param {string} [params.locale='fa'] - Desired locale for selecting the correct translation.
 *
 * @returns {Record<string, any>} A JSON-LD compliant object ready to be injected
 *                                into a <script type="application/ld+json"> tag.
 *
 * @example
 * const schema = generateArticleSchemaData({ article, locale: 'en' });
 * <script
 *   type="application/ld+json"
 *   dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
 * />
 */
export function generateArticleSchema({
  article,
  locale = 'fa',
}: {
  article: Article
  locale?: string
}) {
  // Get translation based on locale or fallback
  const translation = getTranslation({
    translations: article.translations,
    locale,
  })

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Article',

    ...addIfExists('headline', translation?.title),
    ...addIfExists('description', translation?.excerpt),

    author: article?.user?.name
      ? {
          '@type': 'Person',
          name: article.user.name,
        }
      : undefined,

    ...addIfExists('image', article?.image?.src),

    ...addIfExists(
      'datePublished',
      article.createdAt ? new Date(article.createdAt).toISOString() : undefined
    ),
    ...addIfExists(
      'dateModified',
      article.updatedAt ? new Date(article.updatedAt).toISOString() : undefined
    ),
  }

  return schemaData
}

/**
 * Generate FAQPage JSON-LD schema from Tiptap JSON content.
 *
 * It expects a Tiptap document that contains a node of type "faq"
 * with children "accordionItem" which each have
 * "accordionItemTitle" and "accordionItemContent".
 *
 * @param {any} doc - Tiptap JSON document (usually translation.content)
 * @returns {Record<string, any> | null} FAQPage schema or null if no valid FAQ found.
 *
 * @example
 * const faqSchema = generateFAQSchema(tiptapDoc)
 * if (faqSchema) {
 *   <script
 *     type="application/ld+json"
 *     dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
 *   />
 * }
 */
export function generateFAQSchema(doc: any) {
  doc = JSON.parse(doc)
  if (!doc || !Array.isArray(doc.content)) return null

  // Find the top-level node with type "faq"
  const faqNode = doc.content.find((node) => node.type === 'faq')
  if (!faqNode || !Array.isArray(faqNode.content)) return null

  const faqs = faqNode.content
    .map((item) => {
      if (item.type !== 'accordionItem' || !Array.isArray(item.content)) {
        return null
      }

      // Extract question text
      const titleNode = item.content.find(
        (c) => c.type === 'accordionItemTitle'
      )
      const questionText = extractPlainText(titleNode)

      // Extract answer text
      const answerNode = item.content.find(
        (c) => c.type === 'accordionItemContent'
      )
      const answerText = extractPlainText(answerNode)

      if (!questionText || !answerText) return null

      return {
        '@type': 'Question',
        name: questionText,
        acceptedAnswer: {
          '@type': 'Answer',
          text: answerText,
        },
      }
    })
    .filter(Boolean)

  if (faqs.length === 0) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs,
  }
}

/**
 * Recursively extract plain text from a Tiptap node.
 * Handles nested content like paragraphs or text nodes.
 *
 * @param {any} node - A Tiptap node (or null)
 * @returns {string} Extracted text content.
 */
function extractPlainText(node: any): string {
  if (!node) return ''

  if (node.type === 'text' && node.text) {
    return node.text
  }

  if (Array.isArray(node.content)) {
    return node.content.map(extractPlainText).join(' ').trim()
  }

  return ''
}
