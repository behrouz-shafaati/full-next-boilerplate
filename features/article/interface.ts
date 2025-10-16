import { Id, Model, SchemaModel } from '@/lib/entity/core/interface'

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
   * ایجاد کننده مقاله
   */
  user?: string

  /**
   * نویسنده مقاله
   */
  author?: string

  /**
   * تصویر مقاله
   */
  image?: string

  /**
   * آدرس یکتای مقاله
   */
  slug: string

  /**
   * زیان های مختلف مقاله
   */
  translations: [ArticleTranslationSchema]

  /**
   * دسته‌بندی اصلی مقاله
   */
  mainCategory?: string

  /**
   * دسته‌بندی مقاله
   */
  categories?: string[]

  /**
   * برچسب های مقاله
   */
  tags?: string[]

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

/**
 * مدل مقاله که شامل اطلاعات پایه مقاله و ویژگی‌های اضافی مدل می‌باشد
 */
export type Article = Model & ArticleBase

/**
 * مدل اسکیمای مقاله برای پایگاه داده که شامل اطلاعات پایه مقاله و ویژگی‌های اضافی اسکیمای پایگاه داده می‌باشد
 */
export type ArticleSchema = SchemaModel & ArticleBase

/**
 * ساختار درخواست ارسال داده‌های مقاله که شامل اطلاعات پایه مقاله می‌باشد
 */
export type ArticleInput = ArticleBase
