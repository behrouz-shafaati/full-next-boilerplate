// پنل تنظیمات برای این بلاک
import React from 'react'
import { useBuilderStore } from '../../store/useBuilderStore'
import Select from '@/components/form-fields/select'
import { useDebouncedCallback } from 'use-debounce'

const columnOptions = [
  {
    label: '3-3-3-3',
    value: '3-3-3-3',
  },
  {
    label: '4-4-4',
    value: '4-4-4',
  },
  {
    label: '6-6',
    value: '6-6',
  },
  {
    label: '12',
    value: '12',
  },
  {
    label: '3-6-3',
    value: '3-6-3',
  },
  {
    label: '2-8-2',
    value: '2-8-2',
  },
]
const ContentEditor = () => {
  const { updateRowColumns, updatePage, selectedBlock } = useBuilderStore()

  const debouncedUpdate = useDebouncedCallback(
    (id, key, form) => updatePage(id, key, form),
    400
  )

  return (
    <Select
      key={`row-block-select-${selectedBlock.id}`} //  باعث میشه فرم کاملاً ری‌ست و رندر بشه
      title="چینش ستون"
      name="rowColumns"
      defaultValue={selectedBlock.settings.rowColumns}
      options={columnOptions}
      placeholder="چینش ستون"
      onChange={(value) => {
        updateRowColumns(selectedBlock.id as string, value)
        debouncedUpdate(selectedBlock.id as string, 'settings', {
          rowColumns: value,
        })
      }}
    />
  )
}

export default ContentEditor
