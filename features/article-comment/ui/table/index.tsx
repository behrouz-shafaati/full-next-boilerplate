import { DataTable } from '@/components/ui/data-table'
import { Heading } from '@/components/ui/heading'
import { LinkButton } from '@/components/ui/link-button'
import ArticleCommentCtrl from '@/features/article-comment/controller'
import { Plus } from 'lucide-react'
import { columns } from './columns'
import { QueryResponse } from '@/lib/entity/core/interface'
import GroupAction from './group-action'
import { ArticleComment } from '../../interface'
import { commentsUrl } from '../../utils'

interface ArticleCommentTableProps {
  filters: {
    query?: string
    article?: string
  }
  page?: number
}

export default async function ArticleCommentTable({
  filters,
  page = 1,
}: ArticleCommentTableProps) {
  const findResult: QueryResponse<ArticleComment> =
    await ArticleCommentCtrl.find(
      {
        filters,
        pagination: { page, perPage: 6 },
      },
      false
    )

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`دیدگاه ها (${findResult?.totalDocuments || 0})`}
          description="مدیریت مقاله ها"
        />
        {/* <LinkButton
          className="text-xs md:text-sm"
          href="/dashboard/article-comments/create"
        >
          <Plus className="ml-2 h-4 w-4" /> افزودن دیدگاه
        </LinkButton> */}
      </div>
      <DataTable
        searchTitle="جستجو ..."
        columns={columns}
        response={findResult}
        refetchDataUrl={commentsUrl}
        groupAction={GroupAction}
      />
    </>
  )
}
