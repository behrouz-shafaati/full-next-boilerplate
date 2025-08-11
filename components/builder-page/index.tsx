// ورودی اصلی صفحه‌ساز (ترکیب درگ‌اند‌دراپ و بلاک رندر)
import { PageContent } from './types'
import BuilderCanvas from '../builder-canvas'
import SettingsPanel from './SettingsPanel'
import { Category } from '@/features/category/interface'
import { blockRegistry } from './registry/blockRegistry'
import { blockRegistry as headerBlockregistry } from './../builder-header/registry/blockRegistry'
import { Header } from '@/features/header/interface'

type BuilderPageProp = {
  title?: string
  name: string
  submitFormHandler: (prevState: any, formData: FormData) => Promise<any>
  initialContent?: PageContent
  allTemplates: PageContent[]
  allCategories: Category[]
  allHeaders: Header[]
}

export default function BuilderPage({
  title = 'صفحه ساز',
  initialContent,
  name = 'contentJson',
  submitFormHandler,
  allTemplates,
  allCategories,
  allHeaders,
}: BuilderPageProp) {
  return (
    <BuilderCanvas
      title={title}
      name={name}
      settingsPanel={
        <SettingsPanel
          allCategories={allCategories}
          allTemplates={allTemplates}
          allHeaders={allHeaders}
        />
      }
      submitFormHandler={submitFormHandler}
      initialContent={initialContent}
      newBlocks={{ ...blockRegistry, ...headerBlockregistry }}
    />
  )
}
