// کامپوننت نمایشی بلاک
import React, { Suspense } from 'react'
import { Block } from '../../types'
import { PostList } from './PostList'
import { Option } from '@/types'
import { getPosts } from '@/features/post/actions'
import { PostListFallback } from './PostListFallback'

type PostListBlockProps = {
  widgetName: string
  blockData: {
    id: string
    type: 'postList'
    content: {
      tags: Option[]
      categories: Option[]
    }
    settings: {
      design: 'simple' | 'parallax'
      showArrows: boolean
      loop: boolean
      autoplay: boolean
      autoplayDelay: number
    }
  } & Block
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export default async function PostListBlock({
  widgetName,
  blockData,
  ...props
}: PostListBlockProps) {
  const { content, settings } = blockData
  const tagIds = content?.tags?.map((tag: Option) => tag.value)
  const categoryIds = content?.categories?.map((tag: Option) => tag.value) || {}
  let filters
  if (settings?.showNewest == true || tagIds?.length == 0) {
    filters = {}
  } else if (tagIds?.length > 0) {
    filters = { tags: tagIds[0] }
  }

  if (categoryIds?.length > 0) filters = { categories: categoryIds, ...filters }

  const [result] = await Promise.all([
    getPosts({
      filters,
      pagination: { page: 1, perPage: settings?.countOfPosts || 6 },
    }),
  ])
  const posts = result.data

  return (
    <Suspense
      fallback={
        <PostListFallback posts={posts} blockData={blockData} {...props} />
      }
    >
      <PostList posts={posts} blockData={blockData} {...props} />
    </Suspense>
  )
}
