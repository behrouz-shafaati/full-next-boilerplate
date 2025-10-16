import { BreadCrumb } from '@/components/breadcrumb'
import ArticleCommentTable from '@/features/article-comment/ui/table'
const breadcrumbItems = [{ title: 'دیدگاه', link: '/dashboard/categories' }]

interface PageProps {
  searchParams: Promise<{
    query?: string
    page?: string
    article?: string
  }>
}

async function Page({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams
  const { page = '1', ...filters } = resolvedSearchParams

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <ArticleCommentTable filters={filters} page={Number(page)} />
    </div>
  )
}

export default Page
