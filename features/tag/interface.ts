import { Id, Model, SchemaModel } from '@/lib/entity/core/interface'

export type TagTranslationSchema = {
  /**
   * زبان مطلب
   */
  lang: string // "fa", "en", "de", ...

  /**
   * عنوان برچسب
   */
  title: string

  /**
   * توضیحات مربوط به برچسب
   */
  description: string
}

/**
 * اطلاعات پایه برچسب که شامل فیلدهای اصلی برچسب می‌باشد
 */
type TagBase = {
  /**
   * نامک برچسب
   */
  slug: string

  /**
   * محتوا
   */
  translations: [TagTranslationSchema]

  /**
   * شناسه تصویر برچسب
   */
  image: Id

  /**
   * وضعیت فعال بودن برچسب (در صورت فعال بودن true)
   */
  status: 'active' | 'inactive'

  /**
   * کاربر سازنده
   */
  user: Id
}

/**
 * مدل برچسب که شامل اطلاعات پایه برچسب و ویژگی‌های اضافی مدل می‌باشد
 */
export type Tag = Model & TagBase

/**
 * مدل اسکیمای برچسب برای پایگاه داده که شامل اطلاعات پایه برچسب و ویژگی‌های اضافی اسکیمای پایگاه داده می‌باشد
 */
export type TagSchema = SchemaModel & TagBase

/**
 * ساختار درخواست ارسال داده‌های برچسب که شامل اطلاعات پایه برچسب می‌باشد
 */
export type TagInput = TagBase
