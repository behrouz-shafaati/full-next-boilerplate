'use client'
// کامپوننت نمایشی بلاک
import React from 'react'
import { Block } from '../../types'
import Autoplay from 'embla-carousel-autoplay'
import { Article } from '@/features/article/interface'
import { Option } from '@/types'
import { BlogArticleSliderParallax } from './designs/BlogArticleSliderParallax'
import { BlogArticleSliderSimple } from './designs/BlogArticleSliderSimple'

import { EmblaOptionsType, EmblaPluginType } from 'embla-carousel'

type BlogArticleSliderProps = {
  articles: Article[]
  blockData: {
    id: string
    type: 'blogArticleSlider'
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

export const BlogArticleSlider = ({
  articles,
  blockData,
  ...props
}: BlogArticleSliderProps) => {
  const locale = 'fa'
  const { content, settings } = blockData
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
  switch (settings?.design) {
    case 'parallax':
      return (
        <BlogArticleSliderParallax
          plugins={plugins}
          options={OPTIONS}
          articles={articles}
          blockData={blockData}
          {...props}
        />
      )
    default:
      return (
        <BlogArticleSliderSimple
          plugins={plugins}
          options={OPTIONS}
          articles={articles}
          blockData={blockData}
          {...props}
        />
      )
  }
}
