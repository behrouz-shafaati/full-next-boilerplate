'use server'

import { z } from 'zod'
import menuCtrl from '@/features/menu/controller'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const FormSchema = z.object({
  title: z.string({}).min(1, { message: 'لطفا عنوان را وارد کنید.' }),
})

export type State = {
  errors?: {
    title?: string[]
  }
  message?: string | null
}

/**
 * Creates a menu with the given form data.
 *
 * @param prevState - The previous state.
 * @param formData - The form data.
 * @returns An object with errors and a message if there are any, or redirects to the menu dashboard.
 */
export async function createMenu(prevState: State, formData: FormData) {
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
    // Create the menu
    await menuCtrl.create({ params: validatedFields.data })
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

  // Revalidate the path and redirect to the menu dashboard
  revalidatePath('/dashboard/menus')
  redirect('/dashboard/menus')
}

export async function updateMenu(
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
    await menuCtrl.findOneAndUpdate({
      filters: id,
      params: validatedFields.data,
    })
  } catch (error) {
    return { message: 'خطای پایگاه داده: بروزرسانی دسته ناموفق بود.' }
  }
  revalidatePath('/dashboard/menus')
  redirect('/dashboard/menus')
}

export async function deleteMenu(id: string) {
  try {
    await menuCtrl.delete({ filters: [id] })
  } catch (error) {
    return { message: 'خطای پایگاه داده: حذف دسته ناموفق بود' }
  }
  await menuCtrl.delete({ filters: [id] })
  revalidatePath('/dashboard/menus')
}

export async function getAllMenus() {
  return menuCtrl.findAll({})
}
