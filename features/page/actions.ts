'use server'

import { z } from 'zod'
import pageCtrl from '@/features/page/controller'
import { redirect } from 'next/navigation'
import { Session, State } from '@/types'
import settingsCtrl from '../settings/controller'
import { generateUniquePageSlug } from './utils'
import { getSession } from '@/lib/auth'
import revalidatePathCtrl from '@/lib/revalidatePathCtrl'

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
  let newPage = null
  // Validate form fields
  const rawValues = Object.fromEntries(formData)

  const content = JSON.parse(rawValues?.contentJson)
  const values = {
    ...rawValues,
    title: content?.title || '', // for generate slug
    type: content.type,
    templateFor: content.templateFor,
    slug: content.slug,
    status: content.status,
    translation: {
      lang: content?.lang || 'fa',
      title: content?.title || '',
      content,
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
      success: false,
      values,
    }
  }

  try {
    const params = await sanitizePageData(validatedFields)
    console.log('#234876 params:', params)
    const cleanedParams = await generateUniquePageSlug(params)
    // Create the page
    newPage = await pageCtrl.create({
      params: cleanedParams,
    })
    revalidatePathCtrl.revalidate({
      feature: 'page',
      slug: [`/${cleanedParams?.slug || params.slug}`, '/dashboard/pages'],
    })
  } catch (error) {
    console.log('%error:', error)
    // Handle database error
    if (error instanceof z.ZodError) {
      return {
        message: 'لطفا فیلدهای لازم را پر کنید.',
        errors: error.flatten().fieldErrors,
        values,
      }
    }
    return {
      message: 'خطای پایگاه داده: ایجاد برگه ناموفق بود.',
      success: false,
      values,
    }
  }
  if (newPage) redirect(`/dashboard/pages/${newPage.id}`)
  redirect('/dashboard/pages')
}

export async function updatePage(
  id: string,
  prevState: State,
  formData: FormData
) {
  let cleanedParams = {},
    updatedPage = {}
  const rawValues = Object.fromEntries(formData.entries())

  const content = JSON.parse(rawValues?.contentJson)
  const values = {
    ...rawValues,
    title: content?.title || '', // for generate slug
    type: content.type,
    templateFor: content.templateFor,
    slug: content.slug,
    status: content.status,
    translation: {
      lang: content?.lang || 'fa',
      title: content?.title || '',
      content,
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
      success: false,
      values,
    }
  }
  try {
    const params = await sanitizePageData(validatedFields, id)

    cleanedParams = await generateUniquePageSlug(params, id)
    console.log('#cleanedParams in update:', cleanedParams)
    let revalidatePath = [`/${cleanedParams?.slug || params.slug}`]
    // if is home page so revalidate home page
    const settings = await settingsCtrl.findOne({
      filters: { type: 'site-settings' },
    })
    if (settings.id === id) revalidatePath = [...revalidatePath, '/']
    updatedPage = await pageCtrl.findOneAndUpdate({
      filters: id,
      params: cleanedParams,
    })
    revalidatePathCtrl.revalidate({
      feature: 'page',
      slug: [...revalidatePath, '/dashboard/pages'],
    })
  } catch (error) {
    return { message: 'خطای پایگاه داده: بروزرسانی برگه ناموفق بود.' }
  }
  return {
    message: 'بروزرسانی با موفقیت انجام شد',
    success: true,
    values: { ...updatedPage, translation: cleanedParams?.translations[0] },
  }
}

export async function deletePage(id: string) {
  try {
    await pageCtrl.delete({ filters: [id] })
  } catch (error) {
    return { message: 'خطای پایگاه داده: حذف برگه ناموفق بود' }
  }
  await pageCtrl.delete({ filters: [id] })
  revalidatePathCtrl.revalidate({ feature: 'page', slug: ['/dashboard/pages'] })
}

export async function getAllPages() {
  return pageCtrl.findAll({})
}

async function sanitizePageData(validatedFields: any, id?: string | undefined) {
  let prevState = { translations: [] }
  if (id) {
    prevState = await pageCtrl.findById({ id })
    console.log('#prevState 098776 :', prevState)
  }
  const session = (await getSession()) as Session

  const user = session.user.id
  // Create the post
  const content = JSON.parse(validatedFields.data.contentJson)
  console.log('#45897 content in sandigo:', content)
  const translations = [
    {
      lang: content.lang || 'fa',
      title: content.title || '',
      content,
    },
    // ...prevState.translations.filter(
    //   (t: PageTranslationSchema) => t.lang != content.lang
    // ),
  ]
  const params = {
    type: content.type,
    title: content.title || '', // for generate slug
    templateFor: content.templateFor,
    slug: content.slug || '',
    translations,
    status: content.status,
    user,
  }
  return params
}
