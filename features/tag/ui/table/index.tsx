import { DataTable } from '@/components/ui/data-table'
import { Heading } from '@/components/ui/heading'
import { LinkButton } from '@/components/ui/link-button'
import TagCtrl from '../../controller'
import { Tag } from '../../interface'
import { Plus } from 'lucide-react'
import { columns } from './columns'
import { QueryResponse } from '@/lib/entity/core/interface'
import GroupAction from './group-action'

interface TagsTableProps {
  query: string
  page: number
}

export default async function TagTable({ query, page }: TagsTableProps) {
  const findResult: QueryResponse<Tag> = await TagCtrl.find({
    filters: { query },
    pagination: { page, perPage: 6 },
  })
  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`برچسب ها (${findResult?.totalDocuments || 0})`}
          description="مدیریت برچسب ها"
        />
        <LinkButton
          className="text-xs md:text-sm"
          href="/dashboard/tags/create"
        >
          <Plus className="ml-2 h-4 w-4" /> افزودن برچسب
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
