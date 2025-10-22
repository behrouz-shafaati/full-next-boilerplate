import { renderTiptapJsonToHtml } from '@/lib/renderTiptapToHtml'
import { TNode } from '../type'
import EnhanceHtmlForNext from './EnhanceHtmlForNext'
import { getSettings } from '@/features/settings/controller'

// تابع کمکی: جمع‌آوری همه‌ی نودهای accordion (ترتیب درختی)
// function collectFileIds(node: TNode | undefined, out: string[] = []): string[] {
//   if (!node) return out
//   if (node.type === 'image') out.push(node.attrs.id)
//   if (node.content && node.content.length) {
//     for (const child of node.content) collectFileIds(child, out)
//   }
//   return out
// }

type Props = {
  contentJson: string
}

export default async function RenderedHtml({ contentJson }: Props) {
  const [siteSettings] = await Promise.all([getSettings()])
  // 1. JSON پارس شده (doc)
  const doc = JSON.parse(contentJson) as TNode

  // 3. HTML تولید شده (سرور) — مثل قبل
  const html = renderTiptapJsonToHtml(doc)
  return (
    <EnhanceHtmlForNext
      siteSettings={siteSettings}
      HTML_string={html}
      contentJson={contentJson}
    />
  )
}
