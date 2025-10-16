import { Article, ArticleTranslationSchema } from '@/features/article/interface'
import { FileTranslationSchema } from '@/lib/entity/file/interface'
import { timeAgo } from '@/lib/utils'
import { CalendarPlus, MessageCircleMore } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

type Props = {
  article: Article
  options: {
    showExcerpt: boolean
  }
}

const ArticleImageCard = ({ article, options }: Props) => {
  const locale = 'fa'
  const translationArticle: ArticleTranslationSchema =
    article?.translations?.find(
      (t: ArticleTranslationSchema) => t.lang === locale
    ) ||
    article?.translations[0] ||
    {}

  const translationImage: FileTranslationSchema =
    article.image?.translations?.find(
      (t: FileTranslationSchema) => t.lang === locale
    ) ||
    article.image?.translations[0] ||
    {}
  return (
    <div
      key={article.id}
      className="flex-shrink-0 basis-[85vw] sm:basis-[45vw] md:basis-[30vw] xl:basis-[23vw] snap-start"
    >
      <div className="rounded overflow-hidden shadow-lg bg-white dark:bg-gray-900">
        <div className="relative w-full h-52">
          <Image
            src={article?.image.srcSmall || '/placeholder.png'}
            sizes="(max-width: 640px) 640px, (max-width: 768px) 768px, 1280px"
            alt={translationImage?.alt || translationImage?.title}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-sm font-semibold mb-2 leading-5 min-h-[2.5rem] line-clamp-2">
            <Link href={article.href}>{translationArticle?.title}</Link>
          </h3>
          {options?.showExcerpt != false && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
              {translationArticle?.excerpt}
            </p>
          )}
          <div className="flex mt-3 text-xs text-gray-400 gap-4">
            <div className="flex flex-row gap-1 items-center">
              <MessageCircleMore width={16} /> {article.commentsCount}
            </div>
            <div className="flex flex-row gap-1 items-center">
              <CalendarPlus width={16} /> حدود {timeAgo(article?.createdAt)}
            </div>
          </div>
          {/* <div className="mt-3 text-xs text-gray-400">
              توسط {article.author?.name}
            </div> */}
        </div>
      </div>
    </div>
  )
}

export default ArticleImageCard
