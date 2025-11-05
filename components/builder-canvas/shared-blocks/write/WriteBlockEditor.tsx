// کامپوننت نمایشی بلاک
'use client'
import React, { ElementType, useEffect, useState } from 'react'
import { Block } from '../../types'
import { combineClassNames, computedStyles } from '../../utils/styleUtils'
import { renderTiptapAction } from '@/components/tiptap-editor/render/renderTiptapAction'
import EnhanceHtmlForNext from '@/components/tiptap-editor/render/EnhanceHtmlForNext'
import { getSettingsAction } from '@/features/settings/actions'

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
  const [siteSettings, setSiteSettings] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      const [HTML_string, siteSettings] = await Promise.all([
        renderTiptapAction({
          contentJson: content?.json,
        }),
        getSettingsAction(),
      ])
      setHTML_string(HTML_string)
      setSiteSettings(siteSettings)
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
        siteSettings={siteSettings}
        HTML_string={HTML_string}
        contentJson={content?.json}
      />
    </div>
  )
}
