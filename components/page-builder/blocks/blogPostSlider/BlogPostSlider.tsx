'use client'
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

type BlogPostSliderProps = {
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

export const BlogPostSlider = ({
  blockData,
  ...props
}: BlogPostSliderProps) => {
  const { content, settings, styles } = blockData
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      direction: 'rtl',
    },
    [Autoplay({ playOnInit: true, delay: settings?.delay * 1000 || 3000 })]
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
  // const images = content.map((img: FileDetails, i: number) => {
  //   const imageElement = (
  //     <Image
  //       src={img.src || '/assets/general-img-landscape.png'}
  //       alt={img.alt || 'تصویر'}
  //       //   fill
  //       width={0}
  //       height={0}
  //       sizes="100vw"
  //       style={{
  //         objectFit: 'contain',
  //         ...computedStyles(styles),
  //       }}
  //       priority={i === 0}
  //       className="block w-full h-auto"
  //       {...props}
  //     />
  //   )
  //   return img.href ? (
  //     <div className="min-w-full relative" key={i}>
  //       <Link href={img.href} target="_blank" rel="noopener noreferrer">
  //         {imageElement}
  //       </Link>
  //     </div>
  //   ) : (
  //     <div className="min-w-full relative" key={i}>
  //       {imageElement}
  //     </div>
  //   )
  // })

  return (
    <div className="relative w-full min-h-10" {...(onClick ? { onClick } : {})}>
      <div className={`overflow-hidden`} ref={emblaRef}>
        <div className="flex">
          <div>hi</div>
        </div>
      </div>
      {/* دکمه‌ها */}
      <button
        onClick={scrollPrev}
        className="absolute top-1/2 left-4 -translate-y-1/2 z-10 bg-black/40 text-white p-1 rounded-full hover:bg-black/70 transition"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={scrollNext}
        className="absolute top-1/2 right-4 -translate-y-1/2 z-10 bg-black/40 text-white p-1 rounded-full hover:bg-black/70 transition"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  )
}
