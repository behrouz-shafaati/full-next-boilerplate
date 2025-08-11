import { ScrollArea } from '@/components/ui/scroll-area'
import React from 'react'
import headerCtrl from '@/features/header/controller'
import { notFound } from 'next/navigation'
import { Form } from '@/features/header/ui/form'

interface PageProps {
  params: Promise<{ id: string }>
}
export default async function Page({ params }: PageProps) {
  const resolvedParams = await params
  const { id } = resolvedParams
  let page = null,
    allTemplates,
    allCategories
  let pageBreadCrumb = {
    title: 'افزودن',
    link: '/dashboard/pages/create',
  }
  if (id !== 'create') {
    ;[page] = await Promise.all([headerCtrl.findById({ id })])

    if (!page) {
      notFound()
    }
    pageBreadCrumb = {
      title: page.title,
      link: `/dashboard/pages/${id}`,
    }
  }
  return (
    <ScrollArea className="h-full">
      <div className="">
        <Form initialData={page} />
      </div>
    </ScrollArea>
  )
}
