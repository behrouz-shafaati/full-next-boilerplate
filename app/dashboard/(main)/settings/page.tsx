import { ScrollArea } from '@/components/ui/scroll-area'
import React from 'react'
import pageCtrl from '@/features/page/controller'
import { notFound } from 'next/navigation'
import { PageForm } from '@/features/page/ui/page-form'
import categoryCtrl from '@/features/category/controller'
import { SettingsForm } from '@/features/settings/ui/settings-form'
import settingsCtrl from '@/features/settings/controller'
import { BreadCrumb } from '@/components/breadcrumb'

interface PageProps {
  params: Promise<{ id: string }>
}
export default async function Page({ params }: PageProps) {
  const resolvedParams = await params
  const { id } = resolvedParams
  let settings = null,
    allPages
  let pageBreadCrumb = [
    {
      title: 'تنظیمات',
      link: '/dashboard',
    },
  ]

  ;[settings, allPages] = await Promise.all([
    settingsCtrl.findOne({ filters: { type: 'site-settings' } }),
    pageCtrl.findAll({ filters: { type: 'page' } }),
  ])

  return (
    <ScrollArea className="h-full p-4 md:p-8 pt-6">
      <div className="">
        <BreadCrumb items={pageBreadCrumb} />
        <SettingsForm settings={settings} allPages={allPages.data} />
      </div>
    </ScrollArea>
  )
}
