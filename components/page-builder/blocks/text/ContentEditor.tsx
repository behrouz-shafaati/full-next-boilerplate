// پنل تنظیمات برای این بلاک
import React from 'react'
import { useBuilderStore } from '../../store/useBuilderStore'

type Props = {
  initialData: any
}

export const ContentEditor = ({ initialData }: Props) => {
  const { selectedBlock, updatePage } = useBuilderStore()
  return (
    <textarea
      defaultValue={selectedBlock?.content.text}
      name="content"
      className="w-full ltr"
      read-only="true"
      onChange={(e) =>
        updatePage(selectedBlock?.id as string, 'content', {
          text: e.target.value,
        })
      }
    />
  )
}
