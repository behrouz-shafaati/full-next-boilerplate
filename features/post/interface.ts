import { Id, Model, SchemaModel } from '@/lib/entity/core/interface'

/**
 * اطلاعات پایه مطلب که شامل فیلدهای اصلی مطلب می‌باشد
 */
type PostBase = {
  /**
   * عنوان مطلب
   */
  title: string

  /**
   * نویسنده پست
   */
  user?: string

  /**
   * خلاصه‌ای از متن پست
   */
  excerpt: string

  /**
   * توضیحات مربوط به مطلب
   */
  contentJson: string

  /**
   * زمان مطالعه به دقیقه
   */
  readingTime: number

  /**
   * تصویر پست
   */
  image?: string

  /**
   * آدرس یکتای پست
   */
  slug: string

  /**
   * دسته‌بندی اصلی پست
   */
  mainCategory?: string

  /**
   * دسته‌بندی پست
   */
  categories?: string[]

  /**
   * برچسب های پست
   */
  tags?: string[]

  /**
   * وضعیت فعال بودن مطلب (در صورت فعال بودن true)
   */
  status: 'published' | 'draft'

  // example: 'pen/مقاله-یک'
  link: string
}

/**
 * مدل مطلب که شامل اطلاعات پایه مطلب و ویژگی‌های اضافی مدل می‌باشد
 */
export type Post = Model & PostBase

/**
 * مدل اسکیمای مطلب برای پایگاه داده که شامل اطلاعات پایه مطلب و ویژگی‌های اضافی اسکیمای پایگاه داده می‌باشد
 */
export type PostSchema = SchemaModel & PostBase

/**
 * ساختار درخواست ارسال داده‌های مطلب که شامل اطلاعات پایه مطلب می‌باشد
 */
export type PostInput = PostBase
