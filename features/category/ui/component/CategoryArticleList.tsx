import { getArticles } from '@/features/article/actions'
import categoryCtrl from '../../controller'
import ArticleList from '@/components/archive/ArticleList'

type Prop = {
  slug: string
}
export default async function CategoryArticleList({ slug }: Prop) {
  const category = await categoryCtrl.find({ filters: { slug } })
  console.log('#2134 category:', category)
  if (category.data.length == 0) return <>دسته ی مورد نظر یافت نشد!</>
  const [articlesResult] = await Promise.all([
    getArticles({
      filters: { categories: [category.data[0].id] },
    }),
  ])

  if (articlesResult.data.length == 0)
    return <>هیچ مقاله ای با این دسته بندی ثبت نشده است!</>
  return <ArticleList articles={articlesResult.data} />
}
