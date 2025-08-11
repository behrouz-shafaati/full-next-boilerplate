// رجیستری مرکزی بلاک‌ها
import { TextBlockDef } from '../shared-blocks/text'
import { RowBlockDef } from '../shared-blocks/row'
import { ImageBlockDef } from '../shared-blocks/image'
import { columnBlockDef } from '../shared-blocks/column'
import { registerBlock } from '../singletonBlockRegistry'

export const blockRegistry = {
  row: RowBlockDef,
  column: columnBlockDef,
  text: TextBlockDef,
  image: ImageBlockDef,
}

registerBlock(blockRegistry)
