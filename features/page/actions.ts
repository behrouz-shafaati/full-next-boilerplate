'use server'

import { z } from 'zod'
import pageCtrl from '@/features/page/controller'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Session, State } from '@/types'
import settingsCtrl from '../settings/controller'
import { generateUniquePageSlug } from './utils'
import { getSession } from '@/lib/auth'

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
  const validatedFields = FormSchema.safeParse(
    Object.fromEntries(formData.entries())
  )
  const values = validatedFields.data
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
    const cleanedParams = await generateUniquePageSlug(params)
    console.log('#234876 params:', params)
    // Create the page
    newPage = await pageCtrl.create({
      params: cleanedParams,
      revalidatePath: `/${cleanedParams?.slug || params.slug}`,
    })
  } catch (error) {
    // Handle database error
    if (error instanceof z.ZodError) {
      return {
        message: 'لطفا فیلدهای لازم را پر کنید.',
        errors: error.flatten().fieldErrors,
        values,
      }
    }
    return {
      message: 'خطای پایگاه داده: ایجاد دسته ناموفق بود.',
      success: false,
      values,
    }
  }

  // Revalidate the path and redirect to the page dashboard
  revalidatePath('/dashboard/pages')
  if (newPage) redirect(`/dashboard/pages/${newPage.id}`)
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
  const values = validatedFields.data

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

    const cleanedParams = await generateUniquePageSlug(params, id)
    let revalidatePath = [`/${cleanedParams?.slug || params.slug}`]
    // if is home page so revalidate home page
    const settings = await settingsCtrl.findOne({
      filters: { type: 'site-settings' },
    })
    if (settings.id === id) revalidatePath = [...revalidatePath, '/']
    await pageCtrl.findOneAndUpdate({
      filters: id,
      params: cleanedParams,
      revalidatePath,
    })
  } catch (error) {
    return { message: 'خطای پایگاه داده: بروزرسانی دسته ناموفق بود.' }
  }
  revalidatePath('/dashboard/pages')
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

async function sanitizePageData(validatedFields: any) {
  const session = (await getSession()) as Session

  const user = session.user.id
  // Create the post
  const content = JSON.parse(validatedFields.data.contentJson)
  const params = {
    content,
    title: content.title,
    type: content.type,
    templateFor: content.templateFor,
    slug: content.slug,
    status: content.status,
    user,
  }
  return params
}
