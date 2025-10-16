'use server'

import { z } from 'zod'
import articleCtrl from '@/features/article/controller'
import { redirect } from 'next/navigation'
import { createArticleHref, extractExcerptFromContentJson } from './utils'
import { getSession } from '@/lib/auth'
import { Option, Session, State } from '@/types'
import tagCtrl from '../tag/controller'
import { QueryFind, QueryResult } from '@/lib/entity/core/interface'
import { Article, ArticleTranslationSchema } from './interface'
import categoryCtrl from '../category/controller'
import revalidatePathCtrl from '@/lib/revalidatePathCtrl'
import { revalidatePath } from 'next/cache'

const FormSchema = z.object({
  title: z.string({}).min(1, { message: 'لطفا عنوان را وارد کنید.' }),
  seoTitle: z.string({}).min(1, { message: 'لطفا عنوان را وارد کنید.' }),
  contentJson: z.string({}),
  metaDescription: z.string({}),
  lang: z.string({}),
  status: z.string({}),
  mainCategory: z
    .string({})
    .min(1, { message: 'لطفا دسته‌ی اصلی را مشخص کنید.' }),
  categories: z.string({}),
  slug: z.string({}),
  tags: z.string({}),
  jsonLd: z.string().nullable(),
  image: z.string().nullable(),
})

/**
 * Creates a article with the given form data.
 *
 * @param prevState - The previous state.
 * @param formData - The form data.
 * @returns An object with errors and a message if there are any, or redirects to the article dashboard.
 */
export async function createArticle(prevState: State, formData: FormData) {
  // Validate form fields
  let newArticle = null
  const rawValues = Object.fromEntries(formData.entries())
  const values = {
    ...rawValues,
    translation: {
      lang: rawValues?.lang || 'fa',
      title: rawValues?.title || '',
      contentJson: rawValues.contentJson || '',
    },
  }
  const validatedFields = FormSchema.safeParse(
    Object.fromEntries(formData.entries())
  )
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'لطفا فیلدهای لازم را پر کنید.',
      success: false,
      values,
    }
  }

  try {
    const params = await sanitizeArticleData(validatedFields)
    const cleanedParams = await articleCtrl.generateUniqueArticleSlug(params)
    const mainCategory = await categoryCtrl.findById({
      id: cleanedParams.mainCategory,
    })
    newArticle = await articleCtrl.create({
      params: cleanedParams,
    })
    const article = await articleCtrl.findById({ id: newArticle.id })
    // Revalidate the path
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'article',
      slug: [createArticleHref(article as Article), `/dashboard/articles`],
    })

    for (const slug of pathes) {
      // این تابع باید یا در همین فایل سرور اکشن یا از طریق api فراخوانی شود. پس محلش نباید تغییر کند.
      revalidatePath(slug)
    }
  } catch (error) {
    console.log('#error in create article:', error)
    // Handle database error
    if (error instanceof z.ZodError) {
      return {
        errors: error.flatten().fieldErrors,
        values,
      }
    }
    return {
      message: 'خطای پایگاه داده: ایجاد مقاله ناموفق بود.',
      success: false,
      values,
    }
  }
  if (newArticle) redirect(encodeURI(`/dashboard/articles/${newArticle.id}`))
  else redirect(`/dashboard/articles`)
}

export async function updateArticle(
  id: string,
  prevState: State,
  formData: FormData
) {
  let updatedArticle = {}
  const rawValues = Object.fromEntries(formData.entries())
  const values = {
    ...rawValues,
    translation: {
      lang: rawValues?.lang || 'fa',
      title: rawValues?.title || '',
      contentJson: rawValues.contentJson || '',
    },
  }
  const validatedFields = FormSchema.safeParse(
    Object.fromEntries(formData.entries())
  )
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'لطفا فیلدهای لازم را پر کنید.',
      success: false,
      values,
    }
  }
  try {
    const params = await sanitizeArticleData(validatedFields, id)
    const cleanedParams = await articleCtrl.generateUniqueArticleSlug(
      params,
      id
    )
    const mainCategory = await categoryCtrl.findById({
      id: cleanedParams.mainCategory,
    })
    updatedArticle = await articleCtrl.findOneAndUpdate({
      filters: id,
      params: cleanedParams,
    })
    // Revalidate the path
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'article',
      slug: [
        createArticleHref(updatedArticle as Article),
        `/dashboard/articles`,
      ],
    })

    for (const slug of pathes) {
      // این تابع باید یا در همین فایل سرور اکشن یا از طریق api فراخوانی شود. پس محلش نباید تغییر کند.
      revalidatePath(slug)
    }
    return { message: 'فایل با موفقیت بروز رسانی شد', success: true, values }
  } catch (error) {
    return {
      message: 'خطای پایگاه داده: بروزرسانی مقاله ناموفق بود.',
      success: false,
      values: updatedArticle,
    }
  }
}

export async function deleteArticle(id: string) {
  try {
    await articleCtrl.delete({ filters: [id] })
  } catch (error) {
    return { message: 'خطای پایگاه داده: حذف مقاله ناموفق بود', success: false }
  }
  await articleCtrl.delete({ filters: [id] })
  // Revalidate the path
  const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
    feature: 'article',
    slug: [`/dashboard/articles`],
  })

  for (const slug of pathes) {
    // این تابع باید یا در همین فایل سرور اکشن یا از طریق api فراخوانی شود. پس محلش نباید تغییر کند.
    revalidatePath(slug)
  }
}

async function sanitizeArticleData(
  validatedFields: any,
  id?: string | undefined
) {
  let prevState = { translations: [] }
  if (id) {
    prevState = await articleCtrl.findById({ id })
    console.log('#prevState 098776 :', prevState)
  }
  const session = (await getSession()) as Session
  // Create the article
  const articlePayload = validatedFields.data
  const tagsArray: Option[] = JSON.parse(articlePayload?.tags || '[]')

  // for multi categories select
  // const categoriesArray: Option[] = JSON.parse(articlePayload?.categories || '[]')
  const excerpt = extractExcerptFromContentJson(articlePayload.contentJson, 25)
  const image = articlePayload.image
    ? articlePayload.image == ''
      ? null
      : articlePayload.image
    : null
  const user = session.user.id
  const contentJson = await articleCtrl.setFileData(articlePayload.contentJson)
  // CHECK IF TAG DOES'T EXIST CREATE IT
  const tags = await tagCtrl.ensureTagsExist(tagsArray)
  const categories = JSON.parse(articlePayload?.categories)

  // for multi categories select
  // const categories: string[] = await categoryCtrl.ensureCategoryExist(
  //   categoriesArray
  // )
  console.log(
    '#29386457832 JSON.parse(articlePayload?.categories):',
    JSON.parse(articlePayload?.categories)
  )
  const translations = [
    {
      lang: articlePayload.lang,
      title: articlePayload.title,
      seoTitle: articlePayload.seoTitle,
      metaDescription: articlePayload.metaDescription,
      excerpt,
      contentJson: JSON.stringify(contentJson),
      readingTime: articlePayload.readingTime,
      jsonLd: articlePayload.jsonLd,
    },
    ...prevState.translations.filter(
      (t: ArticleTranslationSchema) => t.lang != articlePayload.lang
    ),
  ]
  const categoriesId = categories.map((cat: Option) => cat.value)
  if (!categoriesId.includes(articlePayload.mainCategory))
    categoriesId.push(articlePayload.mainCategory)
  const params = {
    ...articlePayload,
    translations,
    tags,
    categories: categoriesId,
    image,
    user,
    author: user,
    ...(articlePayload.status == 'published'
      ? { publishedAt: new Date() }
      : {}),
  }

  return params
}

export async function getArticles(payload: QueryFind): Promise<QueryResult> {
  const filters: Record<string, any> = { ...(payload.filters ?? {}) }

  if (!Array.isArray(filters.categories) || filters.categories.length === 0) {
    delete filters.categories
  }

  if (!Array.isArray(filters.tags) || filters.tags.length === 0) {
    delete filters.tags
  }

  return articleCtrl.find({
    ...payload,
    filters,
  })
}
