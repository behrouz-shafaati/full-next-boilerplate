// کامپوننت نمایشی بلاک
import { PageBlock } from '../../../builder-canvas/types'
import { Template as TemplateType } from '@/features/template/interface'
import RendererRows from '@/components/builder-canvas/pageRenderer/RenderRows'

type TemplateProps = {
  editroMode: boolean
  template: TemplateType
  blockData: {
    id: string
    type: 'templatePart'
    content: {
      templateId: string
    }
    settings: {}
  } & PageBlock
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const TemplatePart = ({
  editroMode = false,
  template,
  blockData,
  ...props
}: TemplateProps) => {
  const { content, settings } = blockData
  const { className } = props

  return (
    <section {...props} className={`w-full z-50 ${className}`}>
      <RendererRows
        rows={template?.content?.rows}
        editroMode={editroMode}
        {...props}
      />
    </section>
  )
}
