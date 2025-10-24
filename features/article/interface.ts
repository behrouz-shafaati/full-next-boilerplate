import { Id, Model, SchemaModel } from '@/lib/entity/core/interface'
import { User } from '../user/interface'
import { Category } from '../category/interface'
import { Tag } from '../tag/interface'

export type ArticleTranslationSchema = {
  /**
   * زبان مقاله
   */
  lang: string // "fa", "en", "de", ...
  /**
   * عنوان مقاله
   */
  title: string
  /**
   * عنوان سئو مقاله
   */
  seoTitle: string
  /**
   * Meta Description
   */
  metaDescription: string
  /**
   * خلاصه‌ای از متن مقاله
   */
  excerpt: string
  /**
   * Schema LD
   */
  jsonLd: string

  /**
   * محتوای مقاله
   */
  contentJson: string

  /**
   * زمان مطالعه به دقیقه
   */
  readingTime: number
}
/**
 * اطلاعات پایه مقاله که شامل فیلدهای اصلی مقاله می‌باشد
 */
type ArticleBase = {
  /**
   * آدرس یکتای مقاله
   */
  slug: string

  /**
   * زیان های مختلف مقاله
   */
  translations: [ArticleTranslationSchema]

  /**
   * وضعیت فعال بودن مقاله (در صورت فعال بودن true)
   */
  status: 'published' | 'draft'

  // example: 'pen/مقاله-یک'
  href: string

  /**
   * تاریخ انتشار
   */
  publishedAt: Date
}
type Article_FK_Schema = {
  /**
   * ایجاد کننده مقاله
   */
  user?: Id

  /**
   * نویسنده مقاله
   */
  author?: Id

  /**
   * تصویر مقاله
   */
  image?: Id
  /**
   * دسته‌بندی اصلی مقاله
   */
  mainCategory?: Id

  /**
   * دسته‌بندی مقاله
   */
  categories?: Id[]

  /**
   * برچسب های مقاله
   */
  tags?: Id[]
}
type Article_FK_Populate = {
  /**
   * ایجاد کننده مقاله
   */
  user: User

  /**
   * نویسنده مقاله
   */
  author: User

  /**
   * تصویر مقاله
   */
  image?: File
  /**
   * دسته‌بندی اصلی مقاله
   */
  mainCategory?: Category

  /**
   * دسته‌بندی مقاله
   */
  categories?: Category[]

  /**
   * برچسب های مقاله
   */
  tags?: Tag[]
}

/**
 *
 */
export type Article = Model & ArticleBase & Article_FK_Populate

/**
 * مدل اسکیمای مقاله برای پایگاه داده که شامل اطلاعات پایه مقاله و ویژگی‌های اضافی اسکیمای پایگاه داده می‌باشد
 */
export type ArticleSchema = SchemaModel & ArticleBase & Article_FK_Schema

/**
 * ساختار درخواست ارسال داده‌های مقاله که شامل اطلاعات پایه مقاله می‌باشد
 */
export type ArticleInput = ArticleBase & Article_FK_Schema
