import { Article, ArticleTranslationSchema } from '../../interface'
import VerticalCard from './VerticalCard'
import HorizontalCard from './HorizontalCard'
import { createArticleHref } from '../../utils'

type Props = {
  locale?: string
  article: Article
  variant?: 'Horizon' | 'Vertical'
}

const ArticleCard = ({
  article,
  variant = 'Vertical',
  locale = 'fa',
}: Props) => {
  const translation: ArticleTranslationSchema =
    article?.translations?.find(
      (t: ArticleTranslationSchema) => t.lang === locale
    ) ||
    article?.translations[0] ||
    {}
  const cardProps = {
    imageUrl: article?.image?.srcSmall,
    title: translation?.title,
    excerpt: translation?.excerpt,
    slug: article.slug,
    href: createArticleHref(article),
  }
  return variant === 'Horizon' ? (
    <HorizontalCard {...cardProps} />
  ) : (
    <VerticalCard {...cardProps} />
  )
}

export default ArticleCard
