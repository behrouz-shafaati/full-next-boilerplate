import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { HeadingIcon, MailIcon } from 'lucide-react'
import Text from '@/components/form-fields/text'
import { useDebouncedCallback } from 'use-debounce'
import Combobox, { Option } from '@/components/form-fields/combobox'
import { Category } from '@/features/category/interface'
import { createCatrgoryBreadcrumb } from '@/lib/utils'
import Select from '@/components/form-fields/select'
import { v4 as uuidv4 } from 'uuid'
import { useEffect, useState } from 'react'
import PageTypeSettings from './PageTypeSettings'
import TemplateTypeSettings from './TemplateTypeSettings'
import { useBuilderStore } from '../builder-canvas/store/useBuilderStore'
import { PageContent } from './types'
import Checkbox from '../form-fields/checkbox'

type SettingsPanelProp = {
  allTemplates: PageContent[]
  allCategories: Category[]
}

function SettingsPanel({ allCategories, allTemplates }: SettingsPanelProp) {
  const { update, getJson } = useBuilderStore()
  const document = JSON.parse(getJson())
  const debouncedUpdate = useDebouncedCallback(
    (id, key, form) => update(id, key, form),
    400
  )

  const statusOptions = [
    {
      label: 'انتشار',
      value: 'published',
    },
    {
      label: 'پیش نویس',
      value: 'draft',
    },
  ]

  const pageTypeOptions = [
    {
      label: 'برگه',
      value: 'page',
    },
    {
      label: 'قالب',
      value: 'template',
    },
  ]
  return (
    <>
      <Text
        title="عنوان"
        name="title"
        defaultValue={JSON.parse(getJson()).title || ''}
        placeholder="عنوان"
        icon={<HeadingIcon className="h-4 w-4" />}
        className=""
        onChange={(e) => debouncedUpdate(null, 'title', e.target.value)}
      />

      <Select
        title="نوع"
        name="type"
        defaultValue={JSON.parse(getJson()).type || 'page'}
        options={pageTypeOptions}
        placeholder="نوع"
        icon={<MailIcon className="w-4 h-4" />}
        onChange={(value) => debouncedUpdate(null, 'type', value)}
      />
      {/* <p>type: {JSON.parse(getJson()).type}</p> */}
      {document.type === 'page' ? (
        <PageTypeSettings allTemplates={allTemplates} />
      ) : (
        <TemplateTypeSettings allCategories={allCategories} />
      )}
      <Select
        title="وضعیت"
        name="status"
        defaultValue={JSON.parse(getJson()).status || ''}
        options={statusOptions}
        placeholder="وضعیت"
        icon={<MailIcon className="w-4 h-4" />}
        onChange={(value) => debouncedUpdate(null, 'status', value)}
      />
    </>
  )
}

export default SettingsPanel
