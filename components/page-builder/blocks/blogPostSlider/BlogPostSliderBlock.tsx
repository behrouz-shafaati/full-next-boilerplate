// کامپوننت نمایشی بلاک
import React, { useCallback, useEffect, useState } from 'react'
import { PageBlock } from '../../types'
import { computedStyles } from '../../utils/styleUtils'
import Image from 'next/image'
import Link from 'next/link'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { FileDetails } from '@/lib/entity/file/interface'
import { BlogPostSlider } from './BlogPostSlider'
import { Option } from '@/types'

type BlogPostSliderBlockProps = {
  blockData: {
    content: [
      {
        title: string
        alt: string
        description: string
        src: string
        href: string
      }
    ]
    type: 'blogPostSlider'
    settings: {}
  } & PageBlock
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const BlogPostSliderBlock = ({
  blockData,
  ...props
}: BlogPostSliderBlockProps) => {
  const { content } = blockData
  const tagIds = content?.tags?.map((tag: Option) => tag.value)
  const categoryIds = content?.categories?.map((tag: Option) => tag.value)
  console.log('#23487 tagIds:', tagIds)
  console.log('#23487 categoryIds:', categoryIds)
  return <BlogPostSlider blockData={blockData} {...props} />
}
