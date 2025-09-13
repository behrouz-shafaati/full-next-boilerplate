'use client'
// کامپوننت نمایشی بلاک
import React, { useEffect, useState } from 'react'
import { Block } from '../../../builder-canvas/types'
import { TemplatePart } from './Template'
import { getTemplatePart } from '@/features/template-part/actions'
import EmptyBlock from '@/components/builder-canvas/components/EmptyBlock'

type TemplateBlockEditorProps = {
  widgetName: string
  blockData: {
    id: string
    type: 'templatePart'
    content: {
      templateId: string
    }
    settings: {
      stickyTemplate: boolean
    }
  } & Block
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export default function TemplateBlockEditor({
  widgetName,
  blockData,
  ...props
}: TemplateBlockEditorProps) {
  const [template, setTemplate] = useState({ content: { rows: [] } })
  const { content } = blockData
  useEffect(() => {
    const fetchData = async () => {
      const [template] = await Promise.all([
        getTemplatePart(content?.templateId),
      ])
      setTemplate(template)
    }

    fetchData()
  }, [content])

  if (!content?.templateId)
    return <EmptyBlock widgetName={widgetName} {...props} />
  return (
    <TemplatePart
      template={template}
      blockData={blockData}
      {...props}
      editroMode={true}
    />
  )
}
