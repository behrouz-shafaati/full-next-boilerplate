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
import { SubmitButton } from '@/components/form-fields/submit-button'

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
  return <SubmitButton className="w-full" />
}
