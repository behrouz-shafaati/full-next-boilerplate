import { useBuilderStore } from '../../store/useBuilderStore'
import { useDebouncedCallback } from 'use-debounce'
import Combobox, { Option } from '@/components/form-fields/combobox'
import { Category } from '@/features/category/interface'
import { createCatrgoryBreadcrumb } from '@/lib/utils'

const TemplateTypeSettings = ({
  allCategories,
}: {
  allCategories: Category[]
}) => {
  const { updatePage, getJson } = useBuilderStore()
  const debouncedUpdate = useDebouncedCallback(
    (id, key, form) => updatePage(id, key, form),
    400
  )
  const categoryOptions: Option[] = allCategories.map((category: Category) => {
    return {
      value: String(category.id),
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

export default TemplateTypeSettings
