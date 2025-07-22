import { Id, Model, SchemaModel } from '@/lib/entity/core/interface'

/**
 * اطلاعات پایه برچسب که شامل فیلدهای اصلی برچسب می‌باشد
 */
type TagBase = {
  /**
   * عنوان برچسب
   */
  title: string

  /**
   * نامک برچسب
   */
  slug: string

  /**
   * توضیحات مربوط به برچسب
   */
  description: string

  /**
   * شناسه تصویر برچسب
   */
  image: Id

  /**
   * وضعیت فعال بودن برچسب (در صورت فعال بودن true)
   */
  status: 'active' | 'inactive'
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
