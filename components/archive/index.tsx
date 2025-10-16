import { getArticles } from '@/features/article/actions'
import articleCtrl from '@/features/article/controller'
import ArticleList from './ArticleList'

export default async function ArchiveArticle({
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
    const result = await articleCtrl.convertCategoriesAndTagSlugToId({
      categorySlugs,
      tagSlugs,
    })
    categoryIds = result.categoryIds
    tagIds = result.tagIds
  }
  const [result] = await Promise.all([
    getArticles({
      filters: { categories: categoryIds, tags: tagIds },
    }),
  ])
  const articles = result.data
  console.log('#24 result:', result)
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="block md:hidden col-span-4">filter mobile</div>
      <div className="hidden md:block">filter desktop</div>
      <div className="p-2 col-span-4 md:col-span-3 ">
        <ArticleList articles={articles} />
      </div>
    </div>
  )
}
