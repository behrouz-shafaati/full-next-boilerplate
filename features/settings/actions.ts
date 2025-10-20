'use server'

import { z } from 'zod'
import settingsCtrl, { getSettings } from '@/features/settings/controller'
import { Session, State } from '@/types'
import revalidatePathCtrl from '@/lib/revalidatePathCtrl'
import { revalidatePath } from 'next/cache'
import { Settings } from './interface'

const FormSchema = z.object({
  homePageId: z.string({}),
  commentApprovalRequired: z.string({}).nullable().optional(),
  emailVerificationRequired: z.string({}).nullable().optional(),
  mobileVerificationRequired: z.string({}).nullable().optional(),
  mail_host: z.string({}).nullable().optional(),
  mail_port: z.string({}).nullable().optional(),
  mail_username: z.string({}).nullable().optional(),
  mail_password: z.string({}).nullable().optional(),
  farazsms_apiKey: z.string({}).nullable().optional(),
  farazsms_verifyPatternCode: z.string({}).nullable().optional(),
  farazsms_from_number: z.string({}).nullable().optional(),
  favicon: z.string({}).nullable().optional(),
  site_title: z.string({}).nullable().optional(),
  site_introduction: z.string({}).nullable().optional(),
  desktopHeaderHeight: z.string({}).nullable().optional(),
  tabletHeaderHeight: z.string({}).nullable().optional(),
  mobileHeaderHeight: z.string({}).nullable().optional(),
  // defaultHeaderId: z.string({}),
})

/**
 * update settings with the given form data.
 *
 * @param prevState - The previous state.
 * @param formData - The form data.
 * @returns An object with errors and a message if there are any, or redirects to the settings dashboard.
 */

export async function updateSettings(prevState: State, formData: FormData) {
  const validatedFields = FormSchema.safeParse(
    Object.fromEntries(formData.entries())
  )

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'لطفا فیلدهای لازم را پر کنید.',
      success: false,
    }
  }
  try {
    const params = await sanitizeSettingsData(validatedFields)
    console.log('#2887 params: ', params)
    await settingsCtrl.findOneAndUpdate({
      filters: { type: 'site-settings' },
      params,
      options: { upsert: true }, // اگر نبود، بساز
    })
    // Revalidate the path
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'settings',
      slug: [`/`],
    })

    for (const slug of pathes) {
      // این تابع باید یا در همین فایل سرور اکشن یا از طریق api فراخوانی شود. پس محلش نباید تغییر کند.
      revalidatePath(slug)
    }

    return { message: 'فایل با موفقیت بروز رسانی شد', success: true }
  } catch (error) {
    console.log(error)
    return {
      message: 'خطای پایگاه داده: بروزرسانی مقاله ناموفق بود.',
      success: false,
    }
  }
}

export async function deleteSettings(id: string) {
  try {
    await settingsCtrl.delete({ filters: [id] })
  } catch (error) {
    return { message: 'خطای پایگاه داده: حذف مقاله ناموفق بود', success: false }
  }
  await settingsCtrl.delete({ filters: [id] })
  // Revalidate the path
  const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
    feature: 'settings',
    slug: [`/dashboard/settingss`],
  })

  for (const slug of pathes) {
    // این تابع باید یا در همین فایل سرور اکشن یا از طریق api فراخوانی شود. پس محلش نباید تغییر کند.
    revalidatePath(slug)
  }
}

async function sanitizeSettingsData(validatedFields: any) {
  // const session = (await getSession()) as Session
  // Create the settings
  const siteSettings = await getSettings()

  const settingsPayload = validatedFields.data
  const farazsms = {
    farazsms_apiKey: settingsPayload?.farazsms_apiKey,
    farazsms_verifyPatternCode: settingsPayload?.farazsms_verifyPatternCode,
    farazsms_from_number: settingsPayload?.farazsms_from_number,
  }
  const infoTranslations = [
    ...(siteSettings?.infoTranslations || []),
    {
      lang: 'fa',
      site_title: settingsPayload?.site_title || '',
      site_introduction: settingsPayload?.site_introduction || '',
    },
  ]
  const params = {
    ...settingsPayload,
    commentApprovalRequired:
      settingsPayload?.commentApprovalRequired == 'on' ? true : false,
    emailVerificationRequired:
      settingsPayload?.emailVerificationRequired == 'on' ? true : false,
    mobileVerificationRequired:
      settingsPayload?.mobileVerificationRequired == 'on' ? true : false,
    favicon: settingsPayload?.favicon == '' ? null : settingsPayload?.favicon,
    homePageId:
      settingsPayload?.homePageId == '' ? null : settingsPayload?.homePageId,
    farazsms,
    infoTranslations,
  }

  return params
}
