// کامپوننت نمایشی بلاک
import React, { Suspense } from 'react'
import { Block } from '../../types'
import { PostList } from './PostList'
import { Option } from '@/types'
import { getPosts } from '@/features/post/actions'
// import { PostListFallback } from './PostListFallback'
import { getCategoryAction } from '@/features/category/actions'
// import { getTagAction } from '@/features/tag/actions'

type PostListBlockProps = {
  widgetName: string
  blockData: {
    id: string
    type: 'postList'
    content: {
      usePageCategory: boolean
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
  pageSlug: string | null
  categorySlug: string | null
  searchParams?: any
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export default async function PostListBlock({
  widgetName,
  blockData,
  pageSlug,
  categorySlug,
  searchParams = {},
  ...props
}: PostListBlockProps) {
  const { content, settings } = blockData

  let filters = {}

  const categoryIds =
    content?.categories?.map((category: Option) => category.value) || {}
  if (content?.usePageCategory && categorySlug) {
    // logic to handle usePageCategory and categorySlug
    const category = await getCategoryAction({ slug: categorySlug })
    if (category) filters = { categories: [category.id], ...filters }
  } else {
    if (categoryIds?.length > 0)
      filters = { categories: categoryIds, ...filters }
  }

  const [result] = await Promise.all([
    getPosts({
      filters,
      pagination: { page: 1, perPage: settings?.countOfPosts || 6 },
    }),
  ])
  const posts = result.data
  const randomMap = posts.map(() => Math.random() < 0.1)
  if (posts.length == 0) return null
  return (
    <PostList
      posts={posts}
      blockData={blockData}
      pageSlug={pageSlug}
      categorySlug={categorySlug}
      randomMap={randomMap}
      searchParams={searchParams}
      filters={filters}
      {...props}
    />
  )
}
