// کامپوننت نمایشی بلاک

import React, { ElementType } from 'react'
import { Block } from '@/components/builder-canvas/types'
import {
  combineClassNames,
  computedStyles,
} from '@/components/builder-canvas/utils/styleUtils'
import Text from '@/components/form-fields/text'
import { IconRenderer } from '@/components/builder-canvas/components/IconRenderer'

type BlockInEditorProps = {
  widgetName: string
  blockData: {
    content: {
      content: string
    }
    type: 'content_post_title'
    settings: {}
  } & Block
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const BlockInEditor = ({
  widgetName,
  blockData,
  ...props
}: BlockInEditorProps) => {
  const { id, content, settings } = blockData

  return (
    <div
      style={{
        ...computedStyles(blockData.styles),
      }}
      {...props}
    >
      <Text
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
      />
    </div>
  )
}
