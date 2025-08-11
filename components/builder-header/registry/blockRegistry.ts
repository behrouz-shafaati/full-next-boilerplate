// رجیستری مرکزی بلاک‌ها
import { MenuBlockDef } from '../blocks/menu'
import { registerBlock } from '@/components/builder-canvas/singletonBlockRegistry'

export const blockRegistry = {
  menu: MenuBlockDef,
  // ...
}

registerBlock(blockRegistry)
