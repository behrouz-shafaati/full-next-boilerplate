'use client'
// کامپوننت نمایشی بلاک
import React, { useEffect, useState } from 'react'
import { PageBlock } from '../../../builder-canvas/types'
import { Template } from './Template'
import { getTemplate } from '@/features/template/actions'

type TemplateBlockEditorProps = {
  blockData: {
    id: template
    type: 'template'
    content: {
      templateId: template
    }
    settings: {
      stickyTemplate: boolean
    }
  } & PageBlock
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export default function TemplateBlockEditor({
  blockData,
  ...props
}: TemplateBlockEditorProps) {
  const [template, setTemplate] = useState({ content: { rows: [] } })
  const { content } = blockData
  useEffect(() => {
    const fetchData = async () => {
      const [template] = await Promise.all([getTemplate(content?.templateId)])
      setTemplate(template)
    }

    fetchData()
  }, [content])
  return (
    <Template
      template={template}
      blockData={blockData}
      {...props}
      editroMode={true}
    />
  )
}
