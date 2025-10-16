import ArticleCtrl from '@/features/article/controller'
import { QueryResponse } from '@/lib/entity/core/interface'
import { Article } from '../../interface'
import ArticleCard from '../card'
import Pagination from '@/components/ui/pagination'

interface ArticleTableProps {
  query: string
  page: number
}

export default async function ArticleList({ query, page }: ArticleTableProps) {
  const findResult: QueryResponse<Article> = await ArticleCtrl.find({
    filters: { query },
    pagination: { page, perPage: 6 },
  })
  console.log('#276 findResult:', findResult)
  return (
    <>
      <div className="columns-1 sm:columns-5 md:columns-5 gap-4 space-y-4 m-4">
        {findResult.data.map((article: Article) => {
          return <ArticleCard key={article.id} article={article} />
        })}
      </div>
      <div className="space-x-reverse space-x-2 text-center my-4">
        <Pagination totalPages={findResult.totalPages} />
      </div>
    </>
  )
}
