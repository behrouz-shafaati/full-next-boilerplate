// کامپوننت نمایشی بلاک
import React, { Suspense } from 'react'
import { Block } from '../../types'
import { PostList } from './PostList'
import { Option } from '@/types'
import { getPosts } from '@/features/post/actions'
// import { PostListFallback } from './PostListFallback'
import { getCategoryAction } from '@/features/category/actions'

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
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export default async function PostListBlock({
  widgetName,
  blockData,
  pageSlug,
  categorySlug,
  ...props
}: PostListBlockProps) {
  console.log('PostListBlock rendered')
  const { content, settings } = blockData
  const tagIds = content?.tags?.map((tag: Option) => tag.value)
  const categoryIds =
    content?.categories?.map((category: Option) => category.value) || {}
  let filters
  if (settings?.showNewest == true || tagIds?.length == 0) {
    filters = {}
  } else if (tagIds?.length > 0) {
    filters = { tags: tagIds[0] }
  }

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
      {...props}
    />
  )

  // مدل زیر باعث تغیر در جایگاه نمایش کارت عمودی میشود. این جایگاه به صورت شانسی انتخاب میشود و موجب کاهش پرفورمنس میشود
  // return (
  //   <Suspense
  //     fallback={
  //       <PostListFallback posts={posts} blockData={blockData} {...props} />
  //     }
  //   >
  //     <PostList
  //       posts={posts}
  //       blockData={blockData}
  //       pageSlug={pageSlug}
  //       categorySlug={categorySlug}
  //       {...props}
  //     />
  //   </Suspense>
  // )
}
