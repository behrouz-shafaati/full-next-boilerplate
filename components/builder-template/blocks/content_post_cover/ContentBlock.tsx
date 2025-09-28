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
    type: 'content_post_title'
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
        src={image?.src}
        alt={imageCoverTranslation?.alt}
        title={imageCoverTranslation?.title}
        fill
        // className="object-contain"
        className="object-cover"
        priority
        quality={70}
        sizes="(max-width: 640px) 100vw, 
             (max-width: 1024px) 80vw, 
             (max-width: 1536px) 1080px, 
             1920px"
      />
    </div>
  ) : (
    <></>
  )
}
