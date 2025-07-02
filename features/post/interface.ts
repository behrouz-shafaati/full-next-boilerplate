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
   * تصویر پست
   */
  image?: string

  /**
   * آدرس یکتای پست
   */
  slug: string

  /**
   * وضعیت فعال بودن مطلب (در صورت فعال بودن true)
   */
  status: 'publish' | 'draft'
}

/**
 * مدل مطلب که شامل اطلاعات پایه مطلب و ویژگی‌های اضافی مدل می‌باشد
 */
export type Post = Model & PostBase

/**
 * مدل اسکیمای مطلب برای پایگاه داده که شامل اطلاعات پایه مطلب و ویژگی‌های اضافی اسکیمای پایگاه داده می‌باشد
 */
export type PostSchema = SchemaModel &
  Omit<PostBase, 'status'> & { status: number }

/**
 * ساختار درخواست ارسال داده‌های مطلب که شامل اطلاعات پایه مطلب می‌باشد
 */
export type PostInput = PostBase
