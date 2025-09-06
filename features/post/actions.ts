'use server'

import { z } from 'zod'
import postCtrl from '@/features/post/controller'
import { revalidatePath } from 'next/cache'
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

const FormSchema = z.object({
  title: z.string({}).min(1, { message: 'لطفا عنوان را وارد کنید.' }),
  contentJson: z.string({}),
  status: z.string({}),
  mainCategory: z.string({}),
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
  const validatedFields = FormSchema.safeParse(
    Object.fromEntries(formData.entries())
  )
  const values = validatedFields.data
  console.log('#234786 values: ', values)
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
    newPost = await postCtrl.create({
      params: cleanedParams,
      revalidatePath: `/blog/${cleanedParams?.slug || params.slug}`,
    })
  } catch (error) {
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
  // Revalidate the path and redirect to the post dashboard
  revalidatePath(`/dashboard/posts`)
  if (newPost) redirect(encodeURI(`/dashboard/posts/${newPost.id}`))
  else redirect(`/dashboard/posts`)
}

export async function updatePost(
  id: string,
  prevState: State,
  formData: FormData
) {
  const validatedFields = FormSchema.safeParse(
    Object.fromEntries(formData.entries())
  )
  const values = validatedFields.data

  console.log('#23478d formData: ', formData)
  console.log('#2347f6 values: ', values)
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
    const cleanedParams = await generateUniquePostSlug(params, id)
    await postCtrl.findOneAndUpdate({
      filters: id,
      params: cleanedParams,
      revalidatePath: `/blog/${cleanedParams?.slug || params.slug}`,
    })

    revalidatePath('/dashboard/posts')
    return { message: 'فایل با موفقیت بروز رسانی شد', success: true, values }
  } catch (error) {
    return {
      message: 'خطای پایگاه داده: بروزرسانی مطلب ناموفق بود.',
      success: false,
      values,
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
  revalidatePath('/dashboard/posts')
}

async function sanitizePostData(validatedFields: any) {
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
  const params = {
    ...postPayload,
    tags,
    categories: categories.map((cat: Option) => cat.value),
    contentJson: JSON.stringify(contentJson),
    excerpt,
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
