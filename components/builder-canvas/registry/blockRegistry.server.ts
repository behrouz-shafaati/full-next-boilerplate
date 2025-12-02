// رجیستری مرکزی بلاک‌ها
// اگر ایمپورت فایل های سرور رو جدا نکنم باز یک باندل عظیم ساخته میشه

import { serverRenderBlogPostSliderDef } from '../shared-blocks/blogPostSlider/index.server'
import { serverRenderImageDef } from '../shared-blocks/image/index.server'
import { serverRenderImageSliderDef } from '../shared-blocks/imageSlider/index.server'
import { serverRenderMenuDef } from '../shared-blocks/menu/index.server'
import { serverRenderPostListDef } from '../shared-blocks/postList/index.server'
import { serverRenderTextDef } from '../shared-blocks/text/index.server'
import { serverRenderThemeModeSwitchDef } from '../shared-blocks/theme-mode-switch/index.server'
import { serverRenderUserNavDef } from '../shared-blocks/user-nav/index.server'
import { serverRenderWriteDef } from '../shared-blocks/write/index.server'
import { serverRenderFormDef } from '../shared-blocks/form/index.server'
import { serverRenderButtonDef } from '../shared-blocks/button/index.server'
import { serverRenderAdSlotDef } from '../shared-blocks/AdSlot/index.server'
import { serverRenderSearchDef } from '../shared-blocks/search/index.server'
import { serverRenderSubmitButtonDef } from '../shared-blocks/submitButton/index.server'
import { serverRenderTextInputDef } from '../shared-blocks/text-input/index.server'
import { serverRenderTextareaInputDef } from '../shared-blocks/textarea-input/index.server'
import { serverRenderVideoPlaylistDef } from '../shared-blocks/video-playlist/index.server'

export const serverRenderBlockRegistry = {
  // write: serverRenderWriteDef, // 1KB
  // text: serverRenderTextDef, // 0KB
  // image: serverRenderImageDef, // 0KB
  // themeModdeSwitch: serverRenderThemeModeSwitchDef, // 148KB
  userNav: serverRenderUserNavDef,
  // imageSlider: serverRenderImageSliderDef, // 61kb
  // blogPostSlider: serverRenderBlogPostSliderDef, // need check size
  // menu: serverRenderMenuDef,
  // postList: serverRenderPostListDef, // 715 kb
  // button: serverRenderButtonDef,
  // adSlot: serverRenderAdSlotDef,
  // videoPlaylist: serverRenderVideoPlaylistDef,
  // textInput: serverRenderTextInputDef, // input [type=text]
  // textareaInput: serverRenderTextareaInputDef,
  // submitButton: serverRenderSubmitButtonDef,
  // form: serverRenderFormDef,
  // search: serverRenderSearchDef,
}
