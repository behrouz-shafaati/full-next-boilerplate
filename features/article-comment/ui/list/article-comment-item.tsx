// components/comments/CommentItem.tsx
'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { MessageSquare, ThumbsUp, ThumbsDown, Reply } from 'lucide-react'
import { useState } from 'react'
import { ArticleComment } from '../../interface'
import { getTranslation, timeAgo } from '@/lib/utils'
import { useArticleCommentStore } from '../store/useArticleCommentStore'

interface CommentItemProps {
  articleComment: ArticleComment
  depth?: number
}

export function ArticleCommentItem({
  articleComment,
  depth = 0,
}: CommentItemProps) {
  const [showReplies, setShowReplies] = useState(true)
  const { setReplayTo } = useArticleCommentStore()
  const content = getTranslation({
    translations: articleComment.translations,
    locale: articleComment.locale,
  })

  return (
    <div className={`mt-4 ${depth > 0 ? 'ml-10 border-r pr-4' : ''}`}>
      <div className="flex gap-3">
        <Avatar>
          <AvatarImage src={articleComment.author?.image?.srcSmall || ''} />
          <AvatarFallback>
            {articleComment.author?.name[0] || '?'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">
              {articleComment.author?.name || 'ناشناس'}
            </span>
            <span className="text-sm text-gray-500">
              {timeAgo(articleComment.createdAt)}
            </span>
          </div>
          <div
            className="mt-1 text-gray-700 dark:text-gray-200"
            dangerouslySetInnerHTML={{ __html: content.contentJson }}
          />

          <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
            {/* <Button size="sm" variant="ghost" className="flex gap-1">
              <ThumbsUp size={16} /> 23
            </Button>
            <Button size="sm" variant="ghost" className="flex gap-1">
              <ThumbsDown size={16} /> 5
            </Button> */}
            <Button
              size="sm"
              variant="ghost"
              className="flex gap-1"
              onClick={() => setReplayTo(articleComment)}
            >
              <Reply size={16} /> پاسخ
            </Button>
          </div>
        </div>
      </div>

      {showReplies && articleComment.replies?.length > 0 && (
        <div className="mt-3">
          {articleComment.replies.map((reply, idx) => (
            <ArticleCommentItem
              key={`${reply._id}_${idx}`}
              articleComment={reply}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
