import { ScrollArea } from '@/components/ui/scroll-area'
import React from 'react'
import templateCtrl from '@/features/template/controller'
import { notFound } from 'next/navigation'
import { Form } from '@/features/template/ui/form'
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
    link: '/dashboard/templates/create',
  }

  if (id !== 'create') {
    ;[page, allCategories] = await Promise.all([
      templateCtrl.findById({ id }),
      categoryCtrl.findAll({}),
    ])
    if (!page) {
      notFound()
    }
    pageBreadCrumb = {
      title: page.title,
      link: `/dashboard/templates/${id}`,
    }
  } else {
    ;[allCategories] = await Promise.all([categoryCtrl.findAll({})])
  }

  return (
    <>
      <Form initialData={page} allCategories={allCategories.data} />
    </>
  )
}
