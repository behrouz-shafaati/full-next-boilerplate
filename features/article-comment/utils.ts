import { ArticleComment } from './interface'

export const commentsUrl = `/api/dashboard/comments`
export function buildCommentTree(
  comments: ArticleComment[],
  parentId: string | null = null
): ArticleComment[] {
  const commentsTree = comments
    .filter((c) => String(c.parent) === String(parentId))
    .map((c) => ({
      ...c,
      replies: buildCommentTree(comments, c.id),
    }))
  return commentsTree
}
