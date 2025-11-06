// کامپوننت نمایشی بلاک

import React from 'react'
import { Block } from '@/components/builder-canvas/types'
import { computedStyles } from '@/components/builder-canvas/utils/styleUtils'
import { timeAgo } from '@/lib/utils'
import { User } from '@/features/user/interface'

type ContentBlockProps = {
  content: { author: User; createdAt: string; readingDuration: number }
  blockData: {
    content: {
      content: string
    }
    type: 'content_post_metadata'
    settings: {}
  } & Block
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const ContentBlock = ({
  blockData,
  content,
  ...props
}: ContentBlockProps) => {
  const locale = 'fa'
  const { author, createdAt, readingDuration } = content
  const { settings } = blockData
  return content ? (
    <div
      style={{
        ...computedStyles(blockData.styles),
      }}
      {...props}
      className="text-sm text-gray-500 mb-4"
    >
      {author && (
        <>
          <span>نویسنده: {author.name}</span>
          <span className="mx-2">|</span>
        </>
      )}
      <span>{timeAgo(createdAt)}</span>
      <span className="mx-2">|</span>
      <span>زمان مطالعه: {readingDuration}</span>
    </div>
  ) : (
    <></>
  )
}
