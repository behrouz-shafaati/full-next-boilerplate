'use server'
import { BreadCrumb, BreadCrumbType } from '@/components/breadcrumb'
import RenderedHtml from '@/components/tiptap-editor/render/RenderedHtml.server'
import { Post, PostTranslationSchema } from '../../interface'
import { getTranslation, timeAgo } from '@/lib/utils'
import { CommentForm } from '@/features/post-comment/ui/comment-form'
import { ImageAlba } from '@/components/image-alba'

type props = {
  locale?: string
  breadcrumbItems: BreadCrumbType[]
  post: Post
  readingDuration: number
  tableOfContent: any
  comments: any
}

const SinglePageBlog = async ({
  breadcrumbItems,
  post,
  locale = 'fa',
  readingDuration,
  tableOfContent,
  comments,
}: props) => {
  const translation: PostTranslationSchema = getTranslation({
    translations: post?.translations,
  })

  return (
    <div className=" max-w-4xl m-auto text-justify p-2">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>

      {post?.image && <ImageAlba file={post?.image} showCaption={false} />}
      <h1 className="text-base">{translation?.title}</h1>
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
      {tableOfContent}
      <post>
        <RenderedHtml contentJson={translation?.contentJson} />
      </post>
      <div>
        {comments}
        <CommentForm initialData={post} />
      </div>
    </div>
  )
}

export default SinglePageBlog
