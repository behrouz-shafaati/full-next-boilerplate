export const dynamic = 'force-static'
import { PageRenderer } from '@/components/builder-canvas/pageRenderer'
import RendererRows from '@/components/builder-canvas/pageRenderer/RenderRows'
import CategoryPostList from '@/features/category/ui/component/CategoryPostList'
import pageCtrl from '@/features/page/controller'
import templateCtrl from '@/features/template/controller'
import { pickLocale, SUPPORTED_LANGUAGE } from '@/lib/utils'

export async function generateStaticParams() {
  return pageCtrl.generateStaticParams()
}

interface PageProps {
  params: { lang?: string; slug: string }
}

export default async function Page({ params }: PageProps) {
  const { lang = 'fa', slug: encodeSlug } = await params
  const slug = decodeURIComponent(encodeSlug)

  // زبان پیش‌فرض
  const locale = pickLocale(lang)

  const [pageResult] = await Promise.all([
    pageCtrl.find({ filters: { slug: slug } }),
  ])

  // this is a page
  if (pageResult?.data[0])
    return <PageRenderer page={pageResult?.data[0]} locale={locale} />

  // this is a category. for example /computer-learning category
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
