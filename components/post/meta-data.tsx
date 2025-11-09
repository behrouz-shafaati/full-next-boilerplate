import { timeAgo } from '@/lib/utils'
import React from 'react'

type PostCoverProps = {
  createdAt: any
  author: { name: string }
  readingDuration: any
  styles?: any
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const PostMetaData = ({
  createdAt,
  author,
  readingDuration,
  styles = {},
  ...props
}: PostCoverProps) => {
  return (
    <div style={styles} {...props} className="text-sm text-gray-500 mb-4">
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
  )
}
