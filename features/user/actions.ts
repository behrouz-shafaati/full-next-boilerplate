'use server'

import { z } from 'zod'
import userCtrl from '@/features/user/controller'
import { redirect } from 'next/navigation'
import shippingAddressCtrl from '@/features/shippingAddress/controller'
import { Option } from '@/types'
import revalidatePathCtrl from '@/lib/revalidatePathCtrl'
import { revalidatePath } from 'next/cache'
import { getSettings } from '../settings/controller'
import { Settings } from '../settings/interface'
import { comparePassword, encrypt } from '@/lib/utils'
import verificationCtrl from '../verification/controller'
import { cookies } from 'next/headers'

const FormSchema = z.object({
  firstName: z
    .string({
      required_error: 'لطفا نام را وارد کنید.',
    })
    .min(1, { message: 'لطفا نام را وارد کنید.' }),
  lastName: z
    .string({
      required_error: 'لطفا نام خانوادگی را وارد کنید.',
    })
    .min(1, { message: 'لطفا نام خانوادگی را وارد کنید.' }),
  userName: z
    .string({
      required_error: 'لطفا نام کاربری را وارد کنید.',
    })
    .min(1, { message: 'لطفا نام کاربری را وارد کنید.' }),
  email: z
    .string({
      required_error: 'لطفا ایمیل را وارد کنید.',
    })
    .min(1, { message: 'لطفا ایمیل را وارد کنید.' })
    .email({
      message: 'لطفا ایمیل معتبر وارد کنید.',
    }),
  mobile: z
    .string({
      required_error: 'لطفا موبایل را وارد کنید.',
    })
    .min(1, { message: 'لطفا موبال را وارد کنید.' }),
  roles: z
    .string({
      required_error: 'لطفا حداقل یک نقش انتخاب کنید.',
    })
    .min(3, { message: 'لطفا حداقل یک نقش انتخاب کنید.' }),
  password: z
    .string({
      required_error: 'لطفا رمز ورود را وارد کنید.',
    })
    .min(1, { message: 'لطفا رمز ورود را وارد کنید.' }),
  image: z.string({}).nullable(),
})

const SignupFormSchema = z.object({
  firstName: z
    .string({
      required_error: 'لطفا نام را وارد کنید.',
    })
    .min(1, { message: 'لطفا نام را وارد کنید.' }),
  lastName: z
    .string({
      required_error: 'لطفا نام خانوادگی را وارد کنید.',
    })
    .min(1, { message: 'لطفا نام خانوادگی را وارد کنید.' }),
  email: z
    .string({
      required_error: 'لطفا ایمیل را وارد کنید.',
    })
    .min(1, { message: 'لطفا ایمیل را وارد کنید.' })
    .email({
      message: 'لطفا ایمیل معتبر وارد کنید.',
    }),
  mobile: z
    .string({
      required_error: 'لطفا موبایل را وارد کنید.',
    })
    .min(1, { message: 'لطفا موبال را وارد کنید.' }),
  password: z
    .string({
      required_error: 'لطفا رمز ورود را وارد کنید.',
    })
    .min(1, { message: 'لطفا رمز ورود را وارد کنید.' }),
  confirmPassword: z
    .string({
      required_error: 'لطفا تایید رمز ورود را وارد کنید.',
    })
    .min(1, { message: 'لطفا تایید رمز ورود را وارد کنید.' }),
})

const loginFormSchema = z.object({
  identifier: z
    .string({ required_error: 'لطفاً ایمیل یا شماره موبایل را وارد کنید.' })
    .trim()
    .refine(
      (val) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || // ایمیل معتبر
        /^(\+98|0)?9\d{9}$/.test(val), // شماره موبایل ایران (09xxxxxxxxx یا +989xxxxxxxxx)
      { message: 'لطفاً ایمیل یا شماره موبایل معتبر وارد کنید.' }
    ),
  password: z
    .string({ required_error: 'لطفاً رمز ورود را وارد کنید.' })
    .min(6, { message: 'رمز ورود باید حداقل ۶ کاراکتر باشد.' }),
})

type State = {
  errors?: {
    firstName?: string[]
    lastName?: string[]
    email?: string[]
    mobile?: string[]
    property?: string[]
    password?: string[]
    image?: string[]
  }
  message?: string | null
}

export async function loginAction(
  prevState: string | undefined,
  formData: FormData
) {
  let user = null
  let flgNeedVerification: boolean = false
  const durationOfSessionValidity = 60 * 60 * 12 * 1000 // 12 ساعت به میلی‌ثانیه
  const rawValues = Object.fromEntries(formData)
  // Validate form fields
  const validatedFields = loginFormSchema.safeParse(
    Object.fromEntries(formData.entries())
  )
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      values: rawValues,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'لطفا فیلدهای لازم را پر کنید.',
      success: false,
    }
  }
  const { identifier, password } = validatedFields.data
  try {
    user = await userCtrl.findOne({
      filters: { $or: [{ email: identifier }, { mobile: identifier }] },
    })
    console.log('#887 user:', user)
    if (!user)
      return {
        values: rawValues,
        message: 'کاربری با این اطلاعات وجود ندارد',
        success: false,
      }

    const flgPasswordCorrect = await comparePassword(password, user.password)
    if (!flgPasswordCorrect)
      return {
        values: rawValues,
        message: 'رمز ورود اشتباه است',
        success: false,
      }

    flgNeedVerification = await verificationCtrl.verificationRequired({ user })
  } catch (error) {
    return {
      values: rawValues,
      message: 'ورود شما امکان پذیر نیست. با پشتیبانی تماس بگیرید',
      success: false,
    }
  }
  if (flgNeedVerification)
    redirect('/verification?purpose=login&user=' + user?.id)

  // Create the session
  const expires = new Date(Date.now() + durationOfSessionValidity)
  const session = await encrypt({ user, expires })

  // Save the session in a cookie
  const cookieStore = await cookies()
  cookieStore.set('session', session, { expires, httpOnly: true })
  redirect('/')
}

/**
 * Creates a user with the given form data.
 *
 * @param prevState - The previous state.
 * @param formData - The form data.
 * @returns An object with errors and a message if there are any, or redirects to the user dashboard.
 */
export async function createUser(prevState: State, formData: FormData) {
  // Validate form fields
  const validatedFields = FormSchema.safeParse(
    Object.fromEntries(formData.entries())
  )
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'لطفا فیلدهای لازم را پر کنید.',
    }
  }

  try {
    // Parse the roles field from a string to an array
    validatedFields.data = {
      ...validatedFields.data,
      roles: JSON.parse(validatedFields.data.roles),
    }
    // Create the user
    const roles: Option[] = validatedFields.data.roles || []
    const cleanedUserData = {
      ...validatedFields.data,
      ...(validatedFields.data.image === '' && { image: null }),
      roles: roles.map((role) => role.value),
      userName: await userCtrl.generateUniqueUsername(),
    }
    await userCtrl.create({ params: cleanedUserData })
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'user',
      slug: [`/dashboard/users`],
    })

    for (const slug of pathes) {
      // این تابع باید یا در همین فایل سرور اکشن یا از طریق api فراخوانی شود. پس محلش نباید تغییر کند.
      revalidatePath(slug)
    }
  } catch (error) {
    // Handle database error
    if (error instanceof z.ZodError) {
      return {
        errors: error.flatten().fieldErrors,
      }
    }
    return {
      message: 'خطای پایگاه داده: ایجاد کاربر ناموفق بود.',
    }
  }
  redirect('/dashboard/users')
}

// Use Zod to update the expected types
const UpdateUserSchema = FormSchema.omit({ password: true })
export async function updateUser(
  id: string,
  prevState: State,
  formData: FormData
) {
  const validatedFields = UpdateUserSchema.safeParse(
    Object.fromEntries(formData.entries())
  )

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'لطفا فیلدهای لازم را پر کنید.',
    }
  }
  try {
    // Parse the roles field from a string to an array
    validatedFields.data = {
      ...validatedFields.data,
      roles: JSON.parse(validatedFields.data.roles),
    }
    // validatedFields.data.image ;
    // Create the user
    console.log('#209 validatedFields.data.roles:', validatedFields.data.roles)
    const roles: Option[] = validatedFields.data.roles || []
    const cleanedUserData = {
      ...validatedFields.data,
      ...(validatedFields.data.image === '' && { image: null }),
      roles: roles.map((role) => role.value),
    }
    console.log('#209 validatedFields.data:', validatedFields.data)
    await userCtrl.findOneAndUpdate({
      filters: id,
      params: cleanedUserData,
    })
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'user',
      slug: [`/dashboard/users`],
    })

    for (const slug of pathes) {
      // این تابع باید یا در همین فایل سرور اکشن یا از طریق api فراخوانی شود. پس محلش نباید تغییر کند.
      revalidatePath(slug)
    }
  } catch (error) {
    console.log('#2776 error: ', error)
    return { message: 'خطای پایگاه داده: بروزرسانی کاربر ناموفق بود.' }
  }
  redirect('/dashboard/users')
}

export async function deleteUsersAction(ids: string[]) {
  try {
    await userCtrl.delete({ filters: ids })
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'user',
      slug: [`/dashboard/users`],
    })

    for (const slug of pathes) {
      // این تابع باید یا در همین فایل سرور اکشن یا از طریق api فراخوانی شود. پس محلش نباید تغییر کند.
      revalidatePath(slug)
    }
  } catch (error) {
    return { message: 'خطای پایگاه داده: حذف کاربر ناموفق بود' }
  }
  redirect('/dashboard/users')
}

export async function searchUser(query: string) {
  try {
    return userCtrl.find({ filters: { query } })
  } catch (error) {
    return { message: 'خطای پایگاه داده: جستجوی کاربر ناموفق بود' }
  }
}

export async function getUserShippingAddresses(userId: string) {
  try {
    const shippingAddresses = await shippingAddressCtrl.findAll({
      filters: { userId: userId },
    })
    return shippingAddresses
  } catch (error) {
    return { message: 'خطای پایگاه داده: جستجوی کاربر ناموفق بود' }
  }
}

export async function signUpAction(prevState: State, formData: FormData) {
  let newUser = null
  const rawValues = Object.fromEntries(formData)
  // Validate form fields
  const validatedFields = SignupFormSchema.safeParse(
    Object.fromEntries(formData.entries())
  )
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      values: rawValues,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'لطفا فیلدهای لازم را پر کنید.',
      success: false,
    }
  }

  if (validatedFields.data.password !== validatedFields.data.confirmPassword) {
    return {
      values: rawValues,
      message: 'تایید رمز عبور با رمز عبور برابر نیست.',
      success: false,
    }
  }
  console.log('#-------------------validatedFields.data:', validatedFields.data)
  try {
    // Parse the roles field from a string to an array
    validatedFields.data = {
      ...validatedFields.data,
    }

    const cleanedUserData = {
      ...validatedFields.data,
      image: null,
      roles: ['subscriber'],
      userName: await userCtrl.generateUniqueUsername(),
    }
    newUser = await userCtrl.create({ params: cleanedUserData })
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'user',
      slug: [`/dashboard/users`],
    })

    for (const slug of pathes) {
      // این تابع باید یا در همین فایل سرور اکشن یا از طریق api فراخوانی شود. پس محلش نباید تغییر کند.
      revalidatePath(slug)
    }
  } catch (error) {
    console.log('#---65 signup error:', error)
    // Handle database error
    if (error instanceof z.ZodError) {
      return {
        values: rawValues,
        errors: error.flatten().fieldErrors,
      }
    }
    return {
      values: rawValues,
      message: 'خطای پایگاه داده: ایجاد کاربر ناموفق بود.',
      success: false,
    }
  }
  const settings: Settings = (await getSettings()) as Settings
  if (settings.emailVerificationRequired || settings.mobileVerificationRequired)
    redirect('/verification?purpose=signup&user=' + newUser?.id)
  redirect('/login')
}
