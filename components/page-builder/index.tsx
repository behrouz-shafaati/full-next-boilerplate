// ورودی اصلی صفحه‌ساز (ترکیب درگ‌اند‌دراپ و بلاک رندر)
'use client'
import dynamic from 'next/dynamic'
import { PageContent } from './types'
import { Category } from '@/features/category/interface'

const Builder = dynamic(() => import('./components/Builder'), {
  ssr: false, // مهم: جلوگیری از رندر سمت سرور
})

type PageBuilderProp = {
  name: string
  submitFormHandler: any
  initialContent?: PageContent
  allTemplates: PageContent[]
  allCategories: Category[]
}

export default function PageBuilder({
  initialContent,
  name,
  submitFormHandler,
  allTemplates,
  allCategories,
}: PageBuilderProp) {
  return (
    <Builder
      name={name}
      submitFormHandler={submitFormHandler}
      initialContent={initialContent}
      allTemplates={allTemplates}
      allCategories={allCategories}
    />
  )
}
