'use server'

import { z } from 'zod'
import templateCtrl from '@/features/template/controller'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Session, State } from '@/types'
import settingsCtrl from '../settings/controller'
import { generateUniqueTemplateSlug } from './utils'
import { getSession } from '@/lib/auth'
import { QueryFind, QueryResult } from '@/lib/entity/core/interface'
import { Template } from './interface'

const FormSchema = z.object({
  contentJson: z.string({}),
})

/**
 * Creates a Template with the given form data.
 *
 * @param prevState - The previous state.
 * @param formData - The form data.
 * @returns An object with errors and a message if there are any, or redirects to the Template dashboard.
 */
export async function createTemplate(prevState: State, formData: FormData) {
  let newTemplate = null
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
    const params = await sanitizeTemplateData(validatedFields)
    const cleanedParams = await generateUniqueTemplateSlug(params)
    console.log('#234876 params:', params)
    // Create the Template
    newTemplate = await templateCtrl.create({
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

  // Revalidate the path and redirect to the Template dashboard
  revalidatePath('/dashboard/templates')
  if (newTemplate) redirect(`/dashboard/templates/${newTemplate.id}`)
  redirect('/dashboard/templates')
}

export async function updateTemplate(
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
    const params = await sanitizeTemplateData(validatedFields)

    const cleanedParams = await generateUniqueTemplateSlug(params, id)
    let revalidatePath = [`/${cleanedParams?.slug || params.slug}`]
    // if is home Template so revalidate home Template
    const settings = await settingsCtrl.findOne({
      filters: { type: 'site-settings' },
    })
    if (settings.id === id) revalidatePath = [...revalidatePath, '/']
    await templateCtrl.findOneAndUpdate({
      filters: id,
      params: cleanedParams,
      revalidatePath,
    })
  } catch (error) {
    return { message: 'خطای پایگاه داده: بروزرسانی دسته ناموفق بود.' }
  }
  revalidatePath('/dashboard/templates')
}

export async function deleteTemplate(id: string) {
  try {
    await templateCtrl.delete({ filters: [id] })
  } catch (error) {
    return { message: 'خطای پایگاه داده: حذف دسته ناموفق بود' }
  }
  await templateCtrl.delete({ filters: [id] })
  revalidatePath('/dashboard/templates')
}

export async function getAllTemplates() {
  return templateCtrl.findAll({})
}

async function sanitizeTemplateData(validatedFields: any) {
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

export async function getTemplates(payload: QueryFind): Promise<QueryResult> {
  return templateCtrl.find(payload)
}
export async function getTemplate(templateId: string): Promise<Template> {
  // if (templateId == undefined) return templateCtrl.getHomeTemplate()
  const result = await templateCtrl.find({ filters: { id: templateId } })
  return result.data[0]
}
