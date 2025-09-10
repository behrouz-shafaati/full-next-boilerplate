export const dynamic = 'force-static'
import React from 'react'
import postCtrl from '@/features/post/controller'
import { notFound } from 'next/navigation'
import DefaultSinglePageBlog from '@/features/post/ui/page/single'
import templateCtrl from '@/features/template/controller'
import RendererRows from '@/components/builder-canvas/pageRenderer/RenderRows'
import { PostTranslationSchema } from '@/features/post/interface'

export async function generateStaticParams() {
  return postCtrl.generateStaticParams()
}

interface PageProps {
  params: Promise<{ slug: string; postSlug: string }>
}

export default async function Page({ params }: PageProps) {
  const locale = 'fa'
  const resolvedParams = await params
  const { slug: categorySlug, postSlug: slug } = resolvedParams
  let findResult = null

  ;[findResult] = await Promise.all([
    postCtrl.find({ filters: { slug: decodeURIComponent(slug) } }),
  ])
  const post = findResult?.data[0] || null
  if (!post) {
    notFound()
  }

  const translation: PostTranslationSchema =
    post?.translations?.find((t: PostTranslationSchema) => t.lang === locale) ||
    post?.translations[0] ||
    {}

  let pageBreadCrumb = {
    title: translation?.title,
    link: `/blog/${post.slug}`,
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
