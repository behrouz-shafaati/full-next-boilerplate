'use server'

import { z } from 'zod'
import headerCtrl from '@/features/header/controller'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Session, State } from '@/types'
import settingsCtrl from '../settings/controller'
import { generateUniqueHeaderSlug } from './utils'
import { getSession } from '@/lib/auth'
import { QueryFind, QueryResult } from '@/lib/entity/core/interface'

const FormSchema = z.object({
  contentJson: z.string({}),
})

/**
 * Creates a Header with the given form data.
 *
 * @param prevState - The previous state.
 * @param formData - The form data.
 * @returns An object with errors and a message if there are any, or redirects to the Header dashboard.
 */
export async function createHeader(prevState: State, formData: FormData) {
  let newHeader = null
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
    const params = await sanitizeHeaderData(validatedFields)
    const cleanedParams = await generateUniqueHeaderSlug(params)
    console.log('#234876 params:', params)
    // Create the Header
    newHeader = await headerCtrl.create({
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

  // Revalidate the path and redirect to the Header dashboard
  revalidatePath('/dashboard/headers')
  if (newHeader) redirect(`/dashboard/headers/${newHeader.id}`)
  redirect('/dashboard/headers')
}

export async function updateHeader(
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
    const params = await sanitizeHeaderData(validatedFields)

    const cleanedParams = await generateUniqueHeaderSlug(params, id)
    let revalidatePath = [`/${cleanedParams?.slug || params.slug}`]
    // if is home Header so revalidate home Header
    const settings = await settingsCtrl.findOne({
      filters: { type: 'site-settings' },
    })
    if (settings.id === id) revalidatePath = [...revalidatePath, '/']
    await headerCtrl.findOneAndUpdate({
      filters: id,
      params: cleanedParams,
      revalidatePath,
    })
  } catch (error) {
    return { message: 'خطای پایگاه داده: بروزرسانی دسته ناموفق بود.' }
  }
  revalidatePath('/dashboard/headers')
}

export async function deleteHeader(id: string) {
  try {
    await headerCtrl.delete({ filters: [id] })
  } catch (error) {
    return { message: 'خطای پایگاه داده: حذف دسته ناموفق بود' }
  }
  await headerCtrl.delete({ filters: [id] })
  revalidatePath('/dashboard/headers')
}

export async function getAllHeaders() {
  return headerCtrl.findAll({})
}

async function sanitizeHeaderData(validatedFields: any) {
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

export async function getHeaders(payload: QueryFind): Promise<QueryResult> {
  return headerCtrl.find(payload)
}
