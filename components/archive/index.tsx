import { getArticles } from '@/features/article/actions'
import { getAllCategories } from '@/features/category/actions'
import { DesktopFilters } from './DesktopFilters'
import { getAllTags } from '@/features/tag/actions'
import { Option } from '@/types'
import { getTranslation } from '@/lib/utils'
import ArticleHorizontalCard from '../builder-canvas/shared-blocks/ArticleList/designs/ArticalHorizontalCard'
import { MobileFilters } from './MobileFilters'
import Pagination from '../ui/pagination'
import { getSettings } from '@/features/settings/controller'

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
  let defaultSelectedCategories: Option[] = []
  let defaultSelectedTags: Option[] = []
  if (categorySlugs.length || tagSlugs.length) {
    const [defaultCategoriesResult, defaultTagsResult] = await Promise.all([
      getAllCategories({ slug: { $in: categorySlugs } }),
      getAllTags({ slug: { $in: tagSlugs } }),
    ])
    categoryIds = defaultCategoriesResult.data.map((cat: any) => cat.id)
    tagIds = defaultTagsResult.data.map((tag: any) => tag.id)

    defaultSelectedCategories = defaultCategoriesResult.data.map(
      (cat: any) => ({
        label: getTranslation({ translations: cat.translations })?.title,
        value: String(cat.slug),
      })
    )
    defaultSelectedTags = defaultTagsResult.data.map((tag: any) => ({
      label: getTranslation({ translations: tag.translations })?.title,
      value: String(tag.slug),
    }))
  }
  const [siteSettings, result, allCategories, allTags] = await Promise.all([
    getSettings(),
    getArticles({
      filters: { categories: categoryIds, tags: tagIds },
    }),
    getAllCategories(),
    getAllTags(),
  ])
  const articles = result.data
  const articleItems = articles.map((article) => {
    return (
      <ArticleHorizontalCard
        key={article.id}
        article={article}
        options={{ showExcerpt: true }}
      />
    )
  })
  console.log('#24 siteSettings:', siteSettings?.desktopHeaderHeight)
  return (
    <div className="grid grid-cols-4 gap-4 relative">
      <div
        className={`block sticky  px-4 py-2  md:hidden col-span-4 bg-slate-50 dark:bg-slate-950 z-10`}
        style={{ top: `${siteSettings?.mobileHeaderHeight}px` }}
      >
        <MobileFilters
          allCategories={allCategories}
          allTags={allTags}
          defaultSelectedCategories={defaultSelectedCategories}
          defaultSelectedTags={defaultSelectedTags}
        />
      </div>
      <div className="hidden md:block">
        <DesktopFilters
          siteSettings={siteSettings}
          allCategories={allCategories}
          allTags={allTags}
          defaultSelectedCategories={defaultSelectedCategories}
          defaultSelectedTags={defaultSelectedTags}
        />
      </div>
      <div className="p-2 col-span-4 md:col-span-3 ">
        <div>{articleItems}</div>
        <div className="p-4 flex justify-center items-center">
          <Pagination totalPages={result.totalPages} />
        </div>
      </div>
    </div>
  )
}
