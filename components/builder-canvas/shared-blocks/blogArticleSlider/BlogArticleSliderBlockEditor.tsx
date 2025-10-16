'use client'
// کامپوننت نمایشی بلاک
import React, { useEffect, useState } from 'react'
import { Block } from '../../types'
import { BlogArticleSlider } from './BlogArticleSlider'
import { Option } from '@/types'
import { getArticles } from '@/features/article/actions'
import EmptyBlock from '../../components/EmptyBlock'

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
      showArrows: boolean
      loop: boolean
      autoplay: boolean
      autoplayDelay: number
    }
  } & Block
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export default function BlogArticleSliderBlockEditor({
  widgetName,
  blockData,
  ...props
}: BlogArticleSliderBlockProps) {
  const [articles, setArticles] = useState([])
  const { content } = blockData

  useEffect(() => {
    const fetchData = async () => {
      const tagIds = content?.tags?.map((tag: Option) => tag.value)
      const categoryIds = content?.categories?.map((tag: Option) => tag.value)
      const [result] = await Promise.all([
        getArticles({
          filters: { categories: categoryIds, tags: tagIds },
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
  return (
    <BlogArticleSlider articles={articles} blockData={blockData} {...props} />
  )
}
