'use server'

import { z } from 'zod'
import cityCtrl from './controller'
import { redirect } from 'next/navigation'
import { State } from '@/types'
import revalidatePathCtrl from '@/lib/revalidatePathCtrl'

const FormSchema = z.object({
  title: z.string({}).min(1, { message: 'لطفا عنوان را وارد کنید.' }),
  parentId: z.string({}).nullable(),
  description: z.string({}),
})

/**
 * Creates a city with the given form data.
 *
 * @param prevState - The previous state.
 * @param formData - The form data.
 * @returns An object with errors and a message if there are any, or redirects to the city dashboard.
 */
export async function createCity(prevState: State, formData: FormData) {
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

  validatedFields.data.parentId =
    validatedFields.data.parentId == '' ? null : validatedFields.data.parentId

  try {
    // Create the city
    await cityCtrl.create({ params: validatedFields.data })
    revalidatePathCtrl.revalidate({
      feature: 'city',
      slug: [`/dashboard/citys`],
    })
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
  redirect('/dashboard/citys')
}

export async function updateCity(
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
    await cityCtrl.findOneAndUpdate({
      filters: id,
      params: validatedFields.data,
    })
    revalidatePathCtrl.revalidate({
      feature: 'city',
      slug: [`/dashboard/citys`],
    })
  } catch (error) {
    return { message: 'خطای پایگاه داده: بروزرسانی دسته ناموفق بود.' }
  }
  redirect('/dashboard/citys')
}

export async function deleteCity(id: string) {
  try {
    await cityCtrl.delete({ filters: [id] })
  } catch (error) {
    return { message: 'خطای پایگاه داده: حذف دسته ناموفق بود' }
  }
  await cityCtrl.delete({ filters: [id] })
  revalidatePathCtrl.revalidate({
    feature: 'city',
    slug: [`/dashboard/citys`],
  })
}

export async function getCitiesAsOption(provinceId: string) {
  return cityCtrl.getCitiesAsOption(provinceId)
}
