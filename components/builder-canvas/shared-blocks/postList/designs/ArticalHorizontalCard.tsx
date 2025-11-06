import { Separator } from '@/components/ui/separator'
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

const PostHorizontalCard = ({ post, options }: Props) => {
  const locale = 'fa'
  const translationPost: PostTranslationSchema =
    post?.translations?.find((t: PostTranslationSchema) => t.lang === locale) ||
    post?.translations[0] ||
    {}

  const translationImage: FileTranslationSchema =
    post.image?.translations?.find(
      (t: FileTranslationSchema) => t.lang === locale
    ) ||
    post.image?.translations[0] ||
    {}
  return (
    <Link key={post.id} href={post.href}>
      <div className="grid grid-cols-[1fr_7rem] md:grid-cols-[1fr_200px] items-center md:items-start border-b py-2 gap-2">
        {/* عنوان و توضیح */}
        <div className="p-2">
          <h3 className="text-sm font-semibold mb-1 leading-5 min-h-[2.5rem] line-clamp-2">
            {translationPost?.title}
          </h3>
          {options?.showExcerpt != false && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 m-0 hidden md:block">
              {translationPost?.excerpt}
            </p>
          )}
        </div>

        {/* تصویر */}
        <div className="relative w-full h-full min-h-28 aspect-square md:aspect-[4/3] md:row-span-2 overflow-hidden rounded-sm">
          <Image
            src={post?.image?.srcSmall || '/placeholder.png'}
            alt={translationImage?.alt || translationImage?.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 112px, (max-width: 768px) 200px, 300px"
          />
        </div>

        {/* اطلاعات پایین (تاریخ و دیدگاه) */}
        <div className="flex text-xs h-full text-gray-400 gap-4 md:col-start-1 md:self-end px-2">
          {post?.commentsCount && (
            <>
              <div className="flex items-center gap-1">
                {/* <MessageCircleMore width={14} /> {post.commentsCount} */}
                {post?.commentsCount} دیدگاه
              </div>
              <Separator orientation="vertical" />
            </>
          )}
          <div className="flex items-center gap-1">
            {/* <CalendarPlus width={14} /> حدود {timeAgo(post?.createdAt)} */}
            حدود {timeAgo(post?.createdAt)}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default PostHorizontalCard
