import { getPosts } from '@/features/post/actions'
import postCtrl from '@/features/post/controller'
import PostCard from './default/post-list-item'
import { Post } from '@/features/post/interface'
import PostList from './PostList'

export default async function ArchivePost({
  categoryIds = [],
  tagIds = [],
  categorySlugs = [],
  tagSlugs = [],
}: {
  categoryIds?: string[]
  tagIds?: string[]
  categorySlugs?: string[]
  tagSlugs?: string[]
}) {
  if (categorySlugs.length || tagSlugs.length) {
    const result = await postCtrl.convertCategoriesAndTagSlugToId({
      categorySlugs,
      tagSlugs,
    })
    categoryIds = result.categoryIds
    tagIds = result.tagIds
  }
  const [result] = await Promise.all([
    getPosts({
      filters: { categories: categoryIds, tags: tagIds },
    }),
  ])
  const posts = result.data
  console.log('#24 result:', result)
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="block md:hidden col-span-4">filter mobile</div>
      <div className="hidden md:block">filter desktop</div>
      <div className="p-2 col-span-4 md:col-span-3 ">
        <PostList posts={posts} />
      </div>
    </div>
  )
}
