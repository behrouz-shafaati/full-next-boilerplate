// کامپوننت نمایشی بلاک

import React from 'react'
import { Block } from '../../types'
import { computedStyles } from '../../utils/styleUtils'
import { renderTiptapAction } from '@/components/tiptap-editor/render/renderTiptapAction'
import EnhanceHtmlForNext from '@/components/tiptap-editor/render/EnhanceHtmlForNext'

type WriteBlockProps = {
  widgetName: string
  blockData: {
    content: {
      write: string
    }
    type: 'write'
    settings: {}
  } & Block
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const WriteBlock = async ({
  widgetName,
  blockData,
  ...props
}: WriteBlockProps) => {
  const { content, settings } = blockData
  if (!content?.json) return null

  const [HTML_string] = await Promise.all([
    renderTiptapAction({
      contentJson: content?.json,
    }),
  ])
  return (
    <div
      style={{
        ...computedStyles(blockData.styles),
      }}
      {...props}
    >
      <EnhanceHtmlForNext
        HTML_string={HTML_string}
        contentJson={content?.json}
      />
    </div>
  )
}
