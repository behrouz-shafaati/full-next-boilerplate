// رجیستری مرکزی بلاک‌ها
import { TextBlockDef } from '@/components/page-builder/blocks/text'
import { RowBlockDef } from '@/components/page-builder/blocks/row'
import { ImageBlockDef } from '../blocks/image'
import { ImageSliderBlockDef } from '../blocks/imageSlider'
import { BlogPostSliderBlockDef } from '../blocks/blogPostSlider'

export const blockRegistry = {
  row: RowBlockDef,
  text: TextBlockDef,
  image: ImageBlockDef,
  imageSlider: ImageSliderBlockDef,
  blogPostSlider: BlogPostSliderBlockDef,
  // ...
}
