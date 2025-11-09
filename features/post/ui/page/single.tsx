'use server'
import { BreadCrumbType } from '@/components/breadcrumb'
import RenderedHtml from '@/components/tiptap-editor/render/RenderedHtml.server'
import { Post, PostTranslationSchema } from '../../interface'
import { getTranslation, timeAgo } from '@/lib/utils'
import { PostCover } from '@/components/post/cover'
import { PostBreadcrumb } from '@/components/post/breadcrumb'
import { PostComments } from '@/components/post/comments'
import { PostCommentForm } from '@/components/post/comment-form'
import { PostContent } from '@/components/post/content'
import { PostMetaData } from '@/components/post/meta-data'
import { PostTitle } from '@/components/post/title'

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
      <PostBreadcrumb content={breadcrumbItems} />

      {post?.image && (
        <PostCover
          file={post?.image}
          postType={post?.type ?? null}
          primaryVideoEmbedUrl={post?.primaryVideoEmbedUrl ?? null}
        />
      )}
      <PostTitle title={translation?.title} />
      <PostMetaData
        author={post?.user}
        createdAt={post.createdAt}
        readingDuration={readingDuration}
      />
      {tableOfContent}
      <PostContent
        content={<RenderedHtml contentJson={translation?.contentJson} />}
      />
      <div>
        <PostComments content={comments} />
        <PostCommentForm post={post} />
      </div>
    </div>
  )
}

export default SinglePageBlog
