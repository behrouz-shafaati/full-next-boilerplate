export const dynamic = 'force-static'
import React from 'react'
import templateCtrl from '@/features/template/controller'
import RendererRows from '@/components/builder-canvas/pageRenderer/RenderRows'

import type { Metadata } from 'next'
import CategoryPostList from '@/features/category/ui/component/CategoryPostList'
import categoryCtrl from '@/features/category/controller'
import { buildCategoryHref } from '@/features/category/utils'
import { getTranslation } from '@/lib/utils'
import { Category } from '@/features/category/interface'

interface PageProps {
  params: Promise<{ slugs: string[] }>
}

export async function generateStaticParams() {
  return categoryCtrl.generateStaticParams()
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const locale = 'fa'
  const resolvedParams = await params
  const { slugs } = resolvedParams
  const slug = decodeURIComponent(slugs[slugs.length - 1])
  let findResult = null

  ;[findResult] = await Promise.all([
    categoryCtrl.find({ filters: { slug: slug } }),
  ])
  const category: Category = findResult?.data[0] || null
  if (!category) {
    return {
      title: 'دسته یافت نشد',
      description: 'دسته‌ی درخواستی موجود نیست',
    }
  }
  const href = buildCategoryHref(category)
  const translation = getTranslation({ translations: category?.translations })

  return {
    title: translation?.title,
    description: translation?.excerpt,
    openGraph: {
      title: translation?.title,
      description: translation?.excerpt,
      url: href,
    },
  }
}

export default async function Page({ params }: PageProps) {
  const locale = 'fa'
  const resolvedParams = await params
  const { slugs } = resolvedParams
  const slug = decodeURIComponent(slugs[slugs.length - 1])
  const [template] = await Promise.all([templateCtrl.getTemplate({ slug })])
  if (template)
    return (
      <RendererRows
        rows={template?.content.rows}
        editroMode={false}
        content_all={<CategoryPostList slug={slug} />}
      />
    )

  return <CategoryPostList slug={slug} />
}
