import { Post, PostTranslationSchema } from '@/features/post/interface'
import { FileTranslationSchema } from '@/lib/entity/file/interface'
import { timeAgo } from '@/lib/utils'
import { CalendarPlus, MessageCircleMore } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

type Props = {
  post: Post
  options: {
    showExcerpt: boolean
  }
}

const PostOverlayCard = ({ post, options }: Props) => {
  const locale = 'fa'
  const translationPost: PostTranslationSchema =
    post?.translations?.find((t) => t.lang === locale) ||
    post?.translations[0] ||
    ({} as PostTranslationSchema)

  const translationImage: FileTranslationSchema =
    post.image?.translations?.find((t) => t.lang === locale) ||
    post.image?.translations[0] ||
    ({} as FileTranslationSchema)

  return (
    <div
      key={post.id}
      className="flex-shrink-0 basis-[85vw] sm:basis-[45vw] md:basis-[30vw] xl:basis-[23vw]  snap-start"
    >
      <Link href={post.href} className="hover:underline">
        <div className="relative h-48 rounded overflow-hidden shadow-lg group">
          {/* تصویر پس‌زمینه */}
          <Image
            src={post?.image.srcLarge || '/placeholder.png'}
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
              {translationPost?.title}
            </h3>

            {options?.showExcerpt !== false && (
              <p className="text-xs text-gray-200 line-clamp-2 mb-2 hidden md:block">
                {translationPost?.excerpt}
              </p>
            )}

            <div className="flex items-center gap-4 text-[11px] text-gray-300">
              {post?.commentsCount && (
                <div className="flex items-center gap-1">
                  <MessageCircleMore width={14} /> {post?.commentsCount}
                </div>
              )}
              <div className="flex items-center gap-1">
                <CalendarPlus width={14} /> حدود {timeAgo(post?.createdAt)}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default PostOverlayCard
