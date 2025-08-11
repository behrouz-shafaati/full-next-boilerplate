import { MenuBlock } from './MenuBlock'
import { MenuBlockSchema } from './schema'
import { menuBlockDefaults } from './defaultSettings'
import { ContentEditor } from './ContentEditor'

export const MenuBlockDef = {
  type: 'menu',
  label: 'فهرست',
  showInBlocksList: true,
  Renderer: MenuBlock,
  settingsSchema: MenuBlockSchema,
  defaultSettings: menuBlockDefaults,
  ContentEditor: ContentEditor,
}
