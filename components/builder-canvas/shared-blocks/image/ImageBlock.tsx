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
  console.log('33987 ------------- styles image:', styles)
  props.className = props?.className
    ? `${props?.className} w-full h-auto max-w-full`
    : 'w-full h-auto max-w-full'
  const { width = '', height = '', ...restStyle } = styles || {}
  const { className = '', ...restProps } = props || {}

  const imageElement = (
    <div
      data-image-wrapper
      className={`relative  ${className}`}
      {...restProps}
      style={{
        ...computedStyles({ width, height }),
      }}
    >
      <Image
        src={content?.srcSmall || '/assets/general-img-landscape.png'}
        sizes="(max-width: 640px) 640px, (max-width: 768px) 768px, 1280px"
        alt={content?.alt || 'تصویر'}
        fill
        // {...(!width || !height
        //   ? { fill: true }
        //   : {
        //       width: Number(width),
        //       height: Number(height),
        //     })}
        style={{
          ...computedStyles(restStyle),
        }}
        className="object-cover w-full h-full"
      />
    </div>
  )

  return content?.href ? (
    <Link href={content.href} target="_blank" rel="noopener noreferrer">
      {imageElement}
    </Link>
  ) : (
    imageElement
  )
}
