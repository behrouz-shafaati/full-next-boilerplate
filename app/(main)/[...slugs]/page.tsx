export const dynamic = 'force-static'
import React from 'react'
import postCtrl from '@/features/post/controller'
import { notFound } from 'next/navigation'
import DefaultSinglePageBlog from '@/features/post/ui/page/single'
import templateCtrl from '@/features/template/controller'
import RendererRows from '@/components/builder-canvas/pageRenderer/RenderRows'
import { PostTranslationSchema } from '@/features/post/interface'
import { createPostHref } from '@/features/post/utils'

import type { Metadata } from 'next'

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
  const href = createPostHref(post.mainCategory)
  const translation: PostTranslationSchema =
    post?.translations?.find((t: PostTranslationSchema) => t.lang === locale) ||
    post?.translations[0] ||
    {}

  let pageBreadCrumb = {
    title: translation?.title,
    link: href,
  }

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
          />
        }
      />
    )

  return <DefaultSinglePageBlog post={post} breadcrumbItems={breadcrumbItems} />
}
