import React, { useState } from 'react'
import TiptapEditor from '@/components/tiptap-editor'
import postCtrl from '@/lib/entity/post/controller'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params
  const { id } = resolvedParams
  let pageBreadCrumb = {
    title: 'افزودن',
    link: '/dashboard/post/create',
  }

  if (id !== 'create') {
    const [post] = await Promise.all([postCtrl.findById({ id })])

    if (!post) {
      notFound()
    }
    pageBreadCrumb = {
      title: post.title,
      link: `/dashboard/posts/${id}`,
    }
  }

  const defaultC = JSON.parse(
    '{"contentJson":{"type":"doc","content":[{"type":"paragraph","attrs":{"dir":"rtl","textAlign":null},"content":[{"type":"text","text":"سلام"}]},{"type":"paragraph","attrs":{"dir":"rtl","textAlign":null},"content":[{"type":"text","text":"s"}]},{"type":"paragraph","attrs":{"dir":"rtl","textAlign":"left"},"content":[{"type":"text","marks":[{"type":"bold"}],"text":"خوبی"}]}]}}'
  )
  console.log('defaultC:', defaultC)
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">ویرایشگر متن</h1>
      <TiptapEditor name="content" defaultContent={defaultC.contentJson} />
    </div>
  )
}
