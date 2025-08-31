// رندر کردن بلاک‌ها از روی JSON

import React from 'react'
import { Page } from '@/features/page/interface'
import RendererRows from './RenderRows'
import templateCtrl from '@/features/template/controller'

type Props = {
  page: Page
}

export const PageRenderer = async ({ page }: Props) => {
  const { template: templateId } = page.content
  if (templateId && templateId !== 'none') {
    const [template] = await Promise.all([
      templateCtrl.findById({ id: templateId }),
    ])
    return (
      <RendererRows
        rows={template.content.rows}
        editroMode={false}
        content_all={
          <RendererRows rows={page.content.rows} editroMode={false} />
        }
      />
    )
  }

  return (
    <>
      <RendererRows rows={page.content.rows} editroMode={false} />
    </>
  )
}
