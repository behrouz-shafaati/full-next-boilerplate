// components/comments/CommentItem.tsx
'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Reply, CheckCircle, XCircle, Trash } from 'lucide-react'
import { useActionState, useEffect, useState, useTransition } from 'react'
import { ArticleComment } from '../../interface'
import { getTranslation, timeAgo } from '@/lib/utils'
import { useArticleCommentStore } from '../store/useArticleCommentStore'
import { CommentForm } from '../comment-form'
import {
  deleteArticleCommentAction,
  updateStatusArticleComment,
} from '../../actions'
import { mutate } from 'swr'
import { useUpdatedUrl } from '@/hooks/use-updated-url'
import { commentsUrl } from '../../utils'

interface CommentItemProps {
  articleComment: ArticleComment
  depth?: number
}
export function ArticleCommentItemManage({
  articleComment,
  depth = 0,
}: CommentItemProps) {
  const { buildUrlWithParams } = useUpdatedUrl()
  const [showReplayForm, setShowReplayForm] = useState(false)
  const [showReplies, setShowReplies] = useState(true)
  const { replayTo, setReplayTo } = useArticleCommentStore()
  const content = getTranslation({
    translations: articleComment.translations,
    locale: articleComment.locale,
  })
  const initialState = {
    message: null,
    errors: {},
    success: true,
  }
  const [isPending, startTransition] = useTransition()
  const [state, dispatch] = useActionState(
    updateStatusArticleComment.bind(null, String(articleComment.id)) as any,
    initialState
  )

  useEffect(() => {
    if (!isPending) mutate(buildUrlWithParams(commentsUrl))
  }, [isPending])

  return (
    <div className={`mt-4 ${depth > 0 ? 'ml-10 border-r pr-4' : ''}`}>
      <div className="flex gap-3">
        <Avatar>
          <AvatarImage src={articleComment.author?.image?.src || ''} />
          <AvatarFallback>
            {articleComment.author?.name[0] || '?'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold">
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
            <Button
              size="sm"
              variant="ghost"
              className="flex gap-1"
              onClick={() =>
                startTransition(async () => {
                  try {
                    dispatch({ status: 'approved' })
                  } catch (err) {
                    console.log('#776234 Error: ', err)
                  }
                })
              }
            >
              <CheckCircle size={16} /> پذیرفتن
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="flex gap-1"
              onClick={() =>
                startTransition(async () => {
                  try {
                    await dispatch({ status: 'rejected' })
                    mutate()
                  } catch (err) {
                    console.log('#776234 Error: ', err)
                  }
                })
              }
            >
              <XCircle size={16} /> نپذیرفتن
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="flex gap-1"
              onClick={() =>
                startTransition(async () => {
                  try {
                    await deleteArticleCommentAction([articleComment.id])
                    mutate()
                  } catch (err) {
                    console.log('#776234 Error: ', err)
                  }
                })
              }
            >
              <Trash size={16} /> حذف
            </Button>
          </div>
        </div>
      </div>

      {/* {showReplies && articleComment.replies?.length > 0 && (
        <div className="mt-3">
          {articleComment.replies.map((reply, idx) => (
            <ArticleCommentItemManage
              key={`${reply._id}_${idx}`}
              articleComment={reply}
              depth={depth + 1}
            />
          ))}
        </div>
      )} */}
      {replayTo?.id == articleComment.id && (
        <div className="mt-2">
          <CommentForm initialData={articleComment.article} />
        </div>
      )}
    </div>
  )
}
