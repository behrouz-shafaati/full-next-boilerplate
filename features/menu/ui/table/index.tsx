import { DataTable } from '@/components/ui/data-table'
import { Heading } from '@/components/ui/heading'
import { LinkButton } from '@/components/ui/link-button'
import MenuCtrl from '@/features/menu/controller'
import { Menu } from '@/features/menu/interface'
import { Plus } from 'lucide-react'
import { columns } from './columns'
import { QueryResponse } from '@/lib/entity/core/interface'
import GroupAction from './group-action'

interface CategoriesTableProps {
  query: string
  page: number
}

export default async function MenuTable({ query, page }: CategoriesTableProps) {
  const findResult: QueryResponse<Menu> = await MenuCtrl.find({
    filters: { query },
    pagination: { page, perPage: 6 },
  })

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`فهرست ها (${findResult?.totalDocuments || 0})`}
          description="مدیریت فهرست ها"
        />
        <LinkButton
          className="text-xs md:text-sm"
          href="/dashboard/menus/create"
        >
          <Plus className="ml-2 h-4 w-4" /> افزودن فهرست
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
