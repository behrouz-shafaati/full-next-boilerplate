import { DataTable } from '@/components/ui/data-table'
import { Heading } from '@/components/ui/heading'
import { LinkButton } from '@/components/ui/link-button'
import templateCtrl from '@/features/template/controller'
import { Template } from '@/features/template/interface'
import { Plus } from 'lucide-react'
import { columns } from './columns'
import { QueryResponse } from '@/lib/entity/core/interface'
import GroupAction from './group-action'

interface CategoriesTableProps {
  query: string
  page: number
}

export default async function TemplateTable({
  query,
  page,
}: CategoriesTableProps) {
  const findResult: QueryResponse<Template> = await templateCtrl.find({
    filters: { query },
    pagination: { page, perPage: 6 },
  })

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`قالب ها (${findResult?.totalDocuments || 0})`}
          description="مدیریت قالب ها"
        />
        <LinkButton
          className="text-xs md:text-sm"
          href="/dashboard/templates/create"
        >
          <Plus className="ml-2 h-4 w-4" /> افزودن قالب
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
