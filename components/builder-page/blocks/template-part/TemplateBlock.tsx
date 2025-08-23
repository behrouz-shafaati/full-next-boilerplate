// کامپوننت نمایشی بلاک
import React from 'react'
import { PageBlock } from '../../../builder-canvas/types'
import { Template } from './Template'
import { getTemplate } from '@/features/template/actions'

type Props = {
  blockData: {
    id: string
    type: 'template'
    content: {
      templateId: string
    }
    settings: {
      stickyTemplate: boolean
    }
  } & PageBlock
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export default async function TemplateBlock({ blockData, ...props }: Props) {
  const { content } = blockData
  const [template] = await Promise.all([getTemplate(content?.templateId)])
  return (
    <Template
      template={template}
      blockData={blockData}
      {...props}
      editroMode={false}
    />
  )
}
