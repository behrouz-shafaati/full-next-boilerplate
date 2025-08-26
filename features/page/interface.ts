import { Id, Model, SchemaModel } from '@/lib/entity/core/interface'
import {
  PageContent as PageContentComponent,
  PageRow as PageRowComponent,
  PageColumn as PageColumnComponent,
  PageBlock as PageBlockComponent,
} from '@/components/page-builder/types'

export type PageContent = PageContentComponent

export type PageRow = PageRowComponent

export type PageColumn = PageColumnComponent

export type PageBlock = PageBlockComponent
/**
 * اطلاعات پایه برگه که شامل فیلدهای اصلی برگه می‌باشد
 */
type PageBase = {
  /**
   * عنوان برگه
   */
  title: string
  user: Id
  type: 'page' | 'template'
  header: string

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
