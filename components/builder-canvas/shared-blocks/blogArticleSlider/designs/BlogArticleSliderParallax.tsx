'use client'
// کامپوننت نمایشی بلاک
import React from 'react'
import { Block } from '../../../types'
import Image from 'next/image'
import Link from 'next/link'
import Autoplay from 'embla-carousel-autoplay'
import { Article, ArticleTranslationSchema } from '@/features/article/interface'
import { Option } from '@/types'
import { FileTranslationSchema } from '@/lib/entity/file/interface'
import { EmblaCarouselParallax } from '@/components/embla-carousel/parallax'
import { EmblaOptionsType, EmblaPluginType } from 'embla-carousel'

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

export const BlogArticleSliderParallax = ({
  options,
  plugins,
  articles,
  blockData,
  ...props
}: BlogArticleSliderProps) => {
  const locale = 'fa'
  const { content, settings } = blockData
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
        className="embla__slide flex-shrink-0 w-full grow-0 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 py-4"
      >
        <div className="embla__parallax rounded-xl overflow-hidden shadow-md bg-white dark:bg-gray-900 ">
          <div className="embla__parallax__layer  flex-[0_0_100%] aspect-[3/2] sm:aspect-[16/11] lg:aspect-[21/14]">
            <Link href={article.href} className="">
              <Image
                className="embla__slide__img embla__parallax__img "
                src={article?.image?.srcSmall || '/placeholder.png'}
                sizes="(max-width: 640px) 640px, (max-width: 768px) 768px, 1280px"
                alt={translationImage?.alt || translationImage?.title}
                layout="fill"
                objectFit="cover"
              />
              {/* overlay گرادینت تاریک از پایین */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none " />

              {/* متن روی تصویر */}
              <div className="absolute bottom-0 w-full text-center p-4 text-gray-100 font-semibold z-10">
                {translationArticle?.title}
              </div>
            </Link>
          </div>
        </div>
      </div>
    )
  })
  return (
    <EmblaCarouselParallax
      slides={articleSlids}
      options={options}
      plugins={plugins}
      showArrows={settings?.showArrows}
      {...props}
    />
  )
}
