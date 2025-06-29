import React from 'react'
import postCtrl from '@/features/post/controller'
import { notFound } from 'next/navigation'
import { ScrollArea } from '@/components/ui/scroll-area'
import { BreadCrumb } from '@/components/breadcrumb'
import { slugify } from '@/features/post/utils'
import RenderedHtml from '@/components/tiptap-editor/RenderedHtml'

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

  const breadcrumbItems = [{ title: 'بلاگ', link: '/blog' }, pageBreadCrumb]
  return (
    <ScrollArea className="h-full max-w-4xl m-auto text-justify">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>
      <RenderedHtml contentJson={post.contentJson} />
    </ScrollArea>
  )
}
