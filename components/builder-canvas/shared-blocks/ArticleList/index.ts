import ArticleListBlock from './ArticleListBlock'
import ArticleListBlockEditor from './ArticleListBlockEditor'
import { ArticleListBlockSchema } from './schema'
import { blogArticleSliderBlockDefaults } from './defaultSettings'
import { ContentEditor } from './ContentEditor'

export const ArticleListBlockDef = {
  type: 'articleList',
  label: 'لیست مقالات',
  showInBlocksList: true,
  Renderer: ArticleListBlock,
  RendererInEditor: ArticleListBlockEditor,
  settingsSchema: ArticleListBlockSchema,
  defaultSettings: blogArticleSliderBlockDefaults,
  ContentEditor: ContentEditor,
}
