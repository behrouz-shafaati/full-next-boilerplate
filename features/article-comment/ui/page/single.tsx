import { BreadCrumb, BreadCrumbType } from '@/components/breadcrumb'
import RenderedHtml from '@/components/tiptap-editor/RenderedHtml'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  ArticleComment,
  ArticleCommentTranslationSchema,
} from '../../interface'
import Image from 'next/image'
import { formatToJalali, getReadingTime } from '@/features/article/utils'
import { getTranslation, timeAgo } from '@/lib/utils'

type props = {
  locale?: string
  breadcrumbItems: BreadCrumbType[]
  articleComment: ArticleComment
}

const SinglePageBlog = ({
  breadcrumbItems,
  articleComment,
  locale = 'fa',
}: props) => {
  const translation: ArticleCommentTranslationSchema = getTranslation({
    translations: articleComment?.translations,
  })
  const jalaliDate = formatToJalali(articleComment.createdAt)
  let imageCoverTranslation = {}
  // تبدیل contentJson به متن ساده
  const json = JSON.parse(translation?.contentJson)
  console.log('#3387 articleComment content: ', articleComment)
  const plainText =
    json.content
      ?.filter((block: any) => block.type === 'paragraph')
      ?.map((block: any) =>
        block.content?.map((c: any) => c.text || '').join('')
      )
      .join('\n') || ''

  const readingDuration = getReadingTime(plainText)
  if (articleComment?.image)
    imageCoverTranslation = getTranslation({
      translations: articleComment?.image?.translations,
    })
  return (
    <div className=" max-w-4xl m-auto text-justify">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>

      {articleComment?.image && (
        <div className="relative w-full aspect-[2/1] rounded-3xl overflow-hidden my-4">
          <Image
            src={articleComment?.image?.srcSmall}
            sizes="(max-width: 640px) 640px, (max-width: 768px) 768px, 1280px"
            alt={imageCoverTranslation?.alt}
            title={imageCoverTranslation?.title}
            fill
            className="object-contain"
          />
        </div>
      )}
      <h2>{translation?.title}</h2>
      <div className="text-sm text-gray-500 mb-4">
        {articleComment?.user && (
          <>
            <span>نویسنده: {articleComment?.user.name}</span>
            <span className="mx-2">|</span>
          </>
        )}
        <span>{timeAgo(articleComment.createdAt)}</span>
        <span className="mx-2">|</span>
        <span>زمان مطالعه: {readingDuration}</span>
      </div>
      <RenderedHtml contentJson={translation?.contentJson} />
    </div>
  )
}

export default SinglePageBlog
