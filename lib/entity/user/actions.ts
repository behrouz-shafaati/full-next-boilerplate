'use server'

import { z } from 'zod'
import userCtrl from '@/lib/entity/user/controller'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import shippingAddressCtrl from '../shippingAddress/controller'
import { AuthError } from 'next-auth'
import { login } from '@/lib/auth'
import { Option } from '@/types'

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

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await login(formData)
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'ایمیل با رمز عبور صحیح نیست'
        default:
          return 'خطایی رخ داده است'
      }
    }
    throw error
  }
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
    }
    await userCtrl.create({ params: cleanedUserData })
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

  // Revalidate the path and redirect to the user dashboard
  revalidatePath('/dashboard/users')
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
  } catch (error) {
    console.log('#2776 error: ', error)
    return { message: 'خطای پایگاه داده: بروزرسانی کاربر ناموفق بود.' }
  }
  revalidatePath('/dashboard/users')
  redirect('/dashboard/users')
}

export async function deleteUser(id: string) {
  try {
    await userCtrl.delete({ filters: [id] })
  } catch (error) {
    return { message: 'خطای پایگاه داده: حذف کاربر ناموفق بود' }
  }
  await userCtrl.delete({ filters: [id] })
  // Revalidate the path and redirect to the user dashboard
  revalidatePath('/dashboard/users')
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
