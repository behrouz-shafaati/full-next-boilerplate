import { BlogPostSliderBlock } from './BlogPostSliderBlock'
import { BlogPostSliderBlockSchema } from './schema'
import { blogPostSliderBlockDefaults } from './defaultSettings'
import { ContentEditor } from './ContentEditor'

export const BlogPostSliderBlockDef = {
  type: 'blogPostSlider',
  label: 'اسلایدر مطلب',
  showInBlocksList: true,
  Renderer: BlogPostSliderBlock,
  settingsSchema: BlogPostSliderBlockSchema,
  defaultSettings: blogPostSliderBlockDefaults,
  ContentEditor: ContentEditor,
}
