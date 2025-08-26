// رجیستری مرکزی بلاک‌ها
import { registerBlock } from '@/components/builder-canvas/singletonBlockRegistry'
import { TemplatePartBlockDef } from '../blocks/template-part'

export const blockRegistry = {
  templatePart: TemplatePartBlockDef,
  // ...
}

registerBlock(blockRegistry)
