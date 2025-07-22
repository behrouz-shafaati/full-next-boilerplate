'use server'

import { z } from 'zod'
import tagCtrl from './controller'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Option, State } from '@/types'
import { title } from 'process'
import { Tag } from './interface'
import { createCatrgoryBreadcrumb } from '@/lib/utils'

const FormSchema = z.object({
  title: z.string({}).min(1, { message: 'لطفا عنوان را وارد کنید.' }),
  slug: z.string({}).nullable(),
  description: z.string({}),
  status: z.string({}),
  image: z.string({}).nullable(),
})

/**
 * Creates a tag with the given form data.
 *
 * @param prevState - The previous state.
 * @param formData - The form data.
 * @returns An object with errors and a message if there are any, or redirects to the tag dashboard.
 */
export async function createTag(prevState: State, formData: FormData) {
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
    // Create the tag
    await tagCtrl.create({ params: validatedFields.data })
  } catch (error) {
    // Handle database error
    if (error instanceof z.ZodError) {
      return {
        errors: error.flatten().fieldErrors,
      }
    }
    return {
      message: 'خطای پایگاه داده: ایجاد برچسب ناموفق بود.',
    }
  }

  // Revalidate the path and redirect to the tag dashboard
  revalidatePath('/dashboard/tags')
  redirect('/dashboard/tags')
}

export async function updateTag(
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
    await tagCtrl.findOneAndUpdate({
      filters: id,
      params: validatedFields.data,
    })
  } catch (error) {
    return { message: 'خطای پایگاه داده: بروزرسانی برچسب ناموفق بود.' }
  }
  revalidatePath('/dashboard/tags')
  redirect('/dashboard/tags')
}

export async function deleteTag(id: string) {
  try {
    await tagCtrl.delete({ filters: [id] })
  } catch (error) {
    return { message: 'خطای پایگاه داده: حذف برچسب ناموفق بود' }
  }
  await tagCtrl.delete({ filters: [id] })
  revalidatePath('/dashboard/tags')
}

export async function getAllTags() {
  return tagCtrl.findAll({})
}

export async function searchTags(query: string) {
  const results = await tagCtrl.find({ filters: { query } })

  return results.data.map((tag: Tag) => ({
    label: tag.title,
    value: String(tag.id),
  }))
}
