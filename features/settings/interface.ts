import { Id, Model, SchemaModel } from '@/lib/entity/core/interface'

/**
 * اطلاعات پایه تنظیمات که شامل فیلدهای اصلی تنظیمات می‌باشد
 */
type SettingsBase = {
  /**
   * کلید واژه تک داکیومنت مربوط به تنظیمات
   */
  type: 'site-settings'

  /**
   * شناسه برگه خانه
   */
  homePageId: Id

  /**
   * شناسه منو‌ی اصلی
   */
  primaryMenuId: string

  /**
   * شناسه سربرگ پیش فرض
   */
  defaultHeaderId: Id

  /**
   * شناسه فوتر اصلی
   */
  footerMenuId: string

  /**
   * تنظیمات مربوط به پست
   */
  theme: {
    primaryColor: String
    backgroundColor: String
    darkMode: Boolean
  }

  /**
   * اطلاعات مربوط به ادغام با سایر سرویس دهندگان
   */
  integrations: {
    googleAnalyticsId: String
  }
}

/**
 * مدل تنظیمات که شامل اطلاعات پایه تنظیمات و ویژگی‌های اضافی مدل می‌باشد
 */
export type Settings = Model & SettingsBase

/**
 * مدل اسکیمای تنظیمات برای پایگاه داده که شامل اطلاعات پایه تنظیمات و ویژگی‌های اضافی اسکیمای پایگاه داده می‌باشد
 */
export type SettingsSchema = SchemaModel & SettingsBase

/**
 * ساختار درخواست ارسال داده‌های تنظیمات که شامل اطلاعات پایه تنظیمات می‌باشد
 */
export type SettingsInput = SettingsBase
