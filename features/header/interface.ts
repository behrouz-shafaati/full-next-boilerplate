import { Id, Model, SchemaModel } from '@/lib/entity/core/interface'
import {
  Content as HeaderContentComponent,
  Row as HeaderRowComponent,
  Column as HeaderColumnComponent,
  Block as HeaderBlockComponent,
} from '@/components/builder-header/types'

export type HeaderContent = HeaderContentComponent

export type HeaderRow = HeaderRowComponent

export type HeaderColumn = HeaderColumnComponent

export type HeaderBlock = HeaderBlockComponent
/**
 * اطلاعات پایه سربرگ که شامل فیلدهای اصلی سربرگ می‌باشد
 */
type HeaderBase = {
  /**
   * عنوان سربرگ
   */
  title: string

  user: Id

  /**
   * محتوای سربرگ
   */
  content: HeaderContent

  status: 'draft' | 'published'
}

/**
 * مدل سربرگ که شامل اطلاعات پایه سربرگ و ویژگی‌های اضافی مدل می‌باشد
 */
export type Header = Model & HeaderBase

/**
 * مدل اسکیمای سربرگ برای پایگاه داده که شامل اطلاعات پایه سربرگ و ویژگی‌های اضافی اسکیمای پایگاه داده می‌باشد
 */
export type HeaderSchema = SchemaModel & HeaderBase

/**
 * ساختار درخواست ارسال داده‌های سربرگ که شامل اطلاعات پایه سربرگ می‌باشد
 */
export type HeaderInput = HeaderBase
