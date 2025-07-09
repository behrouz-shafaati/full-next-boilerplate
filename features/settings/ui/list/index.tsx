import PostCtrl from '@/features/post/controller'
import { QueryResponse } from '@/lib/entity/core/interface'
import { Post } from '../../interface'
import PostCard from '../card'
import Pagination from '@/components/ui/pagination'

interface PostTableProps {
  query: string
  page: number
}

export default async function PostList({ query, page }: PostTableProps) {
  const findResult: QueryResponse<Post> = await PostCtrl.find({
    filters: { query },
    pagination: { page, perPage: 6 },
  })
  console.log('#276 findResult:', findResult)
  return (
    <>
      <div className="aspect-[4/1] text-center flex items-center justify-center flex-col bg-slate-50 dark:bg-slate-900 rounded-2xl my-4">
        <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
          مقالات
        </h1>
        <span className="text-muted-foreground mt-4 border-t p-4">{`${
          findResult?.totalDocuments || 0
        } مقاله`}</span>
      </div>
      <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
        {findResult.data.map((post: Post) => {
          return <PostCard key={post.id} post={post} />
        })}
      </div>
      <div className="space-x-reverse space-x-2 text-center my-4">
        <Pagination totalPages={findResult.totalPages} />
      </div>
    </>
  )
}
