import TemplateBlock from './TemplateBlock'
import TemplateBlockBlockEditor from './TemplateBlockEditor'
import { TemplateBlockSchema } from './schema'
import { templateBlockDefaults } from './defaultSettings'
import { ContentEditor } from './ContentEditor'

export const TemplateBlockDef = {
  type: 'template',
  label: 'قالب جزئی',
  showInBlocksList: true,
  Renderer: TemplateBlock,
  RendererInEditor: TemplateBlockBlockEditor,
  settingsSchema: TemplateBlockSchema,
  defaultSettings: templateBlockDefaults,
  ContentEditor: ContentEditor,
}
