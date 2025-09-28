export const dynamic = 'force-static'
import React from 'react'
import postCtrl from '@/features/post/controller'
import { notFound } from 'next/navigation'
import DefaultSinglePageBlog from '@/features/post/ui/page/single'
import templateCtrl from '@/features/template/controller'
import RendererRows from '@/components/builder-canvas/pageRenderer/RenderRows'
import { PostTranslationSchema } from '@/features/post/interface'
import { createPostHref, getReadingTime } from '@/features/post/utils'

import type { Metadata } from 'next'
import RenderedHtml from '@/components/tiptap-editor/RenderedHtml'
import { generateTableOfContents } from '@/components/tiptap-editor/utils'
import { TableOfContents } from '@/components/tiptap-editor/component/TableOfContents'
import PostCommentList from '@/features/post-comment/ui/list'
import { QueryResponse } from '@/lib/entity/core/interface'
import { PostComment } from '@/features/post-comment/interface'
import { getPostCommentsForClient } from '@/features/post-comment/actions'
import { CommentForm } from '@/features/post-comment/ui/comment-form'

interface PageProps {
  params: Promise<{ slugs: string[] }>
}

export async function generateStaticParams() {
  return postCtrl.generateStaticParams()
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const locale = 'fa'
  const resolvedParams = await params
  const { slugs } = resolvedParams
  const slug = slugs[slugs.length - 1]
  let findResult = null

  ;[findResult] = await Promise.all([
    postCtrl.find({ filters: { slug: decodeURIComponent(slug) } }),
  ])
  const post = findResult?.data[0] || null
  if (!post) {
    return {
      title: 'صفحه یافت نشد',
      description: 'محتوای درخواستی موجود نیست',
    }
  }
  const href = createPostHref(post.mainCategory)
  const translation: PostTranslationSchema =
    post?.translations?.find((t: PostTranslationSchema) => t.lang === locale) ||
    post?.translations[0] ||
    {}

  return {
    title: translation?.title,
    description: translation?.excerpt,
    openGraph: {
      title: translation?.title,
      description: translation?.excerpt,
      url: href,
    },
  }
}

export default async function Page({ params }: PageProps) {
  const locale = 'fa'
  const resolvedParams = await params
  const { slugs } = resolvedParams
  const slug = slugs[slugs.length - 1]
  let findResult = null

  ;[findResult] = await Promise.all([
    postCtrl.find({ filters: { slug: decodeURIComponent(slug) } }),
  ])
  const post = findResult?.data[0] || null
  if (!post) {
    notFound()
  }

  const postCommentsResult: QueryResponse<PostComment> =
    await getPostCommentsForClient({
      filters: { post: post.id },
    })

  const href = createPostHref(post.mainCategory)
  const translation: PostTranslationSchema =
    post?.translations?.find((t: PostTranslationSchema) => t.lang === locale) ||
    post?.translations[0] ||
    {}

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

  let pageBreadCrumb = {
    title: translation?.title,
    link: href,
  }

  const metadata = {
    author: post?.user,
    createdAt: post.createdAt,
    readingDuration,
  }

  // ساخت TOC سمت سرور
  const toc = generateTableOfContents(JSON.parse(translation?.contentJson))

  const breadcrumbItems = [{ title: 'بلاگ', link: '/blog' }, pageBreadCrumb]
  const [template] = await Promise.all([
    templateCtrl.getTemplate({ slug: 'post' }),
  ])
  if (template)
    return (
      <RendererRows
        rows={template?.content.rows}
        editroMode={false}
        content_all={
          <DefaultSinglePageBlog
            post={post}
            breadcrumbItems={breadcrumbItems}
            readingDuration={readingDuration}
          />
        }
        content_post_title={translation?.title}
        content_post_cover={post?.image ?? null}
        content_post_metadata={metadata}
        content_post_content={
          <RenderedHtml contentJson={translation?.contentJson} />
        }
        content_post_tablecontent={<TableOfContents toc={toc} />}
        content_post_comments={
          <PostCommentList
            post={post}
            postCommentsResult={postCommentsResult}
          />
        }
        content_post_comment_form={<CommentForm initialData={post} />}
      />
    )

  return (
    <DefaultSinglePageBlog
      post={post}
      breadcrumbItems={breadcrumbItems}
      readingDuration={readingDuration}
      tableOfContent={<TableOfContents toc={toc} />}
      comments={
        <PostCommentList post={post} postCommentsResult={postCommentsResult} />
      }
    />
  )
}
