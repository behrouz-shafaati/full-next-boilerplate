// پس من اصلا از اول باید بجای export const dynamic = 'force-static' export const dynamic = 'auto' میزاشتم. اصلا دنبال همین بودم. چون من تو کدم یهو گفتم تمام صفحات revalidate بشن اما چون از export const dynamic = 'force-static' در همون لحظه میخاسته همه رو بسازه و کش کنه که سیستم میترکیده. اما همینو اگکه بکنم export const dynamic = 'auto' و اعلام کنم همه revalidate شدن دیگه در همون لحظه همه رو نمیسازه و کش نمیکنه.

// export const dynamic = 'auto'
export const dynamic = 'force-static'
// export const dynamic = 'force-dynamic'

import React from 'react'
import articleCtrl from '@/features/article/controller'
import { notFound } from 'next/navigation'
import DefaultSinglePageBlog from '@/features/article/ui/page/single'
import templateCtrl from '@/features/template/controller'
import RendererRows from '@/components/builder-canvas/pageRenderer/RenderRows'
import { Article, ArticleTranslationSchema } from '@/features/article/interface'
import {
  createArticleHref,
  generateFAQSchema,
  generateArticleSchema,
  getReadingTime,
  buildBreadcrumbsArray,
} from '@/features/article/utils'

import type { Metadata } from 'next'
import RenderedHtml from '@/components/tiptap-editor/render/RenderedHtml.server'
import { generateTableOfContents } from '@/components/tiptap-editor/utils'
import { TableOfContents } from '@/components/tiptap-editor/component/TableOfContents'
import ArticleCommentList from '@/features/article-comment/ui/list'
import { QueryResponse } from '@/lib/entity/core/interface'
import { ArticleComment } from '@/features/article-comment/interface'
import { getArticleCommentsForClient } from '@/features/article-comment/actions'
import { CommentForm } from '@/features/article-comment/ui/comment-form'
import { getSettings } from '@/features/settings/controller'

interface PageProps {
  params: Promise<{ slugs: string[] }>
}

// export async function generateStaticParams() {
//   return articleCtrl.generateStaticParams()
// }

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const locale = 'fa'
  const resolvedParams = await params
  const { slugs } = resolvedParams
  const slug = slugs[slugs.length - 1]
  let findResult = null
  const siteTitle = (await getSettings('site_title')) as string
  ;[findResult] = await Promise.all([
    articleCtrl.find({ filters: { slug: decodeURIComponent(slug) } }),
  ])
  const article: Article = findResult?.data[0] || null
  if (!article || article == undefined) {
    return {
      title: 'صفحه یافت نشد',
      description: 'محتوای درخواستی موجود نیست',
    }
  }
  const href = createArticleHref(article.mainCategory)
  const translation: ArticleTranslationSchema =
    article?.translations?.find(
      (t: ArticleTranslationSchema) => t.lang === locale
    ) ||
    article?.translations[0] ||
    {}

  return {
    title: translation?.seoTitle || translation.title,
    description: translation?.metaDescription || translation?.excerpt,
    alternates: {
      canonical: href,
    },
    openGraph: {
      locale: 'fa_IR', // 👈 زبان/منطقه
      type: 'article',
      title: translation?.seoTitle || translation.title,
      description: translation?.metaDescription || translation?.excerpt,
      url: href,
      siteName: siteTitle,
      images: [
        {
          url: article?.image?.srcSmall,
          width: 600,
          height: 315,
          alt: translation?.seoTitle || translation.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: translation?.seoTitle || translation.title,
      description: translation?.metaDescription || translation?.excerpt,
      images: [article?.image?.srcSmall],
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
    articleCtrl.find({ filters: { slug: decodeURIComponent(slug) } }),
  ])
  const article = findResult?.data[0] || null
  if (!article) {
    notFound()
  }

  const articleCommentsResult: QueryResponse<ArticleComment> =
    await getArticleCommentsForClient({
      filters: { article: article.id },
    })

  const href = createArticleHref(article.mainCategory)
  const translation: ArticleTranslationSchema =
    article?.translations?.find(
      (t: ArticleTranslationSchema) => t.lang === locale
    ) ||
    article?.translations[0] ||
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

  const metadata = {
    author: article?.user,
    createdAt: article.createdAt,
    readingDuration,
  }

  // ساخت TOC سمت سرور
  const toc = generateTableOfContents(JSON.parse(translation?.contentJson))
  const breadcrumbItems = buildBreadcrumbsArray(article)
  const [template, siteSettings] = await Promise.all([
    templateCtrl.getTemplate({ slug: 'article' }),
    getSettings(),
  ])

  const articleSchema = generateArticleSchema({ article, locale: 'fa' })
  const faqSchema = generateFAQSchema(translation.contentJson)

  const writeJsonLd = () => (
    <>
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      )}

      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {translation?.jsonLd && translation?.jsonLd == '' && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: translation?.jsonLd }}
        />
      )}
    </>
  )
  if (article.status !== 'published')
    return (
      <div className="h-screen w-full flex justify-center items-center align-middle">
        مقاله هنوز منتشر نشده است!
      </div>
    )
  if (template)
    return (
      <>
        {writeJsonLd()}
        <>
          <RendererRows
            siteSettings={siteSettings}
            rows={template?.content.rows}
            editroMode={false}
            content_all={
              <DefaultSinglePageBlog
                article={article}
                breadcrumbItems={breadcrumbItems}
                readingDuration={readingDuration}
                tableOfContent={<TableOfContents toc={toc} />}
                comments={
                  <ArticleCommentList
                    article={article}
                    articleCommentsResult={articleCommentsResult}
                  />
                }
              />
            }
            content_article_title={translation?.title}
            content_article_cover={article?.image ?? null}
            content_article_metadata={metadata}
            content_article_breadcrumb={breadcrumbItems}
            content_article_content={
              <RenderedHtml contentJson={translation?.contentJson} />
            }
            content_article_tablecontent={<TableOfContents toc={toc} />}
            content_article_comments={
              <ArticleCommentList
                article={article}
                articleCommentsResult={articleCommentsResult}
              />
            }
            content_article_comment_form={<CommentForm initialData={article} />}
          />
        </>
      </>
    )

  return (
    <>
      {writeJsonLd()}
      <>
        <DefaultSinglePageBlog
          article={article}
          breadcrumbItems={breadcrumbItems}
          readingDuration={readingDuration}
          tableOfContent={<TableOfContents toc={toc} />}
          comments={
            <ArticleCommentList
              article={article}
              articleCommentsResult={articleCommentsResult}
            />
          }
        />
      </>
    </>
  )
}
