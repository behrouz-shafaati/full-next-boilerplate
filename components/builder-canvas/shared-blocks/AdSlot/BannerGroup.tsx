'use client'
// کامپوننت نمایشی بلاک
import React, { useEffect, useState } from 'react'
import { Block } from '../../types'
import { AdSlotWidgetProps } from './type'
import { Banner } from './Banner'
import { useDeviceType } from '@/hooks/use-device-type'

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
  const device = useDeviceType()

  const isVisible = visibility[device]
  if (!isVisible) return null
  return (
    <div {...props}>
      <div
        style={{
          display: 'flex',
          flexDirection: settings?.direction || 'row',
          gap: '8px', // اختیاری، فقط برای فاصله بین بنرها
        }}
      >
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
