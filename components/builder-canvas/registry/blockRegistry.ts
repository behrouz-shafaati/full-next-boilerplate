// رجیستری مرکزی بلاک‌ها
import { TextBlockDef } from '../shared-blocks/text'
import { RowBlockDef } from '../shared-blocks/row'
import { ImageBlockDef } from '../shared-blocks/image'
import { columnBlockDef } from '../shared-blocks/column'
import { ThemeModeSwitchBlockDef } from '../shared-blocks/theme-mode-switch'
import { UserNavBlockDef } from '../shared-blocks/user-nav'
import { registerBlock } from '../singletonBlockRegistry'
import { ImageSliderBlockDef } from '../shared-blocks/imageSlider'
import { BlogPostSliderBlockDef } from '../shared-blocks/blogPostSlider'
import { MenuBlockDef } from '../shared-blocks/menu'
export const blockRegistry = {
  row: RowBlockDef,
  column: columnBlockDef,
  text: TextBlockDef,
  image: ImageBlockDef,
  themeModdeSwitch: ThemeModeSwitchBlockDef,
  userNav: UserNavBlockDef,
  imageSlider: ImageSliderBlockDef,
  blogPostSlider: BlogPostSliderBlockDef,
  menu: MenuBlockDef,
}

registerBlock(blockRegistry)
