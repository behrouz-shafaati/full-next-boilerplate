import { BreadCrumb, BreadCrumbType } from '@/components/breadcrumb'
import RenderedHtml from '@/components/tiptap-editor/RenderedHtml'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Post, PostTranslationSchema } from '../../interface'
import Image from 'next/image'
import { formatToJalali, getReadingTime, timeAgo } from '../../utils'

type props = {
  locale?: string
  breadcrumbItems: BreadCrumbType[]
  post: Post
}

const SinglePageBlog = ({ breadcrumbItems, post, locale = 'fa' }: props) => {
  const translation: PostTranslationSchema =
    post?.translations?.find((t: PostTranslationSchema) => t.lang === locale) ||
    post?.translations[0] ||
    {}
  const jalaliDate = formatToJalali(post.createdAt)
  // تبدیل contentJson به متن ساده
  const json = JSON.parse(translation?.contentJson)
  console.log('#3387 post content: ', post)
  const plainText =
    json.content
      ?.filter((block: any) => block.type === 'paragraph')
      ?.map((block: any) =>
        block.content?.map((c: any) => c.text || '').join('')
      )
      .join('\n') || ''

  const readingDuration = getReadingTime(plainText)
  return (
    <div className=" max-w-4xl m-auto text-justify">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>

      {post?.image && (
        <div className="relative w-full aspect-[2/1] rounded-3xl overflow-hidden my-4">
          <Image
            src={post?.image?.src}
            alt={post?.image?.alt}
            fill
            className="object-contain"
            unoptimized
          />
        </div>
      )}
      <h2>{translation?.title}</h2>
      <div className="text-sm text-gray-500 mb-4">
        {post?.user && (
          <>
            <span>نویسنده: {post?.user.name}</span>
            <span className="mx-2">|</span>
          </>
        )}
        <span>{timeAgo(post.createdAt)}</span>
        <span className="mx-2">|</span>
        <span>زمان مطالعه: {readingDuration}</span>
      </div>
      <RenderedHtml contentJson={translation?.contentJson} />
    </div>
  )
}

export default SinglePageBlog
