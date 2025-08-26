// کامپوننت نمایشی بلاک
import React from 'react'
import { Block } from '../../../builder-canvas/types'
import { TemplatePart } from './Template'
import { getTemplatePart } from '@/features/template-part/actions'

type Props = {
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

export default async function TemplateBlock({ blockData, ...props }: Props) {
  const { content } = blockData
  const [template] = await Promise.all([getTemplatePart(content?.templateId)])
  return (
    <TemplatePart
      template={template}
      blockData={blockData}
      {...props}
      editroMode={false}
    />
  )
}
