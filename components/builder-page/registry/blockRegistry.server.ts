// رجیستری مرکزی بلاک‌ها
// import { registerBlock } from '@/lib/block/singletonBlockRegistry'

import { serverRendertemplatePartDef } from '../blocks/template-part/index.server'

export const serverRenderBuilderPageRegistry = {
  templatePart: serverRendertemplatePartDef,
}

// registerBlock(blockRegistry)
