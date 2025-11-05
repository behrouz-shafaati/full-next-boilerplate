'use client'
// کامپوننت نمایشی بلاک
import React, { useEffect, useState } from 'react'
import { Block } from '../../types'
import Autoplay from 'embla-carousel-autoplay'
import { Article } from '@/features/article/interface'
import { Option } from '@/types'
import { ArticleListColumn } from './designs/ArticleListColumn'

import { EmblaOptionsType, EmblaPluginType } from 'embla-carousel'
import { useSearchParams } from 'next/navigation'
import { getArticles } from '@/features/article/actions'
import { getTagAction } from '@/features/tag/actions'
import { buildUrlFromFilters } from '@/lib/utils'
import { ArticleListRow } from './designs/ArticleListRow'
import ArticleImageCard from './designs/ImageCard'
import ArticleOverlayCard from './designs/OverlayCard'
import ArticleHorizontalCard from './designs/ArticalHorizontalCard'
import { Banner } from '../AdSlot/Banner'

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

export const ArticleList = ({
  articles,
  blockData,
  ...props
}: ArticleListProps) => {
  const locale = 'fa'
  const { id, content, settings } = blockData
  const [_articles, setArticles] = useState(articles)
  const searchParams = useSearchParams()

  let queryParams = content?.tags || []
  if (settings?.showNewest == true)
    queryParams = [{ label: 'تازه‌ها', slug: '' }, ...queryParams]

  const selectedTag = searchParams.get('tag') || ''
  console.log('###234234 selectedTag:', selectedTag)
  useEffect(() => {
    const fetchData = async () => {
      let articles = {}
      let filters = {}
      const categoryIds =
        content?.categories?.map((tag: Option) => tag.value) || {}
      const selectedTagExistInItems = queryParams?.some(
        (tag) => tag.slug === selectedTag
      )

      // اگر دسته ای انتخاب شده است روی  فیلتر اعمال شود
      if (categoryIds?.length > 0)
        filters = { categories: categoryIds, ...filters }

      // اگر تگ انتخاب شده و ثبت شده در نوار آدرس در آیتم های این لیست نیست کاری انجام نشود
      if (!selectedTagExistInItems) return
      if (selectedTag !== '') {
        const tag = await getTagAction({ slug: selectedTag })
        filters = { tags: [tag.id], ...filters }
        articles = await getArticles({
          filters,
          pagination: { page: 1, perPage: settings?.countOfArticles || 6 },
        })
        setArticles(articles.data)
      } else {
        articles = await getArticles({
          filters,
          pagination: { page: 1, perPage: settings?.countOfArticles || 6 },
        })
        setArticles(articles.data)
      }
    }
    fetchData()
  }, [selectedTag])

  const OPTIONS: EmblaOptionsType = {
    dragFree: settings?.dragFree == false ? false : true,
    loop: settings?.loop,
    direction: settings?.rtl ? 'rtl' : 'ltr',
  }
  const plugins: EmblaPluginType[] = [
    Autoplay({
      playOnInit: settings?.autoplay == false ? false : true,
      delay: settings?.delay * 1000 || 5000,
    }),
  ]
  let showMoreHref = 'archive'
  showMoreHref =
    selectedTag != ''
      ? showMoreHref + '/' + buildUrlFromFilters({ tags: [selectedTag] })
      : showMoreHref

  let articleItems = []

  const advertisingAfter = settings?.advertisingAfter
    ? settings?.advertisingAfter
    : 0
  let adIndex = 0
  articleItems = _articles.map((article, index) => {
    adIndex = adIndex + 1
    let flgShowBanner = false
    if (advertisingAfter == adIndex) {
      flgShowBanner = true
      adIndex = 0
    }
    switch (settings?.cardDesign) {
      case 'overly-card':
        return (
          <>
            <ArticleOverlayCard
              key={article.id}
              article={article}
              options={settings}
            />
            {flgShowBanner && (
              <Banner
                blockData={{ settings: { aspect: '4/1' } }}
                banerSlotId={`${id}${index}`}
              />
            )}
          </>
        )
        break
      case 'horizontal-card':
        return (
          <>
            <ArticleHorizontalCard
              key={article.id}
              article={article}
              options={settings}
            />
            {flgShowBanner && (
              <Banner
                blockData={{ settings: { aspect: '4/1' } }}
                banerSlotId={`${id}${index}`}
              />
            )}
          </>
        )
        break
      default:
        return (
          <>
            <ArticleImageCard
              key={article.id}
              article={article}
              options={settings}
            />
            {flgShowBanner && (
              <Banner
                blockData={{ settings: { aspect: '4/1' } }}
                banerSlotId={`${id}${index}`}
              />
            )}
          </>
        )
    }
  })
  switch (settings?.listDesign) {
    case 'row':
      return (
        <ArticleListRow
          articles={_articles}
          blockData={blockData}
          showMoreHref={showMoreHref}
          articleItems={articleItems}
          {...props}
        />
      )
    default:
      return (
        <ArticleListColumn
          articles={_articles}
          articleItems={articleItems}
          blockData={blockData}
          showMoreHref={showMoreHref}
          {...props}
        />
      )
  }
}
