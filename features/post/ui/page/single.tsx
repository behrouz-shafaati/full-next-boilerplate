'use server'
import { BreadCrumb, BreadCrumbType } from '@/components/breadcrumb'
import RenderedHtml from '@/components/tiptap-editor/RenderedHtml'
import { Post, PostTranslationSchema } from '../../interface'
import Image from 'next/image'
import { formatToJalali, getReadingTime } from '../../utils'
import { getTranslation, timeAgo } from '@/lib/utils'
import PostCommentList from '@/features/post-comment/ui/list'
import { QueryResponse } from '@/lib/entity/core/interface'
import { PostComment } from '@/features/post-comment/interface'
import { getPostCommentsForClient } from '@/features/post-comment/actions'

type props = {
  locale?: string
  breadcrumbItems: BreadCrumbType[]
  post: Post
}

const SinglePageBlog = async ({
  breadcrumbItems,
  post,
  locale = 'fa',
}: props) => {
  const translation: PostTranslationSchema = getTranslation({
    translations: post?.translations,
  })
  const jalaliDate = formatToJalali(post.createdAt)
  let imageCoverTranslation = {}
  // تبدیل contentJson به متن ساده
  const json = JSON.parse(translation?.contentJson)
  const plainText =
    json.content
      ?.filter((block: any) => block.type === 'paragraph')
      ?.map((block: any) =>
        block.content?.map((c: any) => c.text || '').join('')
      )
      .join('\n') || ''

  const readingDuration = getReadingTime(plainText)
  if (post?.image)
    imageCoverTranslation = getTranslation({
      translations: post?.image?.translations,
    })

  const postCommentsResult: QueryResponse<PostComment> =
    await getPostCommentsForClient({
      filters: { post: post.id },
    })
  return (
    <div className=" max-w-4xl m-auto text-justify">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>

      {post?.image && (
        <div className="relative w-full aspect-[2/1] rounded-3xl overflow-hidden my-4">
          <Image
            src={post?.image?.src}
            alt={imageCoverTranslation?.alt}
            title={imageCoverTranslation?.title}
            fill
            // className="object-contain"
            className="object-cover"
            priority
            quality={70}
            sizes="(max-width: 640px) 100vw, 
           (max-width: 1024px) 80vw, 
           (max-width: 1536px) 1080px, 
           1920px"
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

      <PostCommentList post={post} postCommentsResult={postCommentsResult} />
    </div>
  )
}

export default SinglePageBlog
