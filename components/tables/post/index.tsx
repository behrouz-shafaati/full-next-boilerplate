import { DataTable } from '@/components/ui/data-table'
import { Heading } from '@/components/ui/heading'
import { LinkButton } from '@/components/ui/link-button'
import CategoryCtrl from '@/lib/entity/category/controller'
import { Category } from '@/lib/entity/category/interface'
import { Plus } from 'lucide-react'
import { columns } from './columns'
import { QueryResponse } from '@/lib/entity/core/interface'
import { Role } from '@/lib/entity/role/interface'
import roleCtrl from '@/lib/entity/role/controller'
import GroupAction from './group-action'

interface CategoriesTableProps {
  query: string
  currentPage: number
}

export default async function PostTable({
  query,
  currentPage,
}: CategoriesTableProps) {
  const roles: Role[] = roleCtrl.getRoles()

  const findResult: QueryResponse<Category> = await CategoryCtrl.find({
    filters: { query },
    pagination: { page: currentPage, perPage: 6 },
  })

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`دسته بندی ها (${findResult?.totalDocuments || 0})`}
          description="مدیریت دسته بندی ها"
        />
        <LinkButton
          className="text-xs md:text-sm"
          href="/dashboard/posts/create"
        >
          <Plus className="ml-2 h-4 w-4" /> افزودن مقاله
        </LinkButton>
      </div>
      <DataTable
        searchTitle="جستجو ..."
        columns={columns}
        response={findResult}
        groupAction={GroupAction}
      />
    </>
  )
}
