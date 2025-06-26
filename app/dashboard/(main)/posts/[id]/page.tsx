import React, { useState } from 'react'
import TiptapEditor from '@/components/tiptap-editor'
import postCtrl from '@/features/post/controller'
import { notFound } from 'next/navigation'
import { ScrollArea } from '@/components/ui/scroll-area'
import { BreadCrumb } from '@/components/breadcrumb'
import { PostForm } from '@/features/post/ui/post-form'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params
  const { id } = resolvedParams
  let post = null
  let pageBreadCrumb = {
    title: 'افزودن',
    link: '/dashboard/posts/create',
  }

  if (id !== 'create') {
    ;[post] = await Promise.all([postCtrl.findById({ id })])

    if (!post) {
      notFound()
    }
    pageBreadCrumb = {
      title: post.title,
      link: `/dashboard/posts/${id}`,
    }
  }

  const breadcrumbItems = [
    { title: 'پست', link: '/dashboard/posts' },
    pageBreadCrumb,
  ]

  const defaultC = JSON.parse(
    '{"contentJson":{"type":"doc","content":[{"type":"paragraph","attrs":{"dir":"rtl","textAlign":null},"content":[{"type":"text","text":"سلام"}]},{"type":"paragraph","attrs":{"dir":"rtl","textAlign":null},"content":[{"type":"text","text":"s"}]},{"type":"paragraph","attrs":{"dir":"rtl","textAlign":"left"},"content":[{"type":"text","marks":[{"type":"bold"}],"text":"خوبی"}]}]}}'
  )
  console.log('defaultC:', defaultC)
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <PostForm
          initialData={{ ...post, contentJson: defaultC.contentJson }}
        />
      </div>
    </ScrollArea>
  )
}
