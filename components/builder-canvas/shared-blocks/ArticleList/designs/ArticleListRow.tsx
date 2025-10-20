'use client'
// کامپوننت نمایشی بلاک
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Article, ArticleTranslationSchema } from '@/features/article/interface'
import { Option } from '@/types'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  CalendarPlus,
  ChevronLeft,
  MessageCircleMore,
  MoveLeft,
} from 'lucide-react'
import { buildUrlFromFilters, timeAgo } from '@/lib/utils'
import { FileTranslationSchema } from '@/lib/entity/file/interface'
import { Block } from '@/components/builder-canvas/types'
import { Separator } from '@/components/ui/separator'
import { QueryParamLinks } from '@/components/builder-canvas/components/QueryParamLinks'
import ArticleImageCard from './ImageCard'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

type ArticleListProps = {
  articles: Article[]
  showMoreHref: string
  articleItems: any
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

export const ArticleListRow = ({
  articles,
  showMoreHref,
  articleItems,
  blockData,
  ...props
}: ArticleListProps) => {
  const locale = 'fa'
  const { content, settings } = blockData
  props.className = props?.className
    ? `${props?.className} w-full h-auto max-w-full`
    : 'w-full h-auto max-w-full'

  const { onClick, ...restProps } = props

  let queryParamLS = content?.tags || []
  if (settings?.showNewest == true)
    queryParamLS = [{ label: 'تازه‌ها', slug: '' }, ...queryParamLS]
  return (
    <div
      className=" relative w-full min-h-10  overflow-hidden "
      {...(onClick ? { onClick } : {})}
    >
      <div className="flex flex-row justify-between pb-2 ">
        <div className=" py-4">
          <span className="block px-4 border-r-4 border-primary">
            {content.title}
          </span>
        </div>
        <Link
          href={showMoreHref}
          className="text-xs text-gray-600 dark:text-gray-300 font-normal flex flex-row items-center gap-2 w-fit text-center justify-center p-4"
        >
          <span>مشاهده همه</span>
          <ArrowLeft size={20} className="text-primary" />
        </Link>
      </div>
      <div>
        <QueryParamLinks items={queryParamLS} paramKey="tag" className="p-2" />
        <div className={`mt-2 `}>
          <ScrollArea className="">
            <div className="flex flex-row w-screen gap-4 pb-4">
              {articleItems}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
