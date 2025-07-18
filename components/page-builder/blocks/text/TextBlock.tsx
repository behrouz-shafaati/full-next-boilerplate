// کامپوننت نمایشی بلاک

import React, { ElementType } from 'react'
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

  const tagMap: Record<string, ElementType> = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
    p: 'p',
    div: 'div',
    span: 'span',
    // هر تگ دیگه‌ای که بخوای اضافه کن
  }

  const Tag: ElementType = tagMap[settings.tag] || 'div'
  return (
    <Tag
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
    </Tag>
  )
}
