import { renderTiptapJsonToHtml } from '@/lib/renderTiptapToHtml'
import parse, { DOMNode, Element } from 'html-react-parser'
import Image from 'next/image'
import Link from 'next/link'
import { AccordionRenderer } from './tiptap-renderers/AccordionRenderer'
import { TNode } from './type'

// تابع کمکی: جمع‌آوری همه‌ی نودهای accordion (ترتیب درختی)
function collectAccordions(node: TNode | undefined, out: TNode[] = []) {
  if (!node) return out
  if (node.type === 'accordion') out.push(node)
  if (node.content && node.content.length) {
    for (const child of node.content) collectAccordions(child, out)
  }
  return out
}

type Props = {
  contentJson: string
}

export default function RenderedHtml({ contentJson }: Props) {
  // 1. JSON پارس شده (doc)
  const doc = JSON.parse(contentJson) as TNode

  // 2. همه آکاردئون‌ها را از JSON جمع می‌کنیم (ترتیب درخت)
  const accordions = collectAccordions(doc)

  // شمارنده برای نگه داشتن هم‌پوشانی HTML <-> JSON
  let accordionIndex = 0

  // 3. HTML تولید شده (سرور) — مثل قبل
  const html = renderTiptapJsonToHtml(doc)

  return (
    <div className="prose max-w-none">
      {parse(html, {
        replace(domNode) {
          console.log(
            '#234 domNode?.name: ',
            domNode?.name,
            " domNode.attribs?.['data-type']:",
            domNode.attribs?.['data-type']
          )
          if (domNode instanceof Element && domNode.name === 'img') {
            const { src, alt } = domNode.attribs
            return src ? (
              <div className="relative w-full aspect-[2/1] my-4">
                <Image
                  src={src}
                  alt={alt || ''}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            ) : null
          }

          if (domNode instanceof Element && domNode.name === 'a') {
            const href = domNode.attribs?.href

            if (!href) return null // ✅ اگر href نبود، چیزی رندر نکن

            return (
              <Link
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                {domNode.children?.[0]?.data || href}
              </Link>
            )
          }

          if (domNode instanceof Element && domNode.name === 'adSlot') {
            // const href = domNode.attribs?.href

            return <div></div>
          }

          // اگر توی renderTiptapJsonToHtml از div با data-type="accordion" استفاده کردی:
          if (
            domNode instanceof Element &&
            (domNode.attribs?.['data-type'] === 'accordion' ||
              domNode.name === 'accordion')
          ) {
            // می‌گیریم JSON متناظر را از آرایه‌ی قبلاً ساخته شده
            const accNode = accordions[accordionIndex++]

            console.log('#234 accNode:', accNode)
            // پاس دادن JSON به کامپوننت client-side امن است (serializable)
            return <AccordionRenderer node={accNode} />
          }
        },
      })}
    </div>
  )
}
