// کامپوننت نمایشی بلاک

import React, { ElementType } from 'react'
import { Block } from '@/components/builder-canvas/types'
import {
  combineClassNames,
  computedStyles,
} from '@/components/builder-canvas/utils/styleUtils'
import Image from 'next/image'
import { getTranslation } from '@/lib/utils'
import { ImageAlba } from '@/components/image-alba'

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
  const { settings } = blockData
  return image ? (
    <ImageAlba
      file={image}
      showCaption={false}
      style={{
        ...computedStyles(blockData.styles),
      }}
      {...props}
    />
  ) : (
    <></>
  )
}
