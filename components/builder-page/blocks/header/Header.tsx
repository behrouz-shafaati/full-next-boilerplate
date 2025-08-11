// کامپوننت نمایشی بلاک
import { PageBlock } from '../../types'
import { Header as HeaderType } from '@/features/header/interface'
import RendererRows from '@/components/builder-canvas/pageRenderer/RenderRows'

type HeaderProps = {
  header: HeaderType
  blockData: {
    id: string
    type: 'header'
    content: {
      headerId: string
    }
    settings: {}
  } & PageBlock
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const Header = ({ header, blockData, ...props }: HeaderProps) => {
  const { content, settings } = blockData
  const { className } = props

  return (
    <header {...props} className={`w-full z-50 ${className}`}>
      <RendererRows rows={header?.content?.rows} />
    </header>
  )
}
