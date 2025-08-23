// کامپوننت نمایشی بلاک

import React, { ElementType } from 'react'
import { Block } from '@/components/builder-canvas/types'
import {
  combineClassNames,
  computedStyles,
} from '@/components/builder-canvas/utils/styleUtils'

type ContentBlockProps = {
  blockData: {
    content: {
      content: string
    }
    type: 'content'
    settings: {}
  } & Block
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const ContentBlock = ({ blockData, ...props }: ContentBlockProps) => {
  const { content, settings } = blockData

  return (
    <div
      style={{
        ...computedStyles(blockData.styles),
      }}
      {...props}
    >
      محتوا
    </div>
  )
}
