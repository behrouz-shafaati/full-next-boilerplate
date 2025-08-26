'use server'

import { z } from 'zod'
import templatePartCtrl from '@/features/template-part/controller'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Session, State } from '@/types'
import settingsCtrl from '../settings/controller'
import { generateUniqueTemplatePartSlug } from './utils'
import { getSession } from '@/lib/auth'
import { QueryFind, QueryResult } from '@/lib/entity/core/interface'
import { TemplatePart } from './interface'

const FormSchema = z.object({
  contentJson: z.string({}),
})

/**
 * Creates a TemplatePart with the given form data.
 *
 * @param prevState - The previous state.
 * @param formData - The form data.
 * @returns An object with errors and a message if there are any, or redirects to the TemplatePart dashboard.
 */
export async function createTemplatePart(prevState: State, formData: FormData) {
  let newTemplatePart = null
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
    const params = await sanitizeTemplatePartData(validatedFields)
    const cleanedParams = await generateUniqueTemplatePartSlug(params)
    console.log('#234876 params:', params)
    // Create the TemplatePart
    newTemplatePart = await templatePartCtrl.create({
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

  // Revalidate the path and redirect to the TemplatePart dashboard
  revalidatePath('/dashboard/templateParts')
  if (newTemplatePart)
    redirect(`/dashboard/template-parts/${newTemplatePart.id}`)
  redirect('/dashboard/template-parts')
}

export async function updateTemplatePart(
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
    const params = await sanitizeTemplatePartData(validatedFields)

    const cleanedParams = await generateUniqueTemplatePartSlug(params, id)
    let revalidatePath = [`/${cleanedParams?.slug || params.slug}`]
    // if is home TemplatePart so revalidate home TemplatePart
    const settings = await settingsCtrl.findOne({
      filters: { type: 'site-settings' },
    })
    if (settings.id === id) revalidatePath = [...revalidatePath, '/']
    await templatePartCtrl.findOneAndUpdate({
      filters: id,
      params: cleanedParams,
      revalidatePath,
    })
  } catch (error) {
    return { message: 'خطای پایگاه داده: بروزرسانی دسته ناموفق بود.' }
  }
  revalidatePath('/dashboard/template-parts')
}

export async function deleteTemplatePart(id: string) {
  try {
    await templatePartCtrl.delete({ filters: [id] })
  } catch (error) {
    return { message: 'خطای پایگاه داده: حذف دسته ناموفق بود' }
  }
  await templatePartCtrl.delete({ filters: [id] })
  revalidatePath('/dashboard/template-parts')
}

export async function getAllTemplateParts() {
  return templatePartCtrl.findAll({})
}

async function sanitizeTemplatePartData(validatedFields: any) {
  const session = (await getSession()) as Session

  const user = session.user.id
  // Create the post
  const content = JSON.parse(validatedFields.data.contentJson)
  const params = {
    content,
    title: content.title,
    type: content.type,
    templatePartFor: content.templatePartFor,
    slug: content.slug,
    status: content.status,
    user,
  }
  return params
}

export async function getTemplateParts(
  payload: QueryFind
): Promise<QueryResult> {
  return templatePartCtrl.find(payload)
}
export async function getTemplatePart(
  templatePartId: string
): Promise<TemplatePart> {
  const result = await templatePartCtrl.find({
    filters: { id: templatePartId },
  })
  return result.data[0]
}
