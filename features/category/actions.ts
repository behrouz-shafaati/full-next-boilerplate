'use server'

import { z } from 'zod'
import categoryCtrl from './controller'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const FormSchema = z.object({
  title: z.string({}).min(1, { message: 'لطفا عنوان را وارد کنید.' }),
  parent: z.string({}).nullable(),
  description: z.string({}),
  status: z.string({}),
  image: z.string({}).nullable(),
})

export type State = {
  errors?: {
    title?: string[]
  }
  message?: string | null
}

/**
 * Creates a category with the given form data.
 *
 * @param prevState - The previous state.
 * @param formData - The form data.
 * @returns An object with errors and a message if there are any, or redirects to the category dashboard.
 */
export async function createCategory(prevState: State, formData: FormData) {
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
    // Create the category
    await categoryCtrl.create({ params: validatedFields.data })
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

  // Revalidate the path and redirect to the category dashboard
  revalidatePath('/dashboard/categories')
  redirect('/dashboard/categories')
}

export async function updateCategory(
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
    await categoryCtrl.findOneAndUpdate({
      filters: id,
      params: validatedFields.data,
    })
  } catch (error) {
    return { message: 'خطای پایگاه داده: بروزرسانی دسته ناموفق بود.' }
  }
  revalidatePath('/dashboard/categories')
  redirect('/dashboard/categories')
}

export async function deleteCategory(id: string) {
  try {
    await categoryCtrl.delete({ filters: [id] })
  } catch (error) {
    return { message: 'خطای پایگاه داده: حذف دسته ناموفق بود' }
  }
  await categoryCtrl.delete({ filters: [id] })
  revalidatePath('/dashboard/categories')
}

export async function getAllCategories() {
  return categoryCtrl.findAll({})
}
