// کامپوننت نمایشی بلاک

import React, { ElementType } from 'react'
import { Block } from '@/components/builder-canvas/types'
import {
  combineClassNames,
  computedStyles,
} from '@/components/builder-canvas/utils/styleUtils'
import Text from '@/components/form-fields/text'
import { IconRenderer } from '@/components/builder-canvas/components/IconRenderer'
import TextArea from '@/components/form-fields/textArea'
import { SubmitButton } from '@/components/form-fields/submit-button'

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
      <SubmitButton className="w-full" />
    </div>
  )
}
