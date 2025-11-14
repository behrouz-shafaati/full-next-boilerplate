import { timeAgo } from '@/lib/utils'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import Link from 'next/link'

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
      <div className="flex gap-2">
        <div>
          <Avatar>
            <AvatarImage src={author?.image?.srcSmall || ''} />
            <AvatarFallback>{author?.name[0] || '?'}</AvatarFallback>
          </Avatar>
        </div>
        <div className="text-xs  flex flex-col justify-between">
          <Link href={`/author/${author?.userName}`} className="flex gap-4">
            <span>{author?.name}</span>
          </Link>
          <span className="font-thin">
            خواندن {readingDuration} دقیقه . {timeAgo(createdAt)}
          </span>
        </div>
      </div>
    </div>
  )
}
