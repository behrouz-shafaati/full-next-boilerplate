import { Id, Model, SchemaModel } from '@/lib/entity/core/interface'

export type PageContent = {
  rows: PageRow[]
}

export type PageRow = {
  id: string // UUID
  columns: PageColumn[]
}

export type PageColumn = {
  id: string // UUID
  width: number // مثلاً 6 یعنی 6 از 12 (مثل Bootstrap)
  blocks: PageBlock[]
}

export type PageBlock = {
  id: string // UUID
  type: 'text' | 'image' | 'video' | 'gallery' | 'form' | 'product' | 'custom'
  data: Record<string, any>
}
/**
 * اطلاعات پایه برگه که شامل فیلدهای اصلی برگه می‌باشد
 */
type PageBase = {
  /**
   * عنوان برگه
   */
  title: string

  /**
   * محتوای برگه
   */
  content: PageContent

  slug: string

  status: 'draft' | 'published'
}

/**
 * مدل برگه که شامل اطلاعات پایه برگه و ویژگی‌های اضافی مدل می‌باشد
 */
export type Page = Model & PageBase

/**
 * مدل اسکیمای برگه برای پایگاه داده که شامل اطلاعات پایه برگه و ویژگی‌های اضافی اسکیمای پایگاه داده می‌باشد
 */
export type PageSchema = SchemaModel & PageBase

/**
 * ساختار درخواست ارسال داده‌های برگه که شامل اطلاعات پایه برگه می‌باشد
 */
export type PageInput = PageBase
