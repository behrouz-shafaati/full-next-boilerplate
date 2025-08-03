import React from 'react'
import postCtrl from '@/features/post/controller'
import { notFound } from 'next/navigation'
import DefaultSinglePageBlog from '@/features/post/ui/page/single'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params
  const { slug } = resolvedParams
  let findResult = null

  ;[findResult] = await Promise.all([
    postCtrl.find({ filters: { slug: decodeURIComponent(slug) } }),
  ])
  const post = findResult?.data[0] || null
  if (!post) {
    notFound()
  }
  let pageBreadCrumb = {
    title: post.title,
    link: `/blog/${post.slug}`,
  }
  console.log('#234 post:', post)
  const breadcrumbItems = [{ title: 'بلاگ', link: '/blog' }, pageBreadCrumb]
  return <DefaultSinglePageBlog post={post} breadcrumbItems={breadcrumbItems} />
}
