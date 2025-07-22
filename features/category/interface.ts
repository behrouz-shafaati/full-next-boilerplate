import { Id, Model, SchemaModel } from '@/lib/entity/core/interface'

/**
 * اطلاعات پایه دسته‌بندی که شامل فیلدهای اصلی دسته‌بندی می‌باشد
 */
type CategoryBase = {
  /**
   * شیء والد دسته‌بندی (اختیاری، می‌تواند هر نوع داده‌ای باشد)
   */
  parent: Category | null

  /**
   * عنوان دسته‌بندی
   */
  title: string

  /**
   * عنوان برچسب
   */
  slug: string

  /**
   * توضیحات مربوط به دسته‌بندی
   */
  description: string

  /**
   * شناسه تصویر دسته‌بندی
   */
  image: Id

  /**
   * وضعیت فعال بودن دسته‌بندی (در صورت فعال بودن true)
   */
  status: 'active' | 'inactive'
}

/**
 * مدل دسته‌بندی که شامل اطلاعات پایه دسته‌بندی و ویژگی‌های اضافی مدل می‌باشد
 */
export type Category = Model & CategoryBase

/**
 * مدل اسکیمای دسته‌بندی برای پایگاه داده که شامل اطلاعات پایه دسته‌بندی و ویژگی‌های اضافی اسکیمای پایگاه داده می‌باشد
 */
export type CategorySchema = SchemaModel &
  Omit<CategoryBase, 'parent'> & { parent: Id }

/**
 * ساختار درخواست ارسال داده‌های دسته‌بندی که شامل اطلاعات پایه دسته‌بندی می‌باشد
 */
export type CategoryInput = CategoryBase
