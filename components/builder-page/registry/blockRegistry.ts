// رجیستری مرکزی بلاک‌ها
import { registerBlock } from '@/components/builder-canvas/singletonBlockRegistry'
import { TemplateBlockDef } from '../blocks/template-part'
import { ContentBlockDef } from '../blocks/content'

export const blockRegistry = {
  template: TemplateBlockDef,
  content: ContentBlockDef,
  // ...
}

registerBlock(blockRegistry)
