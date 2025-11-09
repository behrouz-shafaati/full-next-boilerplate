// کامپوننت نمایشی بلاک

import React from 'react'
import { Block } from '@/components/builder-canvas/types'
import { computedStyles } from '@/components/builder-canvas/utils/styleUtils'
import { PostContent } from '@/components/post/content'

type ContentBlockProps = {
  content: React.ReactNode
  blockData: {
    content: {
      content: string
    }
    type: 'content_post_content'
    settings: {}
  } & Block
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const ContentBlock = ({
  blockData,
  content,
  ...props
}: ContentBlockProps) => {
  const { settings } = blockData
  return (
    <PostContent
      style={{
        ...computedStyles(blockData.styles),
      }}
      {...props}
      content={content}
    />
  )
}
