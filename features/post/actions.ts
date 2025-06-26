'use server'

import { z } from 'zod'
import postCtrl from '@/features/post/controller'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const FormSchema = z.object({
  title: z.string({}).min(1, { message: 'لطفا عنوان را وارد کنید.' }),
  content: z.string({}),
  status: z.string({}),
})

export type State = {
  errors?: {
    title?: string[]
  }
  message?: string | null
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
    }
  }

  try {
    // Create the post
    await postCtrl.create({ params: validatedFields.data })
  } catch (error) {
    // Handle database error
    if (error instanceof z.ZodError) {
      return {
        errors: error.flatten().fieldErrors,
      }
    }
    return {
      message: 'خطای پایگاه داده: ایجاد مطلب ناموفق بود.',
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
    }
  }
  try {
    await postCtrl.findOneAndUpdate({
      filters: id,
      params: validatedFields.data,
    })
  } catch (error) {
    return { message: 'خطای پایگاه داده: بروزرسانی مطلب ناموفق بود.' }
  }
  revalidatePath('/dashboard/posts')
  redirect('/dashboard/posts')
}

export async function deletePost(id: string) {
  try {
    await postCtrl.delete({ filters: [id] })
  } catch (error) {
    return { message: 'خطای پایگاه داده: حذف مطلب ناموفق بود' }
  }
  await postCtrl.delete({ filters: [id] })
  revalidatePath('/dashboard/posts')
}
