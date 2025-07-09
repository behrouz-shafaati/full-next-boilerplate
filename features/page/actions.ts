'use server'

import { z } from 'zod'
import pageCtrl from '@/features/page/controller'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { State } from '@/types'

const FormSchema = z.object({
  contentJson: z.string({}),
})

/**
 * Creates a page with the given form data.
 *
 * @param prevState - The previous state.
 * @param formData - The form data.
 * @returns An object with errors and a message if there are any, or redirects to the page dashboard.
 */
export async function createPage(prevState: State, formData: FormData) {
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
    const content = JSON.parse(validatedFields.data.contentJson)
    const params = {
      content,
      title: content.title,
      type: content.type,
      templateFor: content.templateFor,
      slug: content.slug,
      status: content.status,
    }
    console.log('#234876 params:', params)
    // Create the page
    await pageCtrl.create({ params })
  } catch (error) {
    // Handle database error
    if (error instanceof z.ZodError) {
      return {
        errors: error.flatten().fieldErrors,
      }
    }
    return {
      message: 'خطای پایگاه داده: ایجاد دسته ناموفق بود.',
    }
  }

  // Revalidate the path and redirect to the page dashboard
  revalidatePath('/dashboard/pages')
  redirect('/dashboard/pages')
}

export async function updatePage(
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
    const content = JSON.parse(validatedFields.data.contentJson)
    const params = {
      content,
      title: content.title,
      type: content.type,
      templateFor: content.templateFor,
      slug: content.slug,
      status: content.status,
    }
    await pageCtrl.findOneAndUpdate({
      filters: id,
      params,
    })
  } catch (error) {
    return { message: 'خطای پایگاه داده: بروزرسانی دسته ناموفق بود.' }
  }
  revalidatePath('/dashboard/pages')
  redirect('/dashboard/pages')
}

export async function deletePage(id: string) {
  try {
    await pageCtrl.delete({ filters: [id] })
  } catch (error) {
    return { message: 'خطای پایگاه داده: حذف دسته ناموفق بود' }
  }
  await pageCtrl.delete({ filters: [id] })
  revalidatePath('/dashboard/pages')
}

export async function getAllPages() {
  return pageCtrl.findAll({})
}
