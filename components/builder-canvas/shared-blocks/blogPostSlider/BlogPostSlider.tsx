'use client'
// کامپوننت نمایشی بلاک
import React, { useCallback, useEffect, useState } from 'react'
import { Block } from '../../types'
import Image from 'next/image'
import Link from 'next/link'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { Post, PostTranslationSchema } from '@/features/post/interface'
import LeftSliderButton from '@/components/ui/left-slider-button'
import RightSliderButton from '@/components/ui/right-slider-button'
import { Option } from '@/types'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft } from 'lucide-react'
import { buildUrlFromFilters } from '@/lib/utils'
import { FileTranslationSchema } from '@/lib/entity/file/interface'

type BlogPostSliderProps = {
  posts: Post[]
  blockData: {
    id: string
    type: 'blogPostSlider'
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

export const BlogPostSlider = ({
  posts,
  blockData,
  ...props
}: BlogPostSliderProps) => {
  const locale = 'fa'
  const { content, settings } = blockData
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      direction: 'rtl',
    },
    [Autoplay({ playOnInit: false, delay: settings?.delay * 1000 || 3000 })]
  )

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
  const postSlids = posts.map((post) => {
    const translationPost: PostTranslationSchema =
      post?.translations?.find(
        (t: PostTranslationSchema) => t.lang === locale
      ) ||
      post?.translations[0] ||
      {}

    const translationImage: FileTranslationSchema =
      post.image?.translations?.find(
        (t: FileTranslationSchema) => t.lang === locale
      ) ||
      post.image?.translations[0] ||
      {}
    return (
      <div
        key={post.id}
        className="embla__slide flex-shrink-0 w-full grow-0 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 px-2"
      >
        <div className="rounded-xl overflow-hidden shadow-lg bg-white dark:bg-gray-900">
          <div className="relative w-full h-52">
            <Image
              src={post.image?.src || '/placeholder.png'}
              alt={translationImage?.alt || translationImage?.title}
              layout="fill"
              objectFit="cover"
              unoptimized
            />
          </div>
          <div className="p-4">
            <h3 className="text-md font-semibold mb-2 line-clamp-2">
              <Link href={post.href}> {translationPost?.title}</Link>
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
              {translationPost?.excerpt}
            </p>
            <div className="mt-3 text-xs text-gray-400">
              توسط {post.user?.name}
            </div>
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
      className="relative w-full min-h-10 embla overflow-hidden  py-6"
      {...(onClick ? { onClick } : {})}
    >
      <div className="flex flex-row justify-between pb-2 px-4 ">
        <div>{content.title}</div>
        <Link
          href={`archive/${archiveUrl}`}
          className="text-xs text-gray-600 font-normal flex flex-row items-center gap-2"
        >
          <span>مشاهده همه</span>
          <ChevronLeft size={20} />
        </Link>
      </div>
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
      <div className={`embla__viewport`} ref={emblaRef}>
        <div className="embla__container  flex">{postSlids}</div>
      </div>
      {/* دکمه‌ها */}
      <LeftSliderButton scrollPrev={scrollPrev} />
      <RightSliderButton scrollNext={scrollNext} />
    </div>
  )
}
