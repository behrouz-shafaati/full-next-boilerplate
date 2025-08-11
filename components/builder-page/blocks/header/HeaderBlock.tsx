// کامپوننت نمایشی بلاک
import React from 'react'
import { PageBlock } from '../../types'
import { Header } from './Header'
import { getHeaders } from '@/features/header/actions'

type HeaderBlockProps = {
  blockData: {
    id: string
    type: 'header'
    content: {
      headerId: string
    }
    settings: {
      stickyHeader: boolean
    }
  } & PageBlock
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export default async function HeaderBlock({
  blockData,
  ...props
}: HeaderBlockProps) {
  const { content } = blockData
  const [result] = await Promise.all([
    getHeaders({
      filters: { id: content?.headerId },
    }),
  ])
  const header = result.data[0]
  return <Header header={header} blockData={blockData} {...props} />
}
