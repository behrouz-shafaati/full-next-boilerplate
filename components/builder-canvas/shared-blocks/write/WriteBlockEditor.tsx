// کامپوننت نمایشی بلاک
'use client'
import React, { ElementType, useEffect, useState } from 'react'
import { Block } from '../../types'
import { combineClassNames, computedStyles } from '../../utils/styleUtils'
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

export const WriteEditorBlock = ({
  widgetName,
  blockData,
  ...props
}: WriteBlockProps) => {
  const { content, settings } = blockData
  const [HTML_string, setHTML_string] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const [HTML_string] = await Promise.all([
        renderTiptapAction({
          contentJson: content?.json,
        }),
      ])
      setHTML_string(HTML_string)
    }

    fetchData()
  }, [content])

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
