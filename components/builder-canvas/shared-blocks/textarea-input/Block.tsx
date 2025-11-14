// کامپوننت نمایشی بلاک

import React, { ElementType } from 'react'
import { Block as BlockType } from '@/components/builder-canvas/types'
import {
  combineClassNames,
  computedStyles,
} from '@/components/builder-canvas/utils/styleUtils'
import Text from '@/components/form-fields/text'
import { IconRenderer } from '@/components/builder-canvas/components/IconRenderer'
import TextArea from '@/components/form-fields/textArea'

type BlockProps = {
  content: React.ReactNode
  blockData: {
    content: {
      content: string
    }
    type: 'content_post_title'
    settings: {}
  } & BlockType
  locale: 'fa'
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const Block = ({
  locale = 'fa',
  blockData,
  content,
  ...props
}: BlockProps) => {
  const { id, settings } = blockData
  const { className, ...restProps } = props
  return (
    <TextArea
      style={{
        ...computedStyles(blockData?.styles),
      }}
      title={settings?.title?.[locale] || ''}
      placeholder={settings?.placeholder?.[locale] || ''}
      name={id}
      id={id}
      {...(settings?.icon
        ? {
            icon: <IconRenderer name={settings.icon} className={`w-5 h-5`} />,
          }
        : {})}
      description={settings?.description?.[locale] || ''}
      required={settings?.required || false}
      className={className}
      {...restProps}
    />
  )
}
