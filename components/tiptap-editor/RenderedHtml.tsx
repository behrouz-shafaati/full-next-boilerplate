import { renderTiptapJsonToHtml } from '@/lib/renderTiptapToHtml'
import parse, { Element } from 'html-react-parser'
import Image from 'next/image'
import Link from 'next/link'
import { AccordionRenderer } from './tiptap-renderers/AccordionRenderer'
import { AccordionNode, TNode } from './type'
import { getTranslation } from '@/lib/utils'

// تابع کمکی: جمع‌آوری همه‌ی نودهای accordion (ترتیب درختی)
function collectAccordions(node: TNode | undefined, out: TNode[] = []) {
  if (!node) return out
  if (node.type === 'accordion') out.push(node)
  if (node.content && node.content.length) {
    for (const child of node.content) collectAccordions(child, out)
  }
  return out
}

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
  // 1. JSON پارس شده (doc)
  const doc = JSON.parse(contentJson) as TNode

  // 2. همه آکاردئون‌ها را از JSON جمع می‌کنیم (ترتیب درخت)
  const accordions: AccordionNode = collectAccordions(doc) as AccordionNode

  // شمارنده برای نگه داشتن هم‌پوشانی HTML <-> JSON
  let accordionIndex = 0

  // 2. همه آکاردئون‌ها را از JSON جمع می‌کنیم (ترتیب درخت)
  // const fileIds: string[] = collectFileIds(doc)
  // const filesMap = await Promise.all(
  //   fileIds.map((id) => fileCtrl.findById({ id }))
  // ).then((results) => results.reduce((acc, f) => ({ ...acc, [f.id]: f }), {}))

  // 3. HTML تولید شده (سرور) — مثل قبل
  const html = renderTiptapJsonToHtml(doc)

  return (
    <div className="prose max-w-none">
      {parse(html, {
        replace(domNode) {
          // console.log('#324 domNode.name: ', domNode.name)
          if (domNode instanceof Element && domNode.name === 'img') {
            console.log('#2349867 domNode.attribs:', domNode.attribs)
            const { src, id: fileId, translations } = domNode.attribs
            if (!src) return null
            const translation = getTranslation({
              translations: JSON.parse(translations),
            })
            return (
              <figure className="relative w-full aspect-[2/1] my-4">
                <Image
                  src={src}
                  alt={translation?.alt || translation?.title || ''}
                  title={translation?.title || ''}
                  fill
                  className="object-contain rounded-lg"
                  unoptimized
                />
                {/* Caption */}
                {translation?.description && (
                  <div className=" flex flex-row justify-center absolute bottom-2 w-full  text-center text-white dark:text-gray-900 text-sm md:text-base font-medium ">
                    <figcaption className="bg-black/20 dark:bg-white/20 backdrop-blur-md w-fit px-4 py-3 rounded-xl">
                      {translation.description}
                    </figcaption>
                  </div>
                )}
              </figure>
            )
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

            // پاس دادن JSON به کامپوننت client-side امن است (serializable)
            return <AccordionRenderer node={accNode} />
          }
        },
      })}
    </div>
  )
}
