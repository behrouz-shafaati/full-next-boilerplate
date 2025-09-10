// رندر کردن بلاک‌ها از روی JSON

import React from 'react'
import { Page } from '@/features/page/interface'
import RendererRows from './RenderRows'
import templateCtrl from '@/features/template/controller'

type Props = {
  locale: string
  page: Page
}

export const PageRenderer = async ({ page, locale = 'fa' }: Props) => {
  const translation: any =
    page?.translations?.find((t: any) => t.lang === locale) ||
    page?.translations[0] ||
    {}
  const { template: templateId } = translation.content
  if (templateId && templateId !== 'none') {
    const [template] = await Promise.all([
      templateCtrl.findById({ id: templateId }),
    ])
    return (
      <RendererRows
        rows={template.content.rows}
        editroMode={false}
        content_all={
          <RendererRows rows={translation?.content.rows} editroMode={false} />
        }
      />
    )
  }

  return (
    <>
      <RendererRows rows={translation?.content.rows} editroMode={false} />
    </>
  )
}
