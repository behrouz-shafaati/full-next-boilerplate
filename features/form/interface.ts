import { Id, Model, SchemaModel } from '@/lib/entity/core/interface'
import {
  Content as FormContentComponent,
  Row as FormRowComponent,
  Column as FormColumnComponent,
  Block as FormBlockComponent,
} from '@/components/builder-form/types'

export type FormContent = FormContentComponent

export type FormRow = FormRowComponent

export type FormColumn = FormColumnComponent

export type FormBlock = FormBlockComponent

export type FormTranslationSchema = {
  /**
   * زبان مطلب
   */
  lang: string // "fa", "en", "de", ...
  /**
   * عنوان برگه
   */
  successMessage: string

  /**
   * محتوای برگه
   */
  content: FormContentComponent

  fields: any
}

/**
 * اطلاعات پایه سربرگ که شامل فیلدهای اصلی سربرگ می‌باشد
 */
type FormBase = {
  /**
   * عنوان سربرگ
   */
  title: string

  user: Id

  /**
   * محتوا
   */
  translations: [FormTranslationSchema]

  status: 'deactive' | 'active'
}

/**
 * مدل سربرگ که شامل اطلاعات پایه سربرگ و ویژگی‌های اضافی مدل می‌باشد
 */
export type Form = Model & FormBase

/**
 * مدل اسکیمای سربرگ برای پایگاه داده که شامل اطلاعات پایه سربرگ و ویژگی‌های اضافی اسکیمای پایگاه داده می‌باشد
 */
export type FormSchema = SchemaModel & FormBase

/**
 * ساختار درخواست ارسال داده‌های سربرگ که شامل اطلاعات پایه سربرگ می‌باشد
 */
export type FormInput = FormBase
