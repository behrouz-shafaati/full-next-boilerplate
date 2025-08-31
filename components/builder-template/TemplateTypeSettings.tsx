import { useBuilderStore } from '../builder-canvas/store/useBuilderStore'
import { useDebouncedCallback } from 'use-debounce'
import Combobox, { Option } from '@/components/form-fields/combobox'
import { Category } from '@/features/category/interface'
import { createCatrgoryBreadcrumb } from '@/lib/utils'

const TemplateTypeSettings = ({
  allCategories,
}: {
  allCategories: Category[]
}) => {
  const { update, getJson } = useBuilderStore()
  const debouncedUpdate = useDebouncedCallback(
    (id, key, form) => update(id, key, form),
    400
  )
  const categoryOptions: Option[] = allCategories.map((category: Category) => {
    return {
      value: `category-${String(category.id)}`,
      label:
        'خانه‌ی دسته‌ی ' + createCatrgoryBreadcrumb(category, category.title),
    }
  })
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
      value: 'blog',
    },
    {
      label: 'مقاله‌ی تکی',
      value: 'post',
    },
    {
      label: 'آرشیو مقالات',
      value: 'archive',
    },
    {
      label: 'خانه‌ی دسته بندی مقالات',
      value: 'categories',
    },
    ...categoryOptions,
  ]

  if (JSON.parse(getJson())?.templateFor)
    return (
      <Combobox
        title="برای بخش"
        name="templateFor"
        defaultValue={JSON.parse(getJson())?.templateFor[0] || 'allPages'}
        options={patternTypeOptions}
        placeholder="برای"
        // onChange={(e) => debouncedUpdate(null, 'templateFor', e.target.value)}
        disabled={true}
      />
    )

  return <></>
}

export default TemplateTypeSettings
