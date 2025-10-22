import { DataTable } from '@/components/ui/data-table'
import { Heading } from '@/components/ui/heading'
import ArticleCommentCtrl from '@/features/article-comment/controller'
import { columns } from './table/columns'
import { QueryResponse } from '@/lib/entity/core/interface'
import { ArticleComment } from '../interface'
import { commentsUrl } from '../utils'
import { LinkButton } from '@/components/ui/link-button'

interface ArticleCommentTableProps {
  refetchDataUrl?: string
  filters: {
    status?: 'pending' | 'approved' | 'rejected'
    query?: string
    article?: string
  }
  page?: number
}

export default async function LastArticleComments({
  refetchDataUrl = commentsUrl,
  filters,
  page = 1,
}: ArticleCommentTableProps) {
  const findResult: QueryResponse<ArticleComment> =
    await ArticleCommentCtrl.find(
      {
        filters,
        pagination: { page, perPage: 4 },
      },
      false
    )

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title={`نظرات منتظر`} description="" />
      </div>
      {findResult?.totalDocuments ? (
        <>
          <DataTable
            searchTitle="جستجو ..."
            columns={columns}
            response={findResult}
            refetchDataUrl={refetchDataUrl}
            showSearch={false}
            showFilters={false}
            showPagination={false}
            showGroupAction={false}
          />
          <LinkButton
            className="text-xs md:text-sm"
            href="/dashboard/article-comments?page=1&status=pending"
          >
            بیشتر
          </LinkButton>
        </>
      ) : (
        <div className="flex text-center text-lg justify-center h-full items-center ">
          همه‌ی نظرات پاسخ داده شدن 🎉
        </div>
      )}
    </>
  )
}
