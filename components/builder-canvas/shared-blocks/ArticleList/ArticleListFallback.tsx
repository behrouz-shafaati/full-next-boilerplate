// کامپوننت نمایشی فال بک بلاک
import React from 'react'
import { Block } from '../../types'
import { Article } from '@/features/article/interface'
import { Option } from '@/types'
import { ArticleListColumn } from './designs/ArticleListColumn'
import { ArticleListRow } from './designs/ArticleListRow'
import ArticleImageCard from './designs/ImageCard'
import ArticleOverlayCard from './designs/OverlayCard'
import ArticleHorizontalCard from './designs/ArticalHorizontalCard'

type ArticleListProps = {
  articles: Article[]
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

export const ArticleListFallback = ({
  articles,
  blockData,
  ...props
}: ArticleListProps) => {
  const locale = 'fa'
  const { content, settings } = blockData

  let showMoreHref = 'archive'
  // showMoreHref =
  //   selectedTag != ''
  //     ? showMoreHref + '/' + buildUrlFromFilters({ tags: [selectedTag] })
  //     : showMoreHref

  let articleItems = []

  switch (settings?.cardDesign) {
    case 'overly-card':
      articleItems = articles.map((article) => {
        return (
          <ArticleOverlayCard
            key={article.id}
            article={article}
            options={settings}
          />
        )
      })
      break
    case 'horizontal-card':
      articleItems = articles.map((article) => {
        return (
          <ArticleHorizontalCard
            key={article.id}
            article={article}
            options={settings}
          />
        )
      })
      break
    default:
      articleItems = articles.map((article) => {
        return (
          <ArticleImageCard
            key={article.id}
            article={article}
            options={settings}
          />
        )
      })
  }
  switch (settings?.listDesign) {
    case 'row':
      return (
        <ArticleListRow
          articles={articles}
          blockData={blockData}
          showMoreHref={showMoreHref}
          articleItems={articleItems}
          {...props}
        />
      )
    default:
      return (
        <ArticleListColumn
          articles={articles}
          articleItems={articleItems}
          blockData={blockData}
          showMoreHref={showMoreHref}
          {...props}
        />
      )
  }
}
