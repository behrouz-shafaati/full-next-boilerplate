import { DataTable } from '@/components/ui/data-table'
import { Heading } from '@/components/ui/heading'
import { LinkButton } from '@/components/ui/link-button'
import ArticleCtrl from '@/features/article/controller'
import { Plus } from 'lucide-react'
import { columns } from './table/columns'
import { QueryResponse } from '@/lib/entity/core/interface'
import { Article } from '../interface'

interface ArticleTableProps {
  query: string
  page: number
}

export default async function LastArticles({ query, page }: ArticleTableProps) {
  const findResult: QueryResponse<Article> = await ArticleCtrl.find({
    filters: { query },
    pagination: { page, perPage: 6 },
  })

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title={`آخرین مقالات`} description="" />
        <LinkButton
          className="text-xs md:text-sm"
          href="/dashboard/articles/create"
        >
          <Plus className="ml-2 h-4 w-4" /> افزودن مقاله
        </LinkButton>
      </div>
      <DataTable
        searchTitle="جستجو ..."
        columns={columns}
        response={findResult}
        showFilters={false}
        showPagination={false}
        showSearch={false}
        showGroupAction={false}
      />
    </>
  )
}
