// کامپوننت نمایشی بلاک

import React from 'react'
import { PageBlock } from '../../types'
import { computedStyles } from '../../utils/styleUtils'

type TextBlockProps = {
  blockData: {
    content: {
      text: string
    }
    type: 'text'
    settings: {
      fontSize?: string
      fontWeight?: string
      textAlign?: 'left' | 'right' | 'center' | 'justify'
      color?: string
      text?: string
    }
  } & PageBlock
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const TextBlock = ({ blockData, ...props }: TextBlockProps) => {
  const { content, settings } = blockData

  return (
    <p
      style={{
        fontSize: settings.fontSize || '16px',
        fontWeight: settings.fontWeight || 'normal',
        textAlign: settings.textAlign || 'left',
        color: settings.color || '#000',
        ...computedStyles(blockData.styles),
      }}
      {...props}
    >
      {content.text || 'متن پیش‌فرض'}
    </p>
  )
}
