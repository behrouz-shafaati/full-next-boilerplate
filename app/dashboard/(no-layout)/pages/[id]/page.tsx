import { ScrollArea } from '@/components/ui/scroll-area'
import React from 'react'
import pageCtrl from '@/features/page/controller'
import { notFound } from 'next/navigation'
import { PageForm } from '@/features/page/ui/page-form'
import categoryCtrl from '@/features/category/controller'

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
    ;[page, allTemplates, allCategories] = await Promise.all([
      pageCtrl.findById({ id }),
      pageCtrl.findAll({ filters: { type: 'template' } }),
      categoryCtrl.findAll({}),
    ])

    if (!page) {
      notFound()
    }
    pageBreadCrumb = {
      title: page.title,
      link: `/dashboard/pages/${id}`,
    }
  } else {
    ;[allTemplates, allCategories] = await Promise.all([
      pageCtrl.findAll({ filters: { type: 'template' } }),
      categoryCtrl.findAll({}),
    ])
  }
  return (
    <ScrollArea className="h-full">
      <div className="">
        <PageForm
          initialData={page}
          allTemplates={allTemplates.data}
          allCategories={allCategories.data}
        />
      </div>
    </ScrollArea>
  )
}
