import { Id, Model, SchemaModel } from '@/lib/entity/core/interface'

export type MenuItem = {
  label: string
  url: string
  icon: string
  subMenu: MenuItem[]
}
/**
 * اطلاعات پایه فهرست که شامل فیلدهای اصلی فهرست می‌باشد
 */
type MenuBase = {
  /**
   * عنوان فهرست
   */
  title: string

  /**
   * آیتم های مربوط به فهرست
   */
  items: MenuItem[]
}

/**
 * مدل فهرست که شامل اطلاعات پایه فهرست و ویژگی‌های اضافی مدل می‌باشد
 */
export type Menu = Model & MenuBase

/**
 * مدل اسکیمای فهرست برای پایگاه داده که شامل اطلاعات پایه فهرست و ویژگی‌های اضافی اسکیمای پایگاه داده می‌باشد
 */
export type MenuSchema = SchemaModel & MenuBase

/**
 * ساختار درخواست ارسال داده‌های فهرست که شامل اطلاعات پایه فهرست می‌باشد
 */
export type MenuInput = MenuBase
