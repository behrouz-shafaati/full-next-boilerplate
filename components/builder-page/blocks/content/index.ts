import { ContentBlock } from './ContentBlock'
import { contentBlockSchema } from './schema'
import { contentBlockDefaults } from './defaultSettings'
import { ContentEditor } from './ContentEditor'

export const ContentBlockDef = {
  type: 'content',
  label: 'محتوا',
  showInBlocksList: true,
  Renderer: ContentBlock,
  settingsSchema: contentBlockSchema,
  defaultSettings: contentBlockDefaults,
  ContentEditor: ContentEditor,
  inTemplateFor: ['allPages'],
}
