import { Id, Model, SchemaModel } from '@/lib/entity/core/interface'

export type PostCommentTranslationSchema = {
  /**
   * زبان مطلب
   */
  lang: string // "fa", "en", "de", ...

  /**
   * توضیحات مربوط به مطلب
   */
  contentJson: string
}
/**
 * اطلاعات پایه مطلب که شامل فیلدهای اصلی مطلب می‌باشد
 */
type PostCommentBase = {
  /**
   *  پستی که کامنت براش ثبت میشه
   */
  post: Id

  /**
   *  کامنتی که به اون پاسخ داده میشه
   */
  parent: Id

  /**
   *  زبان کاربر نویسنده نظر
   */
  locale: string

  /**
   *  کاربری که نظر رو در دیتابیش ایجاد کرده
   */
  createdBy: Id

  /**
   * کاربری که به عنوان نویسنده نمایش داده میشه
   */
  author?: string

  /**
   *  نام کاربر میهمان
   */
  authorName: string

  /**
   * زیان های مختلف نظر
   */
  translations: [PostCommentTranslationSchema]

  /**
   *  نوع دیدگاه یا سوال
   */
  type: 'comment' | 'question'

  /**
   * وضعیت فعال بودن مطلب (در صورت فعال بودن true)
   */
  status: 'pending' | 'approved' | 'rejected'
}

/**
 * مدل مطلب که شامل اطلاعات پایه مطلب و ویژگی‌های اضافی مدل می‌باشد
 */
export type PostComment = Model & PostCommentBase

/**
 * مدل اسکیمای مطلب برای پایگاه داده که شامل اطلاعات پایه مطلب و ویژگی‌های اضافی اسکیمای پایگاه داده می‌باشد
 */
export type PostCommentSchema = SchemaModel & PostCommentBase

/**
 * ساختار درخواست ارسال داده‌های مطلب که شامل اطلاعات پایه مطلب می‌باشد
 */
export type PostCommentInput = PostCommentBase
