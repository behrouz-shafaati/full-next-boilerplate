import { Id, Model, SchemaModel } from '@/lib/entity/core/interface'
import { User } from '../user/interface'
import { Article } from '../article/interface'

export type ArticleCommentTranslationSchema = {
  /**
   * زبان مقاله
   */
  lang: string // "fa", "en", "de", ...

  /**
   * توضیحات مربوط به مقاله
   */
  contentJson: string
}
/**
 * اطلاعات پایه مقاله که شامل فیلدهای اصلی مقاله می‌باشد
 */
type ArticleCommentBase = {
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
   *  نام کاربر میهمان
   */
  authorName: string

  /**
   * زیان های مختلف نظر
   */
  translations: [ArticleCommentTranslationSchema]

  /**
   *  نوع دیدگاه یا سوال
   */
  type: 'comment' | 'question'

  /**
   * وضعیت فعال بودن مقاله (در صورت فعال بودن true)
   */
  status: 'pending' | 'approved' | 'rejected'
}

type ArticleComment_FK_Populate = {
  /**
   * کاربری که به عنوان نویسنده نمایش داده میشه
   */
  author?: User
  /**
   *   مقاله ای که کامنت براش ثبت میشه
   */
  article: Article
}

type ArticleComment_FK_Schema = {
  /**
   * کاربری که به عنوان نویسنده نمایش داده میشه
   */
  author?: Id
  /**
   *   مقاله ای که کامنت براش ثبت میشه
   */
  article: Id
}

/**
 * مدل مقاله که شامل اطلاعات پایه مقاله و ویژگی‌های اضافی مدل می‌باشد
 */
export type ArticleComment = Model &
  ArticleCommentBase &
  ArticleComment_FK_Populate

/**
 * مدل اسکیمای مقاله برای پایگاه داده که شامل اطلاعات پایه مقاله و ویژگی‌های اضافی اسکیمای پایگاه داده می‌باشد
 */
export type ArticleCommentSchema = SchemaModel &
  ArticleCommentBase &
  ArticleComment_FK_Schema

/**
 * ساختار درخواست ارسال داده‌های مقاله که شامل اطلاعات پایه مقاله می‌باشد
 */
export type ArticleCommentInput = ArticleCommentBase & ArticleComment_FK_Schema
