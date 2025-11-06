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
import { PostListBlockDef } from '../shared-blocks/PostList'
import { ButtonBlockDef } from '../shared-blocks/button'
import { WriteBlockDef } from '../shared-blocks/write'
import { AdSlotBlockDef } from '../shared-blocks/AdSlot'
import { VideoPlaylistBlockDef } from '../shared-blocks/video-playlist'
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
  alticleList: PostListBlockDef,
  button: ButtonBlockDef,
  write: WriteBlockDef,
  adSlot: AdSlotBlockDef,
  videoPlaylist: VideoPlaylistBlockDef,
}

registerBlock(blockRegistry)
