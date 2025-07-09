import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { HeadingIcon, MailIcon } from 'lucide-react'
import Text from '@/components/form-fields/text'
import { PageContent } from '../types'
import { BlockPalette } from './BlockPalette'
import { useBuilderStore } from '../store/useBuilderStore'
import { useDebouncedCallback } from 'use-debounce'
import Combobox, { Option } from '@/components/form-fields/combobox'
import { Category } from '@/features/category/interface'
import { createCatrgoryBreadcrumb } from '@/lib/utils'
import Select from '@/components/form-fields/select'
import { v4 as uuidv4 } from 'uuid'
import { useEffect, useState } from 'react'

type ToolsSectionProp = {
  page: PageContent | null
  allTemplates: PageContent[]
  allCategories: Category[]
}

export default function ToolsSectionPage({
  page,
  allTemplates,
  allCategories,
}: ToolsSectionProp) {
  const [tabKey, SetTabKey] = useState<String>('')
  const { updatePage, getJson } = useBuilderStore()
  const debouncedUpdate = useDebouncedCallback(
    (id, key, form) => updatePage(id, key, form),
    400
  )
  const categoryOptions: Option[] = allCategories.map((category: Category) => {
    return {
      value: String(category.id),
      label: createCatrgoryBreadcrumb(category, category.title),
    }
  })

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
      label: 'صفحه',
      value: 'page',
    },
    {
      label: 'قالب',
      value: 'template',
    },
  ]

  const PageTypeSettings = () => {
    let templatesOptions: Option[] = allTemplates.map((t: PageContent) => {
      return {
        value: String(t.id),
        label: String(t.title),
      }
    })
    templatesOptions = [
      {
        value: '__none__',
        label: 'بدون قالب',
      },
      ...templatesOptions,
    ]
    return (
      <>
        <Text
          title="نامک"
          name="slug"
          defaultValue={JSON.parse(getJson()).slug || ''}
          placeholder="نامک"
          icon={<HeadingIcon className="h-4 w-4" />}
          className=""
          onChange={(e) => debouncedUpdate(null, 'slug', e.target.value)}
        />
        <Combobox
          title="قالب"
          name="template"
          defaultValue={JSON.parse(getJson()).template || '__none__'}
          options={templatesOptions}
          placeholder="قالب"
          onChange={(e) => debouncedUpdate(null, 'template', e.target.value)}
        />
      </>
    )
  }
  const TemplateTypeSettings = () => {
    const categoryOptions: Option[] = allCategories.map(
      (category: Category) => {
        return {
          value: String(category.id),
          label:
            'خانه‌ی دسته‌ی ' +
            createCatrgoryBreadcrumb(category, category.title),
        }
      }
    )
    const patternTypeOptions = [
      {
        label: 'تمام صفحات',
        value: 'allPages',
      },
      // {
      //   label: 'صفحه نخست',
      //   value: 'firstPage',
      // },
      {
        label: 'خانه‌ی مقالات',
        value: 'blogs',
      },
      {
        label: 'مقاله‌ی تکی',
        value: 'blog',
      },
      {
        label: 'خانه‌ی دسته بندی مقالات',
        value: 'categories',
      },
      ...categoryOptions,
    ]
    return (
      <Combobox
        title="برای"
        name="templateFor"
        defaultValue={JSON.parse(getJson()).templateFor || 'allPages'}
        options={patternTypeOptions}
        placeholder="برای"
        onChange={(e) => debouncedUpdate(null, 'templateFor', e.target.value)}
      />
    )
  }

  useEffect(() => SetTabKey(uuidv4()), [])

  return (
    <Tabs
      key={tabKey as string}
      defaultValue="page-settings"
      className=" rtl relative min-h-screen"
    >
      <TabsList className="sticky top-0 w-full z-10">
        <TabsTrigger value="page-settings">تنظیمات برگه</TabsTrigger>
        <TabsTrigger value="blocks">بلوک ها</TabsTrigger>
      </TabsList>
      <TabsContent value="page-settings" className="p-2">
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
        {JSON.parse(getJson()).type === 'page' ? (
          <PageTypeSettings />
        ) : (
          <TemplateTypeSettings />
        )}
        {/* Parent */}
        {/* <Combobox
          title="دسته"
          name="category"
          defaultValue={JSON.parse(getJson()).category || ''}
          options={categoryOptions}
          placeholder="دسته"
          onChange={(e) => debouncedUpdate(null, 'category', e.target.value)}
        /> */}
        <Select
          title="وضعیت"
          name="status"
          defaultValue={JSON.parse(getJson()).status || ''}
          options={statusOptions}
          placeholder="وضعیت"
          icon={<MailIcon className="w-4 h-4" />}
          onChange={(value) => debouncedUpdate(null, 'status', value)}
        />
      </TabsContent>
      <TabsContent value="blocks">
        <BlockPalette />
      </TabsContent>
    </Tabs>
  )
}
