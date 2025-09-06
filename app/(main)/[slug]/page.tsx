export const dynamic = 'force-static'
import { PageRenderer } from '@/components/builder-canvas/pageRenderer'
import RendererRows from '@/components/builder-canvas/pageRenderer/RenderRows'
import categoryCtrl from '@/features/category/controller'
import CategoryPostList from '@/features/category/ui/component/CategoryPostList'
import pageCtrl from '@/features/page/controller'
import templateCtrl from '@/features/template/controller'
import { pickLocale, SUPPORTED_LANGUAGE } from '@/lib/utils'
import { redirect } from 'next/navigation'

export async function generateStaticParams() {
  const pageSlugs = await pageCtrl.getAllSlugs() // فرض کن فقط slug برمی‌گردونه
  const categorySlug = await categoryCtrl.getAllSlugs()
  return [...pageSlugs, ...categorySlug]
}

interface PageProps {
  params: { lang?: string; slug: string }
}

export default async function Page({ params }: PageProps) {
  const { lang, slug } = await params

  // زبان پیش‌فرض
  const locale = pickLocale(lang)

  const [pageResult] = await Promise.all([
    pageCtrl.find({ filters: { slug: slug } }),
  ])

  // this is a page
  if (pageResult?.data[0]) return <PageRenderer page={pageResult?.data[0]} />

  // this is a category. for example /computer-learning category
  const [template] = await Promise.all([templateCtrl.getTemplate({ slug })])
  if (template)
    return (
      <RendererRows
        rows={template?.content.rows}
        editroMode={false}
        content_all={<b>{slug} - tem</b>}
      />
    )

  return <CategoryPostList slug={slug} />
}
