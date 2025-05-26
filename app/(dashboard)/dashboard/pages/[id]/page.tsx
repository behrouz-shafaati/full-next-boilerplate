import { BreadCrumb } from '@/components/breadcrumb'
import { ScrollArea } from '@/components/ui/scroll-area'
import React from 'react'
import pageCtrl from '@/features/page/controller'
import { notFound } from 'next/navigation'
import { PageForm } from '@/features/page/ui/page-form'

interface PageProps {
  params: Promise<{ id: string }>
}
export default async function Page({ params }: PageProps) {
  const resolvedParams = await params
  const { id } = resolvedParams

  let page = null,
    allPages
  let pageBreadCrumb = {
    title: 'افزودن',
    link: '/dashboard/pages/create',
  }
  if (id !== 'create') {
    ;[page, allPages] = await Promise.all([
      pageCtrl.findById({ id }),
      pageCtrl.findAll({}),
    ])

    if (!page) {
      notFound()
    }
    pageBreadCrumb = {
      title: page.title,
      link: `/dashboard/pages/${id}`,
    }
  } else {
    ;[allPages] = await Promise.all([pageCtrl.findAll({})])
  }

  const breadcrumbItems = [
    { title: 'دسته ها', link: '/dashboard/pages' },
    pageBreadCrumb,
  ]
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <PageForm initialData={page} />
      </div>
    </ScrollArea>
  )
}
