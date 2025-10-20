// کامپوننت نمایشی بلاک
import React from 'react'
import { Block } from '../../types'
import { ArticleList } from './ArticleList'
import { Option } from '@/types'
import { getArticles } from '@/features/article/actions'

type ArticleListBlockProps = {
  widgetName: string
  blockData: {
    id: string
    type: 'articleList'
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

export default async function ArticleListBlock({
  widgetName,
  blockData,
  ...props
}: ArticleListBlockProps) {
  const { content, settings } = blockData
  const tagIds = content?.tags?.map((tag: Option) => tag.value)
  const categoryIds = content?.categories?.map((tag: Option) => tag.value) || {}
  let filters
  if (settings?.showNewest == true || tagIds.length == 0) {
    filters = {}
  } else {
    filters = { tags: tagIds[0] }
  }

  if (categoryIds.length > 0) filters = { categories: categoryIds, ...filters }

  const [result] = await Promise.all([
    getArticles({
      filters,
      pagination: { page: 1, perPage: settings?.countOfArticles || 6 },
    }),
  ])
  const articles = result.data
  return <ArticleList articles={articles} blockData={blockData} {...props} />
}
