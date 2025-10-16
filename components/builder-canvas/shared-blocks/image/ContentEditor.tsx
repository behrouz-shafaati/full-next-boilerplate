// پنل تنظیمات برای این بلاک
import React from 'react'
import { useBuilderStore } from '../../store/useBuilderStore'
import FileUpload from '@/components/form-fields/file-upload'

type Props = {
  initialData: any
  savePage: () => void
}

export const ContentEditor = ({ initialData, savePage }: Props) => {
  const { selectedBlock, update } = useBuilderStore()
  const defaultValu =
    selectedBlock?.content?.srcMedium !== null ? selectedBlock?.content : null
  return (
    <>
      <FileUpload
        key={`image-block-${selectedBlock.id}`} //  باعث میشه فرم کاملاً ری‌ست و رندر بشه
        name="image"
        title="پوستر مقاله"
        maxFiles={1}
        defaultValues={defaultValu}
        updateFileDetailsHnadler={(files) => {
          console.log('#88237 updaTED DATA: ', files)
          update(selectedBlock?.id as string, 'content', files[0])
        }}
        deleteFileHnadler={(fileId) => {
          update(selectedBlock?.id as string, 'content', {
            title: '',
            alt: '',
            description: '',
            src: null,
            href: null,
          })
          requestAnimationFrame(() => {
            savePage?.()
          })
        }}
        showDeleteButton={true}
      />
      {/* <code>{JSON.stringify(selectedBlock?.content)}</code> */}
    </>
  )
}
