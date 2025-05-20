import { BreadCrumb } from '@/components/breadcrumb'
import { ScrollArea } from '@/components/ui/scroll-area'
import React from 'react'
import menuCtrl from '@/features/menu/controller'
import { notFound } from 'next/navigation'
import { MenuForm } from '@/features/menu/ui/menu-form'

type PageProps = {
  params: { id: string }
}
export default async function Page({ params }: PageProps) {
  let menu = null,
    allMenus
  let pageBreadCrumb = {
    title: 'افزودن',
    link: '/dashboard/menus/create',
  }
  if (params.id !== 'create') {
    const id = params.id
    ;[menu, allMenus] = await Promise.all([
      menuCtrl.findById({ id }),
      menuCtrl.findAll({}),
    ])

    if (!menu) {
      notFound()
    }
    pageBreadCrumb = {
      title: menu.title,
      link: `/dashboard/menus/${params.id}`,
    }
  } else {
    ;[allMenus] = await Promise.all([menuCtrl.findAll({})])
  }

  const breadcrumbItems = [
    { title: 'دسته ها', link: '/dashboard/menus' },
    pageBreadCrumb,
  ]
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <MenuForm initialData={menu} />
      </div>
    </ScrollArea>
  )
}
