import React from 'react'
import articleCtrl from '@/features/article/controller'
import { notFound } from 'next/navigation'
import { BreadCrumb } from '@/components/breadcrumb'
import { ArticleForm } from '@/features/article/ui/article-form'
import categoryCtrl from '@/features/category/controller'
import { ArticleTranslationSchema } from '@/features/article/interface'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const locale = 'fa' //  from formData
  const resolvedParams = await params
  const { id } = resolvedParams
  let article = null,
    allCategories = {}
  let pageBreadCrumb = {
    title: 'افزودن',
    link: '/dashboard/articles/create',
  }
  ;[allCategories] = await Promise.all([categoryCtrl.findAll({})])
  if (id !== 'create') {
    ;[article] = await Promise.all([articleCtrl.findById({ id })])

    if (!article) {
      notFound()
    }
    const translation: ArticleTranslationSchema =
      article?.translations?.find(
        (t: ArticleTranslationSchema) => t.lang === locale
      ) ||
      article?.translations[0] ||
      {}

    pageBreadCrumb = {
      title: translation?.title,
      link: `/dashboard/articles/${id}`,
    }
  }

  const breadcrumbItems = [
    { title: 'مقاله', link: '/dashboard/articles' },
    pageBreadCrumb,
  ]

  const defaultC = JSON.parse(
    '{"contentJson":{"type":"doc","content":[{"type":"paragraph","attrs":{"dir":"rtl","textAlign":null},"content":[{"type":"text","text":"سلام"}]},{"type":"paragraph","attrs":{"dir":"rtl","textAlign":null},"content":[{"type":"text","text":"s"}]},{"type":"paragraph","attrs":{"dir":"rtl","textAlign":"left"},"content":[{"type":"text","marks":[{"type":"bold"}],"text":"خوبی"}]}]}}'
  )
  console.log('defaultC:', defaultC)
  return (
    <>
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <ArticleForm initialData={article} allCategories={allCategories.data} />
      </div>
    </>
  )
}
