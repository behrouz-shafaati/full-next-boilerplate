import AdSlotBlock from './AdSlotBlock'
import AdSlotBlockEditor from './AdSlotBlockEditor'
import { ArticleListBlockSchema } from './schema'
import { blogArticleSliderBlockDefaults } from './defaultSettings'
import { ContentEditor } from './ContentEditor'

export const AdSlotBlockDef = {
  type: 'adSlot',
  label: 'جایگاه تبلیغات',
  showInBlocksList: true,
  Renderer: AdSlotBlock,
  RendererInEditor: AdSlotBlockEditor,
  settingsSchema: ArticleListBlockSchema,
  defaultSettings: blogArticleSliderBlockDefaults,
  ContentEditor: ContentEditor,
}
