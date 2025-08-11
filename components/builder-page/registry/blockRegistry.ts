// رجیستری مرکزی بلاک‌ها
import { registerBlock } from '@/components/builder-canvas/singletonBlockRegistry'
import { ImageSliderBlockDef } from '../blocks/imageSlider'
import { BlogPostSliderBlockDef } from '../blocks/blogPostSlider'
import { HeaderBlockDef } from '../blocks/header'

export const blockRegistry = {
  imageSlider: ImageSliderBlockDef,
  blogPostSlider: BlogPostSliderBlockDef,
  header: HeaderBlockDef,
  // ...
}

registerBlock(blockRegistry)
