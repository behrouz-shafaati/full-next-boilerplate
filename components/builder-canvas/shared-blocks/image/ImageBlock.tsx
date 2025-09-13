// کامپوننت نمایشی بلاک

import React from 'react'
import { Block } from '../../types'
import { computedStyles } from '../../utils/styleUtils'
import Image from 'next/image'
import Link from 'next/link'

type TextBlockProps = {
  widgetName: string
  blockData: {
    content: {
      title: string
      alt: string
      description: string
      src: string
      href: string
    }
    type: 'image'
    settings: {}
  } & Block
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const ImageBlock = ({
  widgetName,
  blockData,
  ...props
}: TextBlockProps) => {
  const { content, settings, styles } = blockData
  props.className = props?.className
    ? `${props?.className} w-full h-auto max-w-full`
    : 'w-full h-auto max-w-full'
  const imageElement = (
    <Image
      src={content?.src || '/assets/general-img-landscape.png'}
      alt={content?.alt || 'تصویر'}
      //   fill
      width={40}
      height={80}
      sizes="100vw"
      style={{
        objectFit: 'contain',
        ...computedStyles(styles),
      }}
      {...props}
      unoptimized
    />
  )

  return content?.href ? (
    <Link href={content.href} target="_blank" rel="noopener noreferrer">
      {imageElement}
    </Link>
  ) : (
    imageElement
  )
}
