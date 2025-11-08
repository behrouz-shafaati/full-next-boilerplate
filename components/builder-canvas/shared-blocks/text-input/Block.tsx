// کامپوننت نمایشی بلاک

import React, { ElementType } from 'react'
import { Block as BlockType } from '@/components/builder-canvas/types'
import {
  combineClassNames,
  computedStyles,
} from '@/components/builder-canvas/utils/styleUtils'
import Text from '@/components/form-fields/text'
import { IconRenderer } from '@/components/builder-canvas/components/IconRenderer'

type BlockProps = {
  content: React.ReactNode
  blockData: {
    content: {
      content: string
    }
    type: 'content_post_title'
    settings: {}
  } & BlockType
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const Block = ({ blockData, content, ...props }: BlockProps) => {
  const { id, settings } = blockData
  const { className, ...restProps } = props
  return (
    <Text
      style={{
        ...computedStyles(blockData?.styles),
      }}
      title={settings?.title || ''}
      placeholder={settings?.placeholder || ''}
      name={id}
      id={id}
      {...(settings?.icon
        ? {
            icon: <IconRenderer name={settings.icon} className={`w-5 h-5`} />,
          }
        : {})}
      description={settings?.description || ''}
      required={settings?.required || false}
      className={className}
      readOnly={settings?.readOnly || false}
      defaultValue={settings?.defaultValue || ''}
      {...restProps}
    />
  )
}
