'use server'

import { z } from 'zod'
import templateCtrl from '@/features/template/controller'
import { redirect } from 'next/navigation'
import { Session, State } from '@/types'
import settingsCtrl from '../settings/controller'
import { generateUniqueTemplateSlug } from './utils'
import { getSession } from '@/lib/auth'
import { QueryFind, QueryResult } from '@/lib/entity/core/interface'
import { Template } from './interface'
import revalidatePathCtrl from '@/lib/revalidatePathCtrl'

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
  const values = Object.fromEntries(formData)
  // Validate form fields
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
    const params = await sanitizeTemplateData(validatedFields)
    const cleanedParams = await generateUniqueTemplateSlug(params)
    console.log('#23487s6 cleanedParams:', cleanedParams)
    // Create the Template
    newTemplate = await templateCtrl.create({
      params: cleanedParams,
    })
    revalidatePathCtrl.revalidate({
      feature: 'template',
      slug: [`/dashboard/templates`],
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
  if (newTemplate) redirect(`/dashboard/templates/${newTemplate.id}`)
  redirect('/dashboard/templates')
}

export async function updateTemplate(
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
      success: false,
      values,
    }
  }
  try {
    const params = await sanitizeTemplateData(validatedFields)

    const cleanedParams = await generateUniqueTemplateSlug(params, id)
    // if is home Template so revalidate home Template
    const settings = await settingsCtrl.findOne({
      filters: { type: 'site-settings' },
    })
    await templateCtrl.findOneAndUpdate({
      filters: id,
      params: cleanedParams,
    })
    revalidatePathCtrl.revalidate({
      feature: 'template',
      slug: [`/dashboard/templates`],
    })
  } catch (error) {
    return { message: 'خطای پایگاه داده: بروزرسانی دسته ناموفق بود.' }
  }
}

export async function deleteTemplate(id: string) {
  try {
    await templateCtrl.delete({ filters: [id] })
    revalidatePathCtrl.revalidate({
      feature: 'template',
      slug: [`/dashboard/templates`],
    })
  } catch (error) {
    return { message: 'خطای پایگاه داده: حذف دسته ناموفق بود' }
  }
  await templateCtrl.delete({ filters: [id] })
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
  const result = await templateCtrl.find({ filters: { id: templateId } })
  return result.data[0]
}
