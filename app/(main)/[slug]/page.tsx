export const dynamic = 'force-static'
import { PageRenderer } from '@/components/builder-canvas/pageRenderer'
import categoryCtrl from '@/features/category/controller'
import pageCtrl from '@/features/page/controller'
import DefaultPageBlog from '@/features/post/ui/page'

export async function generateStaticParams() {
  const pageSlugs = await pageCtrl.getAllSlugs() // فرض کن فقط slug برمی‌گردونه
  const categorySlug = await categoryCtrl.getAllSlugs()
  return [...pageSlugs, ...categorySlug]
}

interface PageProps {
  params: { slug: string }
}

export default async function Page({ params }: PageProps) {
  const { slug } = params
  const [pageResult] = await Promise.all([
    pageCtrl.find({ filters: { slug: slug } }),
  ])

  // this is a page
  if (pageResult?.data[0]) return <PageRenderer page={pageResult?.data[0]} />

  // this is a category. for example /computer-learning category
  return <b>{slug}</b>
  return <PageCategoryRender slug={slug} />
}
