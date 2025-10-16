import BlogArticleSliderBlock from './BlogArticleSliderBlock'
import BlogArticleSliderBlockEditor from './BlogArticleSliderBlockEditor'
import { BlogArticleSliderBlockSchema } from './schema'
import { blogArticleSliderBlockDefaults } from './defaultSettings'
import { ContentEditor } from './ContentEditor'

export const BlogArticleSliderBlockDef = {
  type: 'blogArticleSlider',
  label: 'اسلایدر مقاله',
  showInBlocksList: true,
  Renderer: BlogArticleSliderBlock,
  RendererInEditor: BlogArticleSliderBlockEditor,
  settingsSchema: BlogArticleSliderBlockSchema,
  defaultSettings: blogArticleSliderBlockDefaults,
  ContentEditor: ContentEditor,
}
