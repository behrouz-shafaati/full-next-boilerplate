'use client'
// کامپوننت نمایشی بلاک
import React, { useEffect, useState } from 'react'
import { Block } from '../../types'
import { ArticleList } from './ArticleList'
import { Option } from '@/types'
import { getArticles } from '@/features/article/actions'
import EmptyBlock from '../../components/EmptyBlock'

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
      showArrows: boolean
      loop: boolean
      autoplay: boolean
      autoplayDelay: number
    }
  } & Block
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export default function ArticleListBlockEditor({
  widgetName,
  blockData,
  ...props
}: ArticleListBlockProps) {
  const [articles, setArticles] = useState([])
  const { content, settings } = blockData

  useEffect(() => {
    const fetchData = async () => {
      const tagIds = content?.tags?.map((tag: Option) => tag.value)
      const categoryIds = content?.categories?.map((tag: Option) => tag.value)

      let filters
      if (settings?.showNewest == true) {
        filters = {}
      } else {
        filters = { tags: tagIds[0] }
      }

      if (categoryIds.length > 0)
        filters = { categories: categoryIds, ...filters }

      const [result] = await Promise.all([
        getArticles({
          filters,
          pagination: { page: 1, perPage: settings?.countOfArticles || 6 },
        }),
      ])

      const articles = result.data
      setArticles(articles)
      console.log('#89782345 articles:', articles)
    }

    fetchData()
  }, [content])
  if (articles.length == 0)
    return <EmptyBlock widgetName={widgetName} {...props} />
  return <ArticleList articles={articles} blockData={blockData} {...props} />
}
