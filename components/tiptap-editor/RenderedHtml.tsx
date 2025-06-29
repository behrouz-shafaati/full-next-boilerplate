import { renderTiptapJsonToHtml } from '@/lib/renderTiptapToHtml'
import parse, { DOMNode, Element } from 'html-react-parser'
import Image from 'next/image'
import Link from 'next/link'

type Props = {
  contentJson: string
}

export default function RenderedHtml({ contentJson }: Props) {
  const html = renderTiptapJsonToHtml(JSON.parse(contentJson))

  return (
    <div className="prose max-w-none">
      {parse(html, {
        replace(domNode) {
          if (domNode instanceof Element && domNode.name === 'img') {
            const { src, alt } = domNode.attribs
            return src ? (
              <div className="relative w-full aspect-[2/1] my-4">
                <Image
                  src={src}
                  alt={alt || ''}
                  fill
                  className="object-contain"
                />
              </div>
            ) : null
          }

          if (domNode instanceof Element && domNode.name === 'a') {
            const href = domNode.attribs?.href

            if (!href) return null // ✅ اگر href نبود، چیزی رندر نکن

            return (
              <Link href={href} target="_blank" rel="noopener noreferrer">
                {domNode.children?.[0]?.data || href}
              </Link>
            )
          }
        },
      })}
    </div>
  )
}
