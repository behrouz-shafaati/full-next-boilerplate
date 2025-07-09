import { BreadCrumb, BreadCrumbType } from '@/components/breadcrumb'
import RenderedHtml from '@/components/tiptap-editor/RenderedHtml'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Post } from '../../interface'
import Image from 'next/image'
import { formatToJalali, getReadingTime } from '../../utils'

type props = {
  breadcrumbItems: BreadCrumbType[]
  post: Post
}

const SinglePageBlog = ({ breadcrumbItems, post }: props) => {
  const jalaliDate = formatToJalali(post.createdAt)
  // تبدیل contentJson به متن ساده
  const json = JSON.parse(post.contentJson)
  console.log('#3387 post content: ', json)
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
          />
        </div>
      )}
      <h2>{post.title}</h2>
      <div className="text-sm text-gray-500 mb-4">
        {post?.user && (
          <>
            <span>نویسنده: {post?.user.name}</span>
            <span className="mx-2">|</span>
          </>
        )}
        <span>تاریخ: {jalaliDate}</span>
        <span className="mx-2">|</span>
        <span>زمان مطالعه: {readingDuration}</span>
      </div>
      <RenderedHtml contentJson={post.contentJson} />
    </div>
  )
}

export default SinglePageBlog
