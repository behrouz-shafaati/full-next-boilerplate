'use client'
import { QueryResponse } from '@/lib/entity/core/interface'
import { ArticleComment } from '../../interface'
import { Article } from '@/features/article/interface'
import { ArticleCommentItem } from './article-comment-item'
import { useCustomSWR } from '@/hooks/use-custom-swr'

interface ArticleCommentTableProps {
  article: Article
  articleCommentsResult: QueryResponse<ArticleComment>
}

export default function ArticleCommentList({
  article,
  articleCommentsResult,
}: ArticleCommentTableProps) {
  const initialArticleComments = articleCommentsResult
  const comments = articleCommentsResult.data
  const { data: articleComments, isLoading } = useCustomSWR({
    url: `/api/comments?article=${article.id}`,
    initialData: initialArticleComments,
  })
  return (
    <>
      <div className="">
        {(articleComments.data ?? []).map((articleComment: ArticleComment) => {
          return (
            <ArticleCommentItem
              key={articleComment.id}
              articleComment={articleComment}
            />
          )
        })}
      </div>
    </>
  )
}
