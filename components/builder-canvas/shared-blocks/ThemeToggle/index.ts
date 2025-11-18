import Block from './block'
import { schema } from './schema'
import { defaultSettings } from './defaultSettings'
import { ContentEditor } from './ContentEditor'

export const ThemeToggleBlockDef = {
  type: 'themeToggle',
  label: 'تغییر حالت تم',
  showInBlocksList: true,
  Renderer: Block,
  settingsSchema: schema,
  defaultSettings: defaultSettings,
  ContentEditor: ContentEditor,
  notTemplateFor: ['form'],
}
