import Image from 'next/image'
import Link from 'next/link'
import parse, { Element } from 'html-react-parser'
import { getTranslation, slugify } from '@/lib/utils'
import { AccordionRenderer } from '../tiptap-renderers/AccordionRenderer'
import { AccordionNode, TNode } from '../type'
import VideoEmbedRenderer from '../tiptap-renderers/VideoEmbedRenderer'

// تابع کمکی: جمع‌آوری همه‌ی نودهای accordion (ترتیب درختی)
function collectAccordions(node: TNode | undefined, out: TNode[] = []) {
  if (!node) return out
  if (node.type === 'accordion' || node.type === 'faq') out.push(node)
  if (node.content && node.content.length) {
    for (const child of node.content) collectAccordions(child, out)
  }
  return out
}

type Props = {
  contentJson: string
  HTML_string: string
}
export default function EnhanceHtmlForNext({
  contentJson,
  HTML_string,
}: Props) {
  // 1. JSON پارس شده (doc)
  const doc = JSON.parse(contentJson) as TNode

  // 2. همه آکاردئون‌ها را از JSON جمع می‌کنیم (ترتیب درخت)
  const accordions: AccordionNode = collectAccordions(doc) as AccordionNode
  // شمارنده برای نگه داشتن هم‌پوشانی HTML <-> JSON
  let accordionIndex = 0
  return (
    <div className="prose max-w-none">
      {parse(HTML_string, {
        replace(domNode) {
          console.log('#324 domNode.name: ', domNode.name)
          if (domNode instanceof Element && domNode.name === 'img') {
            const { src, id: fileId, translations, srclarge } = domNode.attribs
            if (!src) return null
            const translation = getTranslation({
              translations: JSON.parse(translations),
            })
            return (
              <figure className="relative w-full aspect-[2/1] rounded-3xl overflow-hidden my-4">
                <Image
                  src={src}
                  data-srclarge={srclarge || ''}
                  alt={translation?.alt || translation?.title || ''}
                  title={translation?.title || ''}
                  fill
                  className="object-cover "
                  quality={70}
                  sizes="(max-width: 640px) 100vw, 
           (max-width: 1024px) 80vw, 
           (max-width: 1536px) 1080px, 
           1920px"
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
                // className="text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                className="text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors object-cover"
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
              domNode.name === 'accordion' ||
              domNode.name === 'faq' ||
              domNode.attribs?.['data-type'] === 'faq')
          ) {
            // می‌گیریم JSON متناظر را از آرایه‌ی قبلاً ساخته شده
            const accNode = accordions[accordionIndex++]

            // پاس دادن JSON به کامپوننت client-side امن است (serializable)
            return <AccordionRenderer node={accNode} />
          }

          // اگر توی renderTiptapJsonToHtml از div با data-type="videoEmbed" استفاده کردی:
          if (
            domNode instanceof Element &&
            (domNode.attribs?.['data-type'] === 'videoEmbed' ||
              domNode.name === 'videoEmbed')
          ) {
            // پاس دادن JSON به کامپوننت client-side امن است (serializable)
            return <VideoEmbedRenderer node={domNode} />
          }
          // برای اینک عنوان های ایدی بگیرن و بشه از فهرست مقالات بهشون دسترسی داشت
          if (
            domNode instanceof Element &&
            ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(domNode.name)
          ) {
            const text = domNode.children?.[0]?.data
            const id = slugify(text)
            const Tag = `${domNode.name}` as keyof JSX.IntrinsicElements

            return (
              <Tag
                key={id}
                id={id}
                dir={domNode.attribs.dir}
                style={{
                  textAlign: domNode.attribs.textAlign,
                  scrollMarginTop: '80px',
                }}
              >
                {text}
              </Tag>
            )
          }
        },
      })}
    </div>
  )
}
