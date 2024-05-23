'use server';

import { z } from 'zod';
import shippingAddressCtrl from './controller';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
  name: z.string({}).min(1, { message: 'لطفا نام تحویل گیرنده را وارد کنید.' }),
  countryId: z.string({}).min(1, { message: 'لطفا کشور را وارد کنید.' }),
  provinceId: z.string({}).min(1, { message: 'لطفا استان را تعیین کنید.' }),
  cityId: z.string({}).min(1, { message: 'لطفا شهر را تعیین کنید.' }),
  address: z.string({}).min(1, { message: 'لطفا جزییات آدرس را وارد کنید.' }),
  postalCode: z.string({}).min(1, { message: 'لطفا کد پستی را وارد کنید.' }),
  mobile: z.string({}).min(1, { message: 'لطفا موبایل را وارد کنید.' }),
  companyName: z.string({}).nullable(),
  email: z.string({}).nullable(),
  isDefault: z.custom().nullable(), // checkbox
  userId: z.string({}),
});

export type State = {
  errors?: {
    title?: string[];
  };
  message?: string | null;
};

/**
 * Creates a shippingAddress with the given form data.
 *
 * @param prevState - The previous state.
 * @param formData - The form data.
 * @returns An object with errors and a message if there are any, or redirects to the shippingAddress dashboard.
 */
export async function createShippingAddress(
  prevState: State,
  formData: FormData
) {
  // Validate form fields
  const validatedFields = FormSchema.safeParse(
    Object.fromEntries(formData.entries())
  );
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'لطفا فیلدهای لازم را پر کنید.',
    };
  }

  const userId = validatedFields.data.userId;
  try {
    // Create the shippingAddress
    await shippingAddressCtrl.create({ params: validatedFields.data });
  } catch (error) {
    // Handle database error
    if (error instanceof z.ZodError) {
      return {
        errors: error.flatten().fieldErrors,
      };
    }
    return {
      message: 'خطای پایگاه داده: ایجاد آدرس ناموفق بود.',
    };
  }

  // Revalidate the path and redirect to the shippingAddress dashboard
  revalidatePath(`/dashboard/users/${userId}/edit/addresses`);
  redirect(`/dashboard/users/${userId}/edit/addresses`);
}

export async function updateShippingAddress(
  id: string,
  prevState: State,
  formData: FormData
) {
  const validatedFields = FormSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'لطفا فیلدهای لازم را پر کنید.',
    };
  }
  const userId = validatedFields.data.userId;
  try {
    await shippingAddressCtrl.findOneAndUpdate({
      filters: id,
      params: validatedFields.data,
    });
  } catch (error) {
    return { message: 'خطای پایگاه داده: بروزرسانی آدرس ناموفق بود.' };
  }
  revalidatePath(`/dashboard/users/${userId}/edit/addresses`);
  redirect(`/dashboard/users/${userId}/edit/addresses`);
}

export async function deleteShippingAddress(id: string) {
  try {
    await shippingAddressCtrl.delete({ filters: [id] });
  } catch (error) {
    return { message: 'خطای پایگاه داده: حذف آدرس ناموفق بود' };
  }
  await shippingAddressCtrl.delete({ filters: [id] });
  revalidatePath('/dashboard/shippingAddresses');
}
