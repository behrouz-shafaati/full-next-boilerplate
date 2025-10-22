'use client'
// کامپوننت نمایشی بلاک
import React, { Suspense } from 'react'
import Link from 'next/link'
import { Article } from '@/features/article/interface'
import { Option } from '@/types'
import { MoveLeft } from 'lucide-react'
import { Block } from '@/components/builder-canvas/types'
import { QueryParamLinks } from '@/components/builder-canvas/components/QueryParamLinks'

type ArticleListProps = {
  articles: Article[]
  articleItems: any
  showMoreHref: string
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

export const ArticleListColumn = ({
  articles,
  articleItems,
  showMoreHref,
  blockData,
  ...props
}: ArticleListProps) => {
  const locale = 'fa'
  const { content, settings } = blockData
  props.className = props?.className
    ? `${props?.className} w-full h-auto max-w-full`
    : 'w-full h-auto max-w-full'

  const { onClick, ...restProps } = props
  const filters = {
    tags: content?.tags?.map((tag) => tag.slug) || [],
    categories: content?.categories?.map((category) => category.slug) || [],
  }

  let queryParamLS = content?.tags || []
  if (settings?.showNewest == true)
    queryParamLS = [{ label: 'تازه‌ها', slug: '' }, ...queryParamLS]
  return (
    <div
      className=" relative w-full min-h-10  overflow-hidden "
      {...(onClick ? { onClick } : {})}
    >
      <div className="flex flex-row justify-between pb-2 ">
        <div className="py-4">
          <span className="block px-4 border-r-4 border-primary">
            {content.title}
          </span>
        </div>
      </div>
      <div className="px-2">
        <Suspense fallback={<div>در حال بارگذاری...</div>}>
          <QueryParamLinks items={queryParamLS} paramKey="tag" />
        </Suspense>
        <div className={`mt-2 `}>
          <div className="grid grid-cols-1 gap-2">{articleItems}</div>
          <Link
            href={showMoreHref}
            className="text-xs text-gray-600 dark:text-gray-300 font-normal flex flex-row items-center gap-2 w-full text-center justify-center p-4"
          >
            <span>مشاهده مطالب بیشتر</span>
            <MoveLeft size={20} className="text-primary" />
          </Link>
        </div>
      </div>
    </div>
  )
}
