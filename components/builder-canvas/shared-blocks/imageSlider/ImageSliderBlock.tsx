// کامپوننت نمایشی بلاک
'use client'
import React, { useCallback } from 'react'
import { PageBlock } from '../../types'
import { computedStyles } from '@/components/builder-canvas/utils/styleUtils'
import Image from 'next/image'
import Link from 'next/link'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { FileDetails } from '@/lib/entity/file/interface'
import LeftSliderButton from '@/components/ui/left-slider-button'
import RightSliderButton from '@/components/ui/right-slider-button'
import EmptyBlock from '../../components/EmptyBlock'

type ImageSliderBlockProps = {
  widgetName: string
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
    type: 'imageSlider'
    settings: {}
  } & PageBlock
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const ImageSliderBlock = ({
  widgetName,
  blockData,
  ...props
}: ImageSliderBlockProps) => {
  const { content, settings, styles } = blockData
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      direction: 'rtl',
    },
    [Autoplay({ playOnInit: true, delay: settings?.delay * 1000 || 3000 })]
  )

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  props.className = props?.className
    ? `${props?.className} w-full h-auto max-w-full`
    : 'w-full h-auto max-w-full'

  if (content.length == 0)
    return <EmptyBlock widgetName={widgetName} {...props} />
  const { onClick, ...restProps } = props
  const images = content.map((img: FileDetails, i: number) => {
    const imageElement = (
      <Image
        src={img.src || '/assets/general-img-landscape.png'}
        alt={img.alt || 'تصویر'}
        //   fill
        width={0}
        height={0}
        sizes="100vw"
        style={{
          objectFit: 'contain',
          ...computedStyles(styles),
        }}
        priority={i === 0}
        className="block w-full h-auto"
        {...props}
      />
    )
    return img.href ? (
      <div className="relative min-w-full" key={i}>
        <Link href={img.href} target="_blank" rel="noopener noreferrer">
          {imageElement}
        </Link>
      </div>
    ) : (
      <div className="relative min-w-full" key={i}>
        {imageElement}
      </div>
    )
  })

  return (
    <div className="relative w-full min-h-10" {...(onClick ? { onClick } : {})}>
      <div className={`overflow-hidden`} ref={emblaRef}>
        <div className="flex">{images}</div>
      </div>
      {/* دکمه‌ها */}
      <LeftSliderButton scrollPrev={scrollPrev} />
      <RightSliderButton scrollNext={scrollNext} />
    </div>
  )
}
