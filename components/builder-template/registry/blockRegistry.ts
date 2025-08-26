// رجیستری مرکزی بلاک‌ها
import { registerBlock } from '@/components/builder-canvas/singletonBlockRegistry'
import { ContentBlockDef } from '../blocks/content_all'

export const blockRegistry = {
  content_all: ContentBlockDef, // تمام محتوا
  // ...
}

registerBlock(blockRegistry)
