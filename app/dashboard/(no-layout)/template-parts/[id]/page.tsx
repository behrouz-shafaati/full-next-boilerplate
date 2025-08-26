import { ScrollArea } from '@/components/ui/scroll-area'
import React from 'react'
import { notFound } from 'next/navigation'
import { Form } from '@/features/template-part/ui/form'
import templatePartCtrl from '@/features/template-part/controller'

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
    link: '/dashboard/templates/create',
  }
  if (id !== 'create') {
    ;[page] = await Promise.all([templatePartCtrl.findById({ id })])

    if (!page) {
      notFound()
    }
    pageBreadCrumb = {
      title: page.title,
      link: `/dashboard/templates/${id}`,
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
