// کامپوننت نمایشی بلاک

import React, { ElementType } from 'react'
import { Block } from '@/components/builder-canvas/types'
import {
  combineClassNames,
  computedStyles,
} from '@/components/builder-canvas/utils/styleUtils'
import Image from 'next/image'
import { getTranslation } from '@/lib/utils'

type ContentBlockProps = {
  content: React.ReactNode
  blockData: {
    content: {
      content: string
    }
    type: 'content_article_title'
    settings: {}
  } & Block
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const ContentBlock = ({
  blockData,
  content: image,
  ...props
}: ContentBlockProps) => {
  const locale = 'fa'
  let imageCoverTranslation = {}
  if (image)
    imageCoverTranslation = getTranslation({
      translations: image?.translations,
    })
  const { settings } = blockData
  return image ? (
    <div
      style={{
        ...computedStyles(blockData.styles),
      }}
      {...props}
      className="relative w-full aspect-[2/1] rounded-3xl overflow-hidden my-4"
    >
      <Image
        src={image.srcSmall}
        sizes="(max-width: 640px) 640px, (max-width: 768px) 768px, 1280px"
        alt={imageCoverTranslation?.alt}
        title={imageCoverTranslation?.title}
        fill
        // className="object-contain"
        className="object-cover"
        priority
        quality={70}
      />
    </div>
  ) : (
    <></>
  )
}
