// رندر کردن بلاک‌ها از روی JSON

import React from 'react'
import { Page } from '@/features/page/interface'
import RendererRows from './RenderRows'

type Props = {
  page: Page
}

export const PageRenderer = ({ page }: Props) => {
  return (
    <>
      <RendererRows rows={page.content.rows} editroMode={false} />
    </>
  )
}
