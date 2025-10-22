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

const ArticleOverlayCard = ({ article, options }: Props) => {
  const locale = 'fa'
  const translationArticle: ArticleTranslationSchema =
    article?.translations?.find((t) => t.lang === locale) ||
    article?.translations[0] ||
    ({} as ArticleTranslationSchema)

  const translationImage: FileTranslationSchema =
    article.image?.translations?.find((t) => t.lang === locale) ||
    article.image?.translations[0] ||
    ({} as FileTranslationSchema)

  return (
    <div
      key={article.id}
      className="flex-shrink-0 basis-[85vw] sm:basis-[45vw] md:basis-[30vw] xl:basis-[23vw]  snap-start"
    >
      <Link href={article.href} className="hover:underline">
        <div className="relative h-48 rounded overflow-hidden shadow-lg group">
          {/* تصویر پس‌زمینه */}
          <Image
            src={article?.image.srcLarge || '/placeholder.png'}
            alt={translationImage?.alt || translationImage?.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 640px, (max-width: 768px) 768px, 1280px"
          />

          {/* لایه تاریک نیمه‌شفاف برای خوانایی متن */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

          {/* محتوای کارت روی تصویر */}
          <div className="absolute bottom-0 p-4 text-white">
            <h3 className="text-sm font-semibold mb-2 leading-5 line-clamp-2">
              {translationArticle?.title}
            </h3>

            {options?.showExcerpt !== false && (
              <p className="text-xs text-gray-200 line-clamp-2 mb-2 hidden md:block">
                {translationArticle?.excerpt}
              </p>
            )}

            <div className="flex items-center gap-4 text-[11px] text-gray-300">
              {article?.commentsCount && (
                <div className="flex items-center gap-1">
                  <MessageCircleMore width={14} /> {article?.commentsCount}
                </div>
              )}
              <div className="flex items-center gap-1">
                <CalendarPlus width={14} /> حدود {timeAgo(article?.createdAt)}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ArticleOverlayCard
