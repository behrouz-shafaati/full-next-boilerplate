// رجیستری مرکزی بلاک‌ها
import { registerBlock } from '@/components/builder-canvas/singletonBlockRegistry'

export const blockRegistry = {
  // ...
}

registerBlock(blockRegistry)

// این فایل باید در مسیر app/initial-load.ts‌هم اضافه شود
