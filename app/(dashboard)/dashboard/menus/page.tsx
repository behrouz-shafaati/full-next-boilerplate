import { BreadCrumb } from '@/components/breadcrumb'
import MenuTable from '@/features/menu/ui/table'
const breadcrumbItems = [{ title: 'فهرست ها', link: '/dashboard/menus' }]

interface PageProps {
  searchParams?: {
    query?: string
    page?: string
  }
}

const Page: React.FC<PageProps> = ({ searchParams }) => {
  const query = searchParams?.query || ''
  const currentPage = Number(searchParams?.page) || 1

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <MenuTable query={query} currentPage={currentPage} />
    </div>
  )
}

export default Page
