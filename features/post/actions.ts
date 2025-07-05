'use server'

import { z } from 'zod'
import postCtrl from '@/features/post/controller'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import {
  extractExcerptFromContentJson,
  generateExcerpt,
  generateUniqueSlug,
} from './utils'
import { getSession } from '@/lib/auth'
import { Session } from '@/types'

const FormSchema = z.object({
  title: z.string({}).min(1, { message: 'لطفا عنوان را وارد کنید.' }),
  contentJson: z.string({}),
  status: z.string({}),
  image: z.string().nullable(),
})

export type State = {
  errors?: {
    title?: string[]
  }
  message?: string | null
  success: boolean
}

/**
 * Creates a post with the given form data.
 *
 * @param prevState - The previous state.
 * @param formData - The form data.
 * @returns An object with errors and a message if there are any, or redirects to the post dashboard.
 */
export async function createPost(prevState: State, formData: FormData) {
  // Validate form fields
  const validatedFields = FormSchema.safeParse(
    Object.fromEntries(formData.entries())
  )
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'لطفا فیلدهای لازم را پر کنید.',
      success: false,
    }
  }

  try {
    const params = await sanitizePostData(validatedFields)
    const slug = await generateUniqueSlug(params.title)
    const cleanedParams = {
      ...params,
      slug,
    }
    console.log('#887 cleanedParams:', cleanedParams)
    await postCtrl.create({ params: cleanedParams })
  } catch (error) {
    // Handle database error
    if (error instanceof z.ZodError) {
      return {
        errors: error.flatten().fieldErrors,
      }
    }
    return {
      message: 'خطای پایگاه داده: ایجاد مطلب ناموفق بود.',
      success: false,
    }
  }

  // Revalidate the path and redirect to the post dashboard
  revalidatePath('/dashboard/posts')
  redirect('/dashboard/posts')
}

export async function updatePost(
  id: string,
  prevState: State,
  formData: FormData
) {
  const validatedFields = FormSchema.safeParse(
    Object.fromEntries(formData.entries())
  )

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'لطفا فیلدهای لازم را پر کنید.',
      success: false,
    }
  }
  try {
    const params = await sanitizePostData(validatedFields)
    await postCtrl.findOneAndUpdate({
      filters: id,
      params,
    })

    revalidatePath('/dashboard/posts')
    return { message: 'فایل با موفقیت بروز رسانی شد', success: true }
  } catch (error) {
    return {
      message: 'خطای پایگاه داده: بروزرسانی مطلب ناموفق بود.',
      success: false,
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
  const excerpt = extractExcerptFromContentJson(postPayload.contentJson, 25)
  const image = postPayload.image
    ? postPayload.image == ''
      ? null
      : postPayload.image
    : null
  const user = session.user.id
  const contentJson = await postCtrl.setFileData(postPayload.contentJson)
  console.log('#contentJson after set file data: ', contentJson)
  const params = {
    ...postPayload,
    contentJson: JSON.stringify(contentJson),
    excerpt,
    image,
    user,
  }

  return params
}
