'use server'

import { z } from 'zod'
import postCommentCtrl from '@/features/post-comment/controller'
import { redirect } from 'next/navigation'
import { createPostHref, extractExcerptFromContentJson } from '../post/utils'
import { getSession } from '@/lib/auth'
import { Option, Session, State } from '@/types'
import tagCtrl from '../tag/controller'
import {
  QueryFind,
  QueryResponse,
  QueryResult,
} from '@/lib/entity/core/interface'
import { PostComment, PostCommentTranslationSchema } from './interface'
import categoryCtrl from '../category/controller'
import revalidatePathCtrl from '@/lib/revalidatePathCtrl'
import { revalidatePath } from 'next/cache'
import postCtrl from '../post/controller'
import { Post } from '../post/interface'
import { renderTiptapJsonToHtml } from '@/lib/renderTiptapToHtml'
import { buildCommentTree } from './utils'
import { getTranslation } from '@/lib/utils'
import { getSettings } from '../settings/controller'

const FormSchema = z.object({
  contentJson: z.string({}),
  locale: z.string({}),
  parent: z.string({}),
})

const updateStatusPostCommentSchema = z.object({
  status: z.enum(['approved', 'rejected', 'pending']),
})

/**
 * Creates a postComment with the given form data.
 *
 * @param prevState - The previous state.
 * @param formData - The form data.
 * @returns An object with errors and a message if there are any, or redirects to the postComment dashboard.
 */
export async function createPostComment(
  id: string,
  prevState: State,
  formData: FormData
) {
  // Validate form fields
  let newPostComment = null
  const rawValues = Object.fromEntries(formData.entries())
  console.log('#234987 rawValues:', rawValues)
  const values = {
    ...rawValues,
    locale: rawValues?.locale,
    translation: {
      lang: rawValues?.lang || 'fa',
      contentJson: rawValues.contentJson || '',
    },
  }
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
    const cleanedParams = await sanitizePostCommentData(validatedFields)
    newPostComment = await postCommentCtrl.create({
      params: { post: id, ...cleanedParams },
    })
    const post = await postCtrl.findById({
      id,
    })
    // Revalidate the path
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'postComment',
      slug: [createPostHref(post as Post), `/dashboard/postComments`],
    })
    for (const slug of pathes) {
      // این تابع باید یا در همین فایل سرور اکشن یا از طریق api فراخوانی شود. پس محلش نباید تغییر کند.+
      revalidatePath(slug)
    }

    return {
      message: 'دیدگاه شما ثبت شد',
      success: true,
      values: newPostComment,
    }
  } catch (error) {
    console.log('#error in create postComment:', error)
    // Handle database error
    if (error instanceof z.ZodError) {
      return {
        errors: error.flatten().fieldErrors,
        values,
      }
    }
    return {
      message: 'خطای پایگاه داده: ثبت دیدگاه ناموفق بود.',
      success: false,
      values,
    }
  }
  // if (newPostComment)
  //   redirect(encodeURI(`/dashboard/postComments/${newPostComment.id}`))
  // else redirect(`/dashboard/postComments`)
}

export async function updatePostComment(
  id: string,
  prevState: State,
  formData: FormData
) {
  let updatedPostComment = {}
  const rawValues = Object.fromEntries(formData.entries())
  const values = {
    ...rawValues,
    translation: {
      lang: rawValues?.lang || 'fa',
      title: rawValues?.title || '',
      contentJson: rawValues.contentJson || '',
    },
  }
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
    const params = await sanitizePostCommentData(validatedFields, id)
    const cleanedParams = await postCommentCtrl.generateUniquePostSlug(
      params,
      id
    )
    const mainCategory = await categoryCtrl.findById({
      id: cleanedParams.mainCategory,
    })
    updatedPostComment = await postCommentCtrl.findOneAndUpdate({
      filters: id,
      params: cleanedParams,
    })
    // Revalidate the path
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'postComment',
      slug: [
        createPostHref(updatedPostComment?.post as Post),
        `/dashboard/postComments`,
      ],
    })

    for (const slug of pathes) {
      // این تابع باید یا در همین فایل سرور اکشن یا از طریق api فراخوانی شود. پس محلش نباید تغییر کند.
      revalidatePath(slug)
    }
    return { message: 'فایل با موفقیت بروز رسانی شد', success: true, values }
  } catch (error) {
    return {
      message: 'خطای پایگاه داده: بروزرسانی دیدگاه ناموفق بود.',
      success: false,
      values: updatedPostComment,
    }
  }
}

export async function updateStatusPostComment(
  id: string,
  prevState: State,
  formData: FormData | Record<string, any> | null | undefined
) {
  let raw: Record<string, any> = {}
  if (formData && typeof (formData as any).entries === 'function') {
    raw = Object.fromEntries((formData as FormData).entries())
  } else if (formData && typeof formData === 'object') {
    raw = formData
  }

  const parsed = updateStatusPostCommentSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
      message: 'بروزرسانی دیدگاه ناموفق بود',
    }
  }

  try {
    const updatedPostComment = await postCommentCtrl.updatePostCommentStatus({
      filters: id,
      params: parsed.data,
    })
    // Revalidate the path
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'postComment',
      slug: [
        createPostHref(updatedPostComment?.post as Post),
        `/dashboard/postComments`,
      ],
    })

    for (const slug of pathes) {
      // این تابع باید یا در همین فایل سرور اکشن یا از طریق api فراخوانی شود. پس محلش نباید تغییر کند.
      revalidatePath(slug)
    }
    return { message: 'فایل با موفقیت بروز رسانی شد', success: true }
  } catch (error) {
    return {
      message: 'خطای پایگاه داده: بروزرسانی دیدگاه ناموفق بود.',
      success: false,
    }
  }
}

export async function deletePostComment(id: string) {
  try {
    const postComment = await postCommentCtrl.findById({ id })
    await postCommentCtrl.delete({ filters: [id] }) // Revalidate the path
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'postComment',
      slug: [
        createPostHref(postComment?.post as Post),
        `/dashboard/postComments`,
      ],
    })

    for (const slug of pathes) {
      // این تابع باید یا در همین فایل سرور اکشن یا از طریق api فراخوانی شود. پس محلش نباید تغییر کند.
      revalidatePath(slug)
    }
  } catch (error) {
    return {
      message: 'خطای پایگاه داده: حذف دیدگاه ناموفق بود',
      success: false,
    }
  }
}

async function sanitizePostCommentData(
  validatedFields: any,
  id?: string | undefined
) {
  let prevState = { translations: [] }
  const session = (await getSession()) as Session
  // Create the postComment
  const postCommentPayload = validatedFields.data
  const excerpt = extractExcerptFromContentJson(
    postCommentPayload.contentJson,
    50
  )
  const createdBy = session?.user.id || null
  const author = session?.user.id || null
  const translations = [
    {
      lang: postCommentPayload.locale,
      excerpt,
      contentJson: postCommentPayload.contentJson,
      readingTime: postCommentPayload.readingTime,
    },
    ...prevState.translations.filter(
      (t: PostCommentTranslationSchema) => t.lang != postCommentPayload.lang
    ),
  ]
  const parent =
    postCommentPayload.parent == '' ? null : postCommentPayload.parent
  const params = {
    ...postCommentPayload,
    createdBy,
    author,
    translations,
    parent,
  }

  return params
}

export async function getPostComments(
  payload: QueryFind
): Promise<QueryResponse<PostComment>> {
  const filters: Record<string, any> = { ...(payload.filters ?? {}) }

  return postCommentCtrl.findAll({
    filters,
    sort: { createdAt: 1 },
  })
}

export async function getPostCommentsForClient(payload: QueryFind) {
  const commentApprovalRequired = await getSettings('commentApprovalRequired')
  if (commentApprovalRequired) payload.filters.status = 'approved'
  return getPostComments(payload)
}
