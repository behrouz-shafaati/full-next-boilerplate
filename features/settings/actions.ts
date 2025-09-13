'use server'

import { z } from 'zod'
import settingsCtrl from '@/features/settings/controller'
import { Session, State } from '@/types'
import revalidatePathCtrl from '@/lib/revalidatePathCtrl'
import { revalidatePath } from 'next/cache'

const FormSchema = z.object({
  homePageId: z.string({}),
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
    return {
      message: 'خطای پایگاه داده: بروزرسانی مطلب ناموفق بود.',
      success: false,
    }
  }
}

export async function deleteSettings(id: string) {
  try {
    await settingsCtrl.delete({ filters: [id] })
  } catch (error) {
    return { message: 'خطای پایگاه داده: حذف مطلب ناموفق بود', success: false }
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
  const settingsPayload = validatedFields.data
  const params = {
    ...settingsPayload,
  }

  return params
}
