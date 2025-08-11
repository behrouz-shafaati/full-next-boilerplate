'use client'
// کامپوننت نمایشی بلاک
import React, { useEffect, useState } from 'react'
import { PageBlock } from '../../types'
import { Header } from './Header'
import { getHeaders } from '@/features/header/actions'

type HeaderBlockEditorProps = {
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

export default function HeaderBlockEditor({
  blockData,
  ...props
}: HeaderBlockEditorProps) {
  const [header, setHeader] = useState({ content: { rows: [] } })
  const { content } = blockData

  useEffect(() => {
    const fetchData = async () => {
      const [result] = await Promise.all([
        getHeaders({
          filters: { id: content?.headerId },
        }),
      ])
      setHeader(result.data[0])
      console.log('#89782345 result.data:', result.data[0])
    }

    fetchData()
  }, [content])
  return <Header header={header} blockData={blockData} {...props} />
}
