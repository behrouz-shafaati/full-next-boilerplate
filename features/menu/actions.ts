'use server'

import { z } from 'zod'
import menuCtrl from '@/features/menu/controller'
import { redirect } from 'next/navigation'
import { Session, State } from '@/types'
import { QueryFind, QueryResult } from '@/lib/entity/core/interface'
import { getSession } from '@/lib/auth'
import { MenuTranslationSchema } from './interface'
import revalidatePathCtrl from '@/lib/revalidatePathCtrl'

const FormSchema = z.object({
  title: z.string({}).min(1, { message: 'لطفا عنوان را وارد کنید.' }),
  itemsJson: z.string({}),
  lang: z.string({}),
})

async function sanitizePostData(validatedFields: any, id?: string | undefined) {
  let prevState = { translations: [] }
  if (id) {
    prevState = await menuCtrl.findById({ id })
    console.log('#prevState 098776 :', prevState)
  }
  const session = (await getSession()) as Session
  const payload = validatedFields.data
  console.log('#iuy982y34 payload:', payload)
  const user = session.user.id
  const translations = [
    {
      lang: payload.lang,
      title: payload.title,
      items: JSON.parse(payload.itemsJson),
    },
    ...prevState.translations.filter(
      (t: MenuTranslationSchema) => t.lang != payload.lang
    ),
  ]
  const params = {
    ...payload,
    translations,
    user,
  }

  return params
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
  const values = Object.fromEntries(formData)
  const validatedFields = FormSchema.safeParse(
    Object.fromEntries(formData.entries())
  )
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      ok: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'لطفا فیلدهای لازم را پر کنید.',
      values,
    }
  }

  try {
    const params = await sanitizePostData(validatedFields)
    // Create the menu
    await menuCtrl.create({ params })
    // Revalidate the path and redirect to the menu dashboard
    revalidatePathCtrl.revalidate({
      feature: 'menu',
      slug: '/dashboard/menus',
    })
  } catch (error) {
    // Handle database error
    if (error instanceof z.ZodError) {
      return {
        ok: false,
        errors: error.flatten().fieldErrors,
        values,
      }
    }
    return {
      ok: false,
      message: 'خطای پایگاه داده: ایجاد منو ناموفق بود.',
      values,
    }
  }

  redirect('/dashboard/menus')
}

export async function updateMenu(
  id: string,
  prevState: State,
  formData: FormData
) {
  const rawValues = Object.fromEntries(formData)
  const values = {
    ...rawValues,
    translation: {
      lang: rawValues?.lang,
      title: rawValues?.title,
      itemsJson: rawValues?.itemsJson,
    },
  }
  const validatedFields = FormSchema.safeParse(
    Object.fromEntries(formData.entries())
  )

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      ok: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'لطفا فیلدهای لازم را پر کنید.',
      values,
    }
  }
  try {
    const params = await sanitizePostData(validatedFields, id)
    await menuCtrl.findOneAndUpdate({
      filters: id,
      params,
    })
    // Revalidate the path and redirect to the menu dashboard
    revalidatePathCtrl.revalidate({
      feature: 'menu',
      slug: '/dashboard/menus',
    })
  } catch (error) {
    return {
      ok: false,
      values,
      message: 'خطای پایگاه داده: بروزرسانی دسته ناموفق بود.',
    }
  }
  redirect('/dashboard/menus')
}

export async function deleteMenu(id: string) {
  try {
    await menuCtrl.delete({ filters: [id] })
  } catch (error) {
    return { message: 'خطای پایگاه داده: حذف دسته ناموفق بود' }
  }
  await menuCtrl.delete({ filters: [id] })
  revalidatePathCtrl.revalidate({
    feature: 'menu',
    slug: '/dashboard/menus',
  })
}

export async function getAllMenus() {
  return menuCtrl.findAll({})
}
export async function getMenus(payload: QueryFind): Promise<QueryResult> {
  return menuCtrl.find(payload)
}
