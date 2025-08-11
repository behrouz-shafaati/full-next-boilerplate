// این فقط برای رندر در سمت سرور و برای رندر و نمایش به کابر کاربرد دارد.
//  بکارگیری آن در سمت کلایتت و صفحه سازها منجر به خطا می شود.
//  برای صفحه سازها مستقیم به صورت پراپ به کامپوننت ها پاس داده شود
// block-registry.ts
import { ComponentType } from 'react'

export type BlockDef<TSettings = any> = {
  type: string // کلید یکتا برای بلاک (مثلا 'text')
  label: string // برچسب برای نمایش در UI
  showInBlocksList: boolean // آیا در لیست بلاک‌ها نشون داده بشه؟
  Renderer: ComponentType<any> // کامپوننت برای رندر بلاک در صفحه
  settingsSchema: object // اسکیمای ولیدیشن برای تنظیمات بلاک
  defaultSettings: TSettings // مقادیر پیش‌فرض تنظیمات
  ContentEditor: ComponentType<any> // ادیتور محتوای بلاک
}
const blockRegistry: Record<string, BlockDef> = {}

export function registerBlock(blocks: Record<string, BlockDef>) {
  Object.entries(blocks).forEach(([key, block]) => {
    if (blockRegistry[key]) {
      throw new Error(`Block "${key}" is already registered`)
    }
    blockRegistry[key] = block
  })
}

export function getBlockRegistry() {
  return blockRegistry
}
