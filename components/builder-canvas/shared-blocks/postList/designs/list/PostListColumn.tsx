// کامپوننت نمایشی بلاک
import React, { Suspense } from 'react'
import Link from 'next/link'
import { Post } from '@/features/post/interface'
import { Option } from '@/types'
import { MoveLeft } from 'lucide-react'
import { Block } from '@/components/builder-canvas/types'
import { QueryParamLinks } from '@/components/builder-canvas/components/QueryParamLinks'
import { SelectableTags } from '@/components/builder-canvas/components/SelectableTags'

type PostListProps = {
  posts: Post[]
  postItems: any
  setSelectedTag: React.Dispatch<React.SetStateAction<string>>
  showMoreHref: string
  blockData: {
    id: string
    type: 'postList'
    content: {
      title: string
      tags: Option[]
      categories: Option[]
    }
    settings: {
      showNewest: boolean
      showArrows: boolean
      loop: boolean
      autoplay: boolean
      autoplayDelay: number
    }
  } & Block
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const PostListColumn = ({
  posts,
  postItems,
  showMoreHref,
  setSelectedTag,
  blockData,
  ...props
}: PostListProps) => {
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
      // {...(onClick ? { onClick } : {})}
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
          {/* <QueryParamLinks items={queryParamLS} paramKey="tag" /> */}
          <SelectableTags
            items={queryParamLS}
            setSelectedTag={setSelectedTag}
            className="p-2"
          />
        </Suspense>
        <div className={`mt-2 `}>
          <div className="grid grid-cols-1 gap-2">{postItems}</div>
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
