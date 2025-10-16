// کامپوننت نمایشی بلاک
import React from 'react'
import { Block } from '../../types'
import { BlogArticleSlider } from './BlogArticleSlider'
import { Option } from '@/types'
import { getArticles } from '@/features/article/actions'

type BlogArticleSliderBlockProps = {
  widgetName: string
  blockData: {
    id: string
    type: 'blogArticleSlider'
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

export default async function BlogArticleSliderBlock({
  widgetName,
  blockData,
  ...props
}: BlogArticleSliderBlockProps) {
  const { content } = blockData
  const tagIds = content?.tags?.map((tag: Option) => tag.value)
  const categoryIds = content?.categories?.map((tag: Option) => tag.value)
  const [result] = await Promise.all([
    getArticles({
      filters: { categories: categoryIds, tags: tagIds },
    }),
  ])
  const articles = result.data
  return (
    <BlogArticleSlider articles={articles} blockData={blockData} {...props} />
  )
}
