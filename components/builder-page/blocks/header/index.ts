import HeaderBlock from './HeaderBlock'
import HeaderBlockBlockEditor from './HeaderBlockEditor'
import { HeaderBlockSchema } from './schema'
import { headerBlockDefaults } from './defaultSettings'
import { ContentEditor } from './ContentEditor'

export const HeaderBlockDef = {
  type: 'header',
  label: 'سربرگ',
  showInBlocksList: true,
  Renderer: HeaderBlock,
  RendererInEditor: HeaderBlockBlockEditor,
  settingsSchema: HeaderBlockSchema,
  defaultSettings: headerBlockDefaults,
  ContentEditor: ContentEditor,
}
