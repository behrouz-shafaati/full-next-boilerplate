'use server'
import { BreadCrumb, BreadCrumbType } from '@/components/breadcrumb'
import RenderedHtml from '@/components/tiptap-editor/render/RenderedHtml.server'
import { Article, ArticleTranslationSchema } from '../../interface'
import { getTranslation, timeAgo } from '@/lib/utils'
import { CommentForm } from '@/features/article-comment/ui/comment-form'
import { ImageAlba } from '@/components/image-alba'

type props = {
  locale?: string
  breadcrumbItems: BreadCrumbType[]
  article: Article
  readingDuration: number
  tableOfContent: any
  comments: any
}

const SinglePageBlog = async ({
  breadcrumbItems,
  article,
  locale = 'fa',
  readingDuration,
  tableOfContent,
  comments,
}: props) => {
  const translation: ArticleTranslationSchema = getTranslation({
    translations: article?.translations,
  })

  return (
    <div className=" max-w-4xl m-auto text-justify p-2">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>

      {article?.image && (
        <ImageAlba file={article?.image} showCaption={false} />
      )}
      <h1 className="text-base">{translation?.title}</h1>
      <div className="text-sm text-gray-500 mb-4">
        {article?.user && (
          <>
            <span>نویسنده: {article?.user.name}</span>
            <span className="mx-2">|</span>
          </>
        )}
        <span>{timeAgo(article.createdAt)}</span>
        <span className="mx-2">|</span>
        <span>زمان مطالعه: {readingDuration}</span>
      </div>
      {tableOfContent}
      <article>
        <RenderedHtml contentJson={translation?.contentJson} />
      </article>
      <div>
        {comments}
        <CommentForm initialData={article} />
      </div>
    </div>
  )
}

export default SinglePageBlog
