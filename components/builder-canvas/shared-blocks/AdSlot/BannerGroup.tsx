'use client'
// کامپوننت نمایشی بلاک
import React, { useEffect, useState } from 'react'
import { Block } from '../../types'
import { AdSlotWidgetProps } from './type'
import { Banner } from './Banner'
import { useDeviceType } from '@/hooks/use-device-type'
import { Button } from '@/components/form-fields/emblorTagInput/ui/button'
import { X } from 'lucide-react'

type BannerGroupProps = AdSlotWidgetProps &
  Block &
  React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export default function BannerGroup({
  blockData,
  widgetName,
  ...props
}: BannerGroupProps) {
  const locale = 'fa'
  const { id, content, settings } = blockData
  const visibility = blockData?.styles?.visibility || {
    desktop: true,
    tablet: true,
    mobile: true,
  }
  const [show, setShow] = useState(true)
  const device = useDeviceType()

  const isVisible = visibility[device]
  if (!isVisible) return null
  return (
    <div {...props}>
      <div
        className="relative"
        style={{
          display: show ? 'flex' : 'none',
          flexDirection: settings?.direction || 'row',
          gap: '8px', // اختیاری، فقط برای فاصله بین بنرها
        }}
      >
        <button
          onClick={() => setShow(false)}
          className="absolute top-0 right-0 bg-red-700 z-20 p-0 opacity-70"
        >
          <X className="w-4 h-4 text-white" />
        </button>
        {Array.from({ length: settings?.countOfBanners || 1 }).map((_, i) => {
          return (
            <Banner
              key={i}
              banerSlotId={`${id}${i}`}
              blockData={blockData}
              {...props}
            />
          )
        })}
      </div>
    </div>
  )
}
