'use server'

import { z } from 'zod'
import articleCommentCtrl from '@/features/article-comment/controller'
import {
  createArticleHref,
  extractExcerptFromContentJson,
} from '../article/utils'
import { getSession } from '@/lib/auth'
import { Session, State } from '@/types'
import { QueryFind, QueryResponse } from '@/lib/entity/core/interface'
import { ArticleComment, ArticleCommentTranslationSchema } from './interface'
import categoryCtrl from '../category/controller'
import revalidatePathCtrl from '@/lib/revalidatePathCtrl'
import { revalidatePath } from 'next/cache'
import articleCtrl from '../article/controller'
import { Article } from '../article/interface'
import { getSettings } from '../settings/controller'
import { User } from '../user/interface'
import { can } from '@/lib/utils/can.server'

const FormSchema = z.object({
  contentJson: z.string({}),
  locale: z.string({}),
  parent: z.string({}),
})

const updateStatusArticleCommentSchema = z.object({
  status: z.enum(['approved', 'rejected', 'pending']),
})

/**
 * Creates a articleComment with the given form data.
 *
 * @param prevState - The previous state.
 * @param formData - The form data.
 * @returns An object with errors and a message if there are any, or redirects to the articleComment dashboard.
 */
export async function createArticleComment(
  id: string,
  prevState: State,
  formData: FormData
) {
  // Validate form fields
  let newArticleComment = null
  const rawValues = Object.fromEntries(formData.entries())
  console.log('#23498xx7 rawValues:', rawValues)
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
    const user = (await getSession())?.user as User
    await can(user.roles, 'articleComment.create')
    const article = await articleCtrl.findById({
      id,
    })
    const cleanedParams = await sanitizeArticleCommentData(validatedFields, id)
    newArticleComment = await articleCommentCtrl.create({
      params: { article: id, ...cleanedParams },
    })

    // Revalidate the path
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'articleComment',
      slug: [
        createArticleHref(article as Article),
        `/dashboard/articleComments`,
      ],
    })
    for (const slug of pathes) {
      // این تابع باید یا در همین فایل سرور اکشن یا از طریق api فراخوانی شود. پس محلش نباید تغییر کند.+
      revalidatePath(slug)
    }
    return {
      message: 'دیدگاه شما ثبت شد',
      success: true,
      values: newArticleComment,
    }
  } catch (error: any) {
    if (error.message === 'Forbidden') {
      return {
        success: false,
        status: 403,
        message: 'شما اجازه انجام این کار را ندارید',
        values,
      }
    }
    // Handle database error
    if (error instanceof z.ZodError) {
      return {
        errors: error.flatten().fieldErrors,
        values,
      }
    }
    if (process.env.NODE_ENV === 'development') throw error
    console.log(error)
    return {
      message: 'خطای پایگاه داده: ثبت دیدگاه ناموفق بود.',
      success: false,
      values,
    }
  }
  // if (newArticleComment)
  //   redirect(encodeURI(`/dashboard/articleComments/${newArticleComment.id}`))
  // else redirect(`/dashboard/articleComments`)
}

export async function updateArticleComment(
  id: string,
  prevState: State,
  formData: FormData
) {
  const user = (await getSession())?.user as User
  let updatedArticleComment = {}
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
    const prevArticleComment: ArticleComment =
      await articleCommentCtrl.findById({ id })

    // if user loged in and send comment
    if (prevArticleComment?.author)
      await can(
        user.roles,
        prevArticleComment?.author?.id !== user.id
          ? 'article.edit.any'
          : 'article.edit.own'
      )
    // user send comment as guest
    else await can(user.roles, 'article.edit.any')
    const params = await sanitizeArticleCommentData(validatedFields, id)
    const cleanedParams = await articleCtrl.generateUniqueArticleSlug(
      params,
      id
    )
    updatedArticleComment = await articleCommentCtrl.findOneAndUpdate({
      filters: id,
      params: cleanedParams,
    })
    const article = await articleCtrl.findById({
      id,
    })
    // Revalidate the path
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'articleComment',
      slug: [
        createArticleHref(article as Article),
        `/dashboard/articleComments`,
      ],
    })

    for (const slug of pathes) {
      // این تابع باید یا در همین فایل سرور اکشن یا از طریق api فراخوانی شود. پس محلش نباید تغییر کند.
      revalidatePath(slug)
    }
    return { message: 'فایل با موفقیت بروز رسانی شد', success: true, values }
  } catch (error: any) {
    if (error.message === 'Forbidden') {
      return {
        success: false,
        status: 403,
        message: 'شما اجازه انجام این کار را ندارید',
        values,
      }
    }
    if (process.env.NODE_ENV === 'development') throw error
    console.log(error)
    return {
      message: 'خطای پایگاه داده: بروزرسانی دیدگاه ناموفق بود.',
      success: false,
      values: updatedArticleComment,
    }
  }
}

export async function updateStatusArticleComment(
  id: string,
  prevState: State,
  formData: FormData | Record<string, any> | null | undefined
) {
  const user = (await getSession())?.user as User
  let raw: Record<string, any> = {}
  if (formData && typeof (formData as any).entries === 'function') {
    raw = Object.fromEntries((formData as FormData).entries())
  } else if (formData && typeof formData === 'object') {
    raw = formData
  }

  const parsed = updateStatusArticleCommentSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
      message: 'بروزرسانی دیدگاه ناموفق بود',
    }
  }
  console.log('#09345798 id v params:', id, 'and: ', parsed.data)
  try {
    await can(user.roles, 'articleComment.moderate.any')
    const updatedArticleComment = await articleCommentCtrl.findOneAndUpdate({
      filters: id,
      params: parsed.data,
    })
    // Revalidate the path
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'articleComment',
      slug: [
        createArticleHref(updatedArticleComment?.article as Article),
        `/dashboard/articleComments`,
      ],
    })

    for (const slug of pathes) {
      // این تابع باید یا در همین فایل سرور اکشن یا از طریق api فراخوانی شود. پس محلش نباید تغییر کند.
      revalidatePath(slug)
    }
    return { message: 'فایل با موفقیت بروز رسانی شد', success: true }
  } catch (error: any) {
    if (error.message === 'Forbidden') {
      return {
        success: false,
        status: 403,
        message: 'شما اجازه انجام این کار را ندارید',
      }
    }
    if (process.env.NODE_ENV === 'development') throw error
    console.log(error)
    return {
      message: 'خطای پایگاه داده: بروزرسانی دیدگاه ناموفق بود.',
      success: false,
    }
  }
}

export async function deleteArticleCommentAction(ids: string[]) {
  try {
    const user = (await getSession())?.user as User
    const articleCommentsResult = await articleCommentCtrl.findAll({
      filters: { _id: { $in: ids } },
    })
    for (const prevArticle of articleCommentsResult.data) {
      if (prevArticle.author)
        await can(
          user.roles,
          prevArticle.author.id !== user.id
            ? 'articleComment.delete.any'
            : 'articleComment.delete.own'
        )
      else await can(user.roles, 'articleComment.delete.any')
    }
    await articleCommentCtrl.delete({ filters: ids }) // Revalidate the path
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'articleComment',
      slug: [
        ...articleCommentsResult.data.map((ac) =>
          createArticleHref(ac?.article as Article)
        ),
        `/dashboard/articleComments`,
      ],
    })

    for (const slug of pathes) {
      // این تابع باید یا در همین فایل سرور اکشن یا از طریق api فراخوانی شود. پس محلش نباید تغییر کند.
      revalidatePath(slug)
    }
    return {
      seccess: true,
    }
  } catch (error: any) {
    if (error.message === 'Forbidden') {
      return {
        success: false,
        status: 403,
        message: 'شما اجازه انجام این کار را ندارید',
      }
    }
    if (process.env.NODE_ENV === 'development') throw error
    console.log(error)
    return {
      message: 'خطای پایگاه داده: حذف دیدگاه ناموفق بود',
      success: false,
    }
  }
}

async function sanitizeArticleCommentData(
  validatedFields: any,
  id?: string | undefined
) {
  let prevState = { translations: [] }
  const session = (await getSession()) as Session
  // Create the articleComment
  const articleCommentPayload = validatedFields.data
  const excerpt = extractExcerptFromContentJson(
    articleCommentPayload.contentJson,
    50
  )
  const createdBy = session?.user.id || null
  const author = session?.user.id || null

  const translations = [
    {
      lang: articleCommentPayload.locale,
      excerpt,
      contentJson: articleCommentPayload.contentJson,
      readingTime: articleCommentPayload.readingTime,
    },
    ...prevState.translations.filter(
      (t: ArticleCommentTranslationSchema) =>
        t.lang != articleCommentPayload.lang
    ),
  ]
  const parent =
    articleCommentPayload.parent == '' ? null : articleCommentPayload.parent
  const params = {
    ...articleCommentPayload,
    articleId: id,
    createdBy,
    author,
    translations,
    parent,
  }

  return params
}

export async function getArticleComments(
  payload: QueryFind
): Promise<QueryResponse<ArticleComment>> {
  const filters: Record<string, any> = { ...(payload.filters ?? {}) }

  return articleCommentCtrl.findAll({
    filters,
    sort: { createdAt: 1 },
  })
}

export async function getArticleCommentsForClient(payload: QueryFind) {
  const commentApprovalRequired = await getSettings('commentApprovalRequired')
  if (commentApprovalRequired) payload.filters.status = 'approved'
  return getArticleComments(payload)
}
