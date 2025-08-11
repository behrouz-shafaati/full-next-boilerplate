// کامپوننت نمایشی بلاک
import React from 'react'
import { PageBlock } from '../../types'
import { BlogPostSlider } from './BlogPostSlider'
import { Option } from '@/types'
import { getPosts } from '@/features/post/actions'

type BlogPostSliderBlockProps = {
  blockData: {
    id: string
    type: 'blogPostSlider'
    content: {
      tags: Option[]
      categories: Option[]
    }
    settings: {
      showArrows: boolean
      loop: boolean
      autoplay: boolean
      autoplayDelay: number
    }
  } & PageBlock
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export default async function BlogPostSliderBlock({
  blockData,
  ...props
}: BlogPostSliderBlockProps) {
  const { content } = blockData
  const tagIds = content?.tags?.map((tag: Option) => tag.value)
  const categoryIds = content?.categories?.map((tag: Option) => tag.value)
  const [result] = await Promise.all([
    getPosts({
      filters: { categories: categoryIds, tags: tagIds },
    }),
  ])
  const posts = result.data
  return <BlogPostSlider posts={posts} blockData={blockData} {...props} />
}
