'use server'

import { z } from 'zod'
import postCtrl from '@/features/post/controller'
import { redirect } from 'next/navigation'
import {
  extractExcerptFromContentJson,
  generateExcerpt,
  generateUniquePostSlug,
} from './utils'
import { getSession } from '@/lib/auth'
import { Option, Session, State } from '@/types'
import tagCtrl from '../tag/controller'
import { QueryFind, QueryResult } from '@/lib/entity/core/interface'
import { PostTranslationSchema } from './interface'
import categoryCtrl from '../category/controller'
import revalidatePathCtrl from '@/lib/revalidatePathCtrl'

const FormSchema = z.object({
  title: z.string({}).min(1, { message: 'لطفا عنوان را وارد کنید.' }),
  contentJson: z.string({}),
  lang: z.string({}),
  status: z.string({}),
  mainCategory: z
    .string({})
    .min(1, { message: 'لطفا دسته‌ی اصلی را مشخص کنید.' }),
  categories: z.string({}),
  slug: z.string({}),
  tags: z.string({}),
  image: z.string().nullable(),
})

/**
 * Creates a post with the given form data.
 *
 * @param prevState - The previous state.
 * @param formData - The form data.
 * @returns An object with errors and a message if there are any, or redirects to the post dashboard.
 */
export async function createPost(prevState: State, formData: FormData) {
  // Validate form fields
  let newPost = null
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
    const params = await sanitizePostData(validatedFields)
    const cleanedParams = await generateUniquePostSlug(params)
    const mainCategory = await categoryCtrl.findById({
      id: cleanedParams.mainCategory,
    })
    newPost = await postCtrl.create({
      params: cleanedParams,
    })
    // Revalidate the path
    revalidatePathCtrl.revalidate({
      feature: 'post',
      slug: [
        `/${mainCategory.slug}/${cleanedParams?.slug}`,
        `/dashboard/posts`,
      ],
    })
  } catch (error) {
    console.log('#error in create post:', error)
    // Handle database error
    if (error instanceof z.ZodError) {
      return {
        errors: error.flatten().fieldErrors,
        values,
      }
    }
    return {
      message: 'خطای پایگاه داده: ایجاد مطلب ناموفق بود.',
      success: false,
      values,
    }
  }
  if (newPost) redirect(encodeURI(`/dashboard/posts/${newPost.id}`))
  else redirect(`/dashboard/posts`)
}

export async function updatePost(
  id: string,
  prevState: State,
  formData: FormData
) {
  let updatedPost = {}
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
    const params = await sanitizePostData(validatedFields, id)
    const cleanedParams = await generateUniquePostSlug(params, id)
    const mainCategory = await categoryCtrl.findById({
      id: cleanedParams.mainCategory,
    })
    updatedPost = await postCtrl.findOneAndUpdate({
      filters: id,
      params: cleanedParams,
    })
    // Revalidate the path
    revalidatePathCtrl.revalidate({
      feature: 'post',
      slug: [
        `/${mainCategory.slug}/${cleanedParams?.slug}`,
        `/dashboard/posts`,
      ],
    })
    return { message: 'فایل با موفقیت بروز رسانی شد', success: true, values }
  } catch (error) {
    return {
      message: 'خطای پایگاه داده: بروزرسانی مطلب ناموفق بود.',
      success: false,
      values: updatedPost,
    }
  }
}

export async function deletePost(id: string) {
  try {
    await postCtrl.delete({ filters: [id] })
  } catch (error) {
    return { message: 'خطای پایگاه داده: حذف مطلب ناموفق بود', success: false }
  }
  await postCtrl.delete({ filters: [id] })
  // Revalidate the path
  revalidatePathCtrl.revalidate({
    feature: 'post',
    slug: [`/dashboard/posts`],
  })
}

async function sanitizePostData(validatedFields: any, id?: string | undefined) {
  let prevState = { translations: [] }
  if (id) {
    prevState = await postCtrl.findById({ id })
    console.log('#prevState 098776 :', prevState)
  }
  const session = (await getSession()) as Session
  // Create the post
  const postPayload = validatedFields.data
  const tagsArray: Option[] = JSON.parse(postPayload?.tags || '[]')

  // for multi categories select
  // const categoriesArray: Option[] = JSON.parse(postPayload?.categories || '[]')
  const excerpt = extractExcerptFromContentJson(postPayload.contentJson, 25)
  const image = postPayload.image
    ? postPayload.image == ''
      ? null
      : postPayload.image
    : null
  const user = session.user.id
  const contentJson = await postCtrl.setFileData(postPayload.contentJson)
  // CHECK IF TAG DOES'T EXIST CREATE IT
  const tags = await tagCtrl.ensureTagsExist(tagsArray)
  const categories = JSON.parse(postPayload?.categories)

  // for multi categories select
  // const categories: string[] = await categoryCtrl.ensureCategoryExist(
  //   categoriesArray
  // )
  console.log(
    '#29386457832 JSON.parse(postPayload?.categories):',
    JSON.parse(postPayload?.categories)
  )
  const translations = [
    {
      lang: postPayload.lang,
      title: postPayload.title,
      excerpt,
      contentJson: JSON.stringify(contentJson),
      readingTime: postPayload.readingTime,
    },
    ...prevState.translations.filter(
      (t: PostTranslationSchema) => t.lang != postPayload.lang
    ),
  ]
  const categoriesId = categories.map((cat: Option) => cat.value)
  if (!categoriesId.includes(postPayload.mainCategory))
    categoriesId.push(postPayload.mainCategory)
  const params = {
    ...postPayload,
    translations,
    tags,
    categories: categoriesId,
    image,
    user,
  }

  return params
}

export async function getPosts(payload: QueryFind): Promise<QueryResult> {
  const filters: Record<string, any> = { ...(payload.filters ?? {}) }

  if (!Array.isArray(filters.categories) || filters.categories.length === 0) {
    delete filters.categories
  }

  if (!Array.isArray(filters.tags) || filters.tags.length === 0) {
    delete filters.tags
  }

  return postCtrl.find({
    ...payload,
    filters,
  })
}
