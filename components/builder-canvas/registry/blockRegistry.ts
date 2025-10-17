// رجیستری مرکزی بلاک‌ها
import { TextBlockDef } from '../shared-blocks/text'
import { RowBlockDef } from '../shared-blocks/row'
import { ImageBlockDef } from '../shared-blocks/image'
import { columnBlockDef } from '../shared-blocks/column'
import { ThemeModeSwitchBlockDef } from '../shared-blocks/theme-mode-switch'
import { UserNavBlockDef } from '../shared-blocks/user-nav'
import { registerBlock } from '../singletonBlockRegistry'
import { ImageSliderBlockDef } from '../shared-blocks/imageSlider'
import { BlogArticleSliderBlockDef } from '../shared-blocks/blogArticleSlider'
import { MenuBlockDef } from '../shared-blocks/menu'
import { ArticleListBlockDef } from '../shared-blocks/ArticleList'
import { ButtonBlockDef } from '../shared-blocks/button'
import { WriteBlockDef } from '../shared-blocks/write'
export const blockRegistry = {
  row: RowBlockDef,
  column: columnBlockDef,
  text: TextBlockDef,
  image: ImageBlockDef,
  themeModdeSwitch: ThemeModeSwitchBlockDef,
  userNav: UserNavBlockDef,
  imageSlider: ImageSliderBlockDef,
  blogArticleSlider: BlogArticleSliderBlockDef,
  menu: MenuBlockDef,
  alticleList: ArticleListBlockDef,
  button: ButtonBlockDef,
  write: WriteBlockDef,
}

registerBlock(blockRegistry)
