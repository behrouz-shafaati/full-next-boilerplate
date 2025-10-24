import { DataTable } from '@/components/ui/data-table'
import { Heading } from '@/components/ui/heading'
import { LinkButton } from '@/components/ui/link-button'
import ArticleCtrl from '@/features/article/controller'
import { Plus } from 'lucide-react'
import { columns } from './columns'
import { QueryResponse } from '@/lib/entity/core/interface'
import GroupAction from './group-action'
import { Article } from '../../interface'
import { articleUrl } from '../../utils'
import { getSession } from '@/lib/auth'
import { User } from '@/features/user/interface'
import { can } from '@/lib/utils/can.server'

interface ArticleTableProps {
  filters: {
    query?: string
  }
  page: number
}

export default async function ArticleTable({
  filters,
  page,
}: ArticleTableProps) {
  const user = (await getSession())?.user as User
  if (!(await can(user.roles, 'article.view.any', false))) {
    filters = { ...filters, author: user.id }
  }

  const canCreate = await can(user.roles, 'article.create', false)

  const findResult: QueryResponse<Article> = await ArticleCtrl.find({
    filters,
    pagination: { page, perPage: 6 },
  })

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`مقاله ها (${findResult?.totalDocuments || 0})`}
          description="مدیریت مقاله ها"
        />
        {canCreate && (
          <LinkButton
            className="text-xs md:text-sm"
            href="/dashboard/articles/create"
          >
            <Plus className="ml-2 h-4 w-4" /> افزودن مقاله
          </LinkButton>
        )}
      </div>
      <DataTable
        searchTitle="جستجو ..."
        columns={columns}
        response={findResult}
        refetchDataUrl={articleUrl}
        groupAction={GroupAction}
      />
    </>
  )
}
