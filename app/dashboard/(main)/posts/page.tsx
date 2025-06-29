import { BreadCrumb } from '@/components/breadcrumb'
import PostTable from '@/features/post/ui/table'
const breadcrumbItems = [{ title: 'مطالب', link: '/dashboard/categories' }]

interface PageProps {
  searchParams: Promise<{
    query?: string
    page?: string
  }>
}

async function Page({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams
  const { query = '', page = '1' } = resolvedSearchParams

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <PostTable query={query} page={Number(page)} />
    </div>
  )
}

export default Page
