import Link from 'next/link'
import Image from 'next/image'
import { timeAgo } from '@/lib/utils'

interface ArticleCardProps {
  article: {
    title: string
    excerpt: string
    slug: string
    link: string
    image?: {
      src: string
      alt?: string
    }
  }
}

export default function ArticleListItem({ article }: ArticleCardProps) {
  return (
    <Link
      href={`/${article.link}`} // یا `/articles/${article.slug}` اگر ساختار مسیر شما این شکلیه
      className="flex flex-row my-2  hover:bg-slate-50 dark:hover:bg-slate-900 transition duration-200  overflow-hidden"
    >
      <div className="aspect-video w-20 md:w-40 relative">
        {article.image?.srcSmall ? (
          <Image
            alt={article.image.alt || article.title}
            src={article.image.srcSmall}
            sizes="(max-width: 640px) 640px, (max-width: 768px) 768px, 1280px"
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-300 text-sm">
            بدون تصویر
          </div>
        )}
      </div>
      <div className="flex flex-col justify-between p-4 space-y-2">
        <div>
          <h2 className="text-base sm:text-lg font-semibold line-clamp-2">
            {article.title}
          </h2>
          <p className="hidden md:block text-sm text-gray-600 line-clamp-2">
            {article.excerpt}
          </p>
        </div>
        <div>
          <span className="text-xs text-gray-600">
            {timeAgo(article.createdAt)}
          </span>
        </div>
      </div>
    </Link>
  )
}
