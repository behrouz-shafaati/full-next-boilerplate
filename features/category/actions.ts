'use server'

import { z } from 'zod'
import categoryCtrl from './controller'
import { redirect } from 'next/navigation'
import { Session, State } from '@/types'
import { Category, CategoryTranslationSchema } from './interface'
import { createCatrgoryBreadcrumb } from '@/lib/utils'
import { getSession } from '@/lib/auth'
import revalidatePathCtrl from '@/lib/revalidatePathCtrl'

const FormSchema = z.object({
  title: z.string({}).min(1, { message: 'لطفا عنوان را وارد کنید.' }),
  parent: z.string({}).nullable(),
  lang: z.string({}),
  slug: z.string({}),
  description: z.string({}),
  status: z.string({}),
  image: z.string({}).nullable(),
})

async function sanitizePostData(validatedFields: any, id?: string | undefined) {
  let prevState = { translations: [] }
  if (id) {
    prevState = await categoryCtrl.findById({ id })
    console.log('#prevState 098776 :', prevState)
  }
  const session = (await getSession()) as Session
  const payload = validatedFields.data
  const user = session.user.id
  const translations = [
    {
      lang: payload.lang,
      title: payload.title,
      description: payload.description,
    },
    ...prevState.translations.filter(
      (t: CategoryTranslationSchema) => t.lang != payload.lang
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
 * Creates a category with the given form data.
 *
 * @param prevState - The previous state.
 * @param formData - The form data.
 * @returns An object with errors and a message if there are any, or redirects to the category dashboard.
 */
export async function createCategory(prevState: State, formData: FormData) {
  // Validate form fields
  const rawValues = Object.fromEntries(formData)
  const values = {
    ...rawValues,
    translation: {
      lang: rawValues?.lang,
      title: rawValues?.title,
      description: rawValues?.description,
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
      values,
    }
  }

  try {
    const params = await sanitizePostData(validatedFields)
    // Create the category
    await categoryCtrl.create({
      params,
    })
  } catch (error) {
    // Handle database error
    if (error instanceof z.ZodError) {
      return {
        errors: error.flatten().fieldErrors,
      }
    }
    return {
      message: ` خطای پایگاه داده: ${error}`,
      values,
    }
  }

  // Revalidate the path and redirect to the category dashboard
  revalidatePathCtrl.revalidate({
    feature: 'category',
    slug: '/dashboard/categories',
  })
  redirect('/dashboard/categories')
}

export async function updateCategory(
  id: string,
  prevState: State,
  formData: FormData
) {
  const values = Object.fromEntries(formData)
  const validatedFields = FormSchema.safeParse(
    Object.fromEntries(formData.entries())
  )

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'لطفا فیلدهای لازم را پر کنید.',
      values,
    }
  }
  try {
    const params = await sanitizePostData(validatedFields, id)
    await categoryCtrl.findOneAndUpdate({
      filters: id,
      params,
    })
  } catch (error) {
    return { message: 'خطای پایگاه داده: بروزرسانی دسته ناموفق بود.', values }
  }
  revalidatePathCtrl.revalidate({
    feature: 'category',
    slug: '/dashboard/categories',
  })
  redirect('/dashboard/categories')
}

export async function deleteCategory(id: string) {
  try {
    await categoryCtrl.delete({ filters: [id] })
  } catch (error) {
    return { message: 'خطای پایگاه داده: حذف دسته ناموفق بود', values }
  }
  await categoryCtrl.delete({ filters: [id] })
  revalidatePathCtrl.revalidate({
    feature: 'category',
    slug: '/dashboard/categories',
  })
}

export async function getAllCategories() {
  return categoryCtrl.findAll({})
}

export async function searchCategories(query: string, locale: string = 'fa') {
  const results = await categoryCtrl.find({ filters: { query } })

  return results.data.map((cat: Category) => {
    const translation: CategoryTranslationSchema =
      cat?.translations?.find(
        (t: CategoryTranslationSchema) => t.lang === locale
      ) ||
      cat?.translations[0] ||
      {}
    return {
      label: createCatrgoryBreadcrumb(cat, translation?.title),
      value: String(cat.id),
    }
  })
}
