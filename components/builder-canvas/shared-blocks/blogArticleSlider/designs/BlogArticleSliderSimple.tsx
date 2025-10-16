'use client'
// کامپوننت نمایشی بلاک
import React, { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import useEmblaCarousel from 'embla-carousel-react'
import { Article, ArticleTranslationSchema } from '@/features/article/interface'
import LeftSliderButton from '@/components/ui/left-slider-button'
import RightSliderButton from '@/components/ui/right-slider-button'
import { Option } from '@/types'
import { Badge } from '@/components/ui/badge'
import { CalendarPlus, ChevronLeft, MessageCircleMore } from 'lucide-react'
import { buildUrlFromFilters, timeAgo } from '@/lib/utils'
import { FileTranslationSchema } from '@/lib/entity/file/interface'
import { EmblaOptionsType, EmblaPluginType } from 'embla-carousel'
import { Block } from '@/components/builder-canvas/types'

type BlogArticleSliderProps = {
  options?: EmblaOptionsType
  plugins?: EmblaPluginType[]
  articles: Article[]
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

export const BlogArticleSliderSimple = ({
  options,
  plugins,
  articles,
  blockData,
  ...props
}: BlogArticleSliderProps) => {
  const locale = 'fa'
  const { content, settings } = blockData

  const [emblaRef, emblaApi] = useEmblaCarousel(options, plugins)

  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(true)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('select', onSelect)
    onSelect()
  }, [emblaApi, onSelect])
  props.className = props?.className
    ? `${props?.className} w-full h-auto max-w-full`
    : 'w-full h-auto max-w-full'

  const { onClick, ...restProps } = props
  const articleSlids = articles.map((article) => {
    const translationArticle: ArticleTranslationSchema =
      article?.translations?.find(
        (t: ArticleTranslationSchema) => t.lang === locale
      ) ||
      article?.translations[0] ||
      {}

    const translationImage: FileTranslationSchema =
      article.image?.translations?.find(
        (t: FileTranslationSchema) => t.lang === locale
      ) ||
      article.image?.translations[0] ||
      {}

    return (
      <div
        key={article.id}
        className="embla__slide flex-shrink-0 w-full grow-0 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 px-2"
      >
        <div className="rounded-xl overflow-hidden shadow-lg bg-white dark:bg-gray-900">
          <div className="relative w-full h-52">
            <Image
              src={article?.image.srcSmall || '/placeholder.png'}
              sizes="(max-width: 640px) 640px, (max-width: 768px) 768px, 1280px"
              alt={translationImage?.alt || translationImage?.title}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="p-4">
            <h3 className="text-sm font-semibold mb-2 leading-5 min-h-[2.5rem] line-clamp-2">
              <Link href={article.href}>{translationArticle?.title}</Link>
            </h3>
            {settings?.showExcerpt != false && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                {translationArticle?.excerpt}
              </p>
            )}
            <div className="flex mt-3 text-xs text-gray-400 gap-4">
              <div className="flex flex-row gap-1 items-center">
                <MessageCircleMore width={16} /> {article.commentsCount}
              </div>
              <div className="flex flex-row gap-1 items-center">
                <CalendarPlus width={16} /> حدود {timeAgo(article?.createdAt)}
              </div>
            </div>
            {/* <div className="mt-3 text-xs text-gray-400">
              توسط {article.author?.name}
            </div> */}
          </div>
        </div>
      </div>
    )
  })
  const filters = {
    tags: content?.tags?.map((tag) => tag.slug) || [],
    categories: content?.categories?.map((category) => category.slug) || [],
  }
  const archiveUrl = buildUrlFromFilters(filters)
  return (
    <div
      className="embla relative w-full min-h-10  overflow-hidden  py-6"
      {...(onClick ? { onClick } : {})}
    >
      <div className="flex flex-row justify-between pb-2 ">
        <div className="border-r-4 border-primary">
          <span className="block px-4">{content.title}</span>
        </div>
        {settings?.showMoreLink != false && (
          <Link
            href={`archive/${archiveUrl}`}
            className="text-xs text-gray-600 font-normal flex flex-row items-center gap-2"
          >
            <span>مشاهده همه</span>
            <ChevronLeft size={20} />
          </Link>
        )}
      </div>
      {content?.tags?.length > 0 && (
        <div className="p-4 flex flex-row gap-2">
          {content?.tags?.map((tag: Option) => {
            return (
              <Link key={tag.slug} href={`archive/tags/${tag.slug}`}>
                <Badge
                  variant="outline"
                  className="p-2 text-xs text-gray-600 font-normal"
                >
                  {tag.label}
                </Badge>
              </Link>
            )
          })}
        </div>
      )}
      <div className={`embla__viewport mt-2`} ref={emblaRef}>
        <div className="embla__container  flex">{articleSlids}</div>
      </div>
      {/* دکمه‌ها */}
      {settings?.showArrows && (
        <>
          <LeftSliderButton scrollPrev={scrollPrev} />
          <RightSliderButton scrollNext={scrollNext} />
        </>
      )}
    </div>
  )
}
