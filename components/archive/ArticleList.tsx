import { Article } from '@/features/article/interface'
import ArticleListItem from './default/article-list-item'

type Prop = {
  articles: Article[]
}
export default function ArticleList({ articles }: Prop) {
  return (
    <>
      {articles.map((article: Article) => (
        <ArticleListItem key={article.id} article={article} />
      ))}
    </>
  )
}
