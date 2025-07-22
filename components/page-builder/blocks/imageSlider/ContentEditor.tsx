// پنل تنظیمات برای این بلاک
import React from 'react'
import { useBuilderStore } from '../../store/useBuilderStore'
import FileUpload from '@/components/form-fields/file-upload'

type Props = {
  initialData: any
  savePage: () => void
}

export const ContentEditor = ({ initialData, savePage }: Props) => {
  const { selectedBlock, updatePage } = useBuilderStore()
  const defaultValu =
    selectedBlock?.content?.src !== null ? selectedBlock?.content : null
  return (
    <>
      <FileUpload
        key={`image-block-${selectedBlock.id}`} //  باعث میشه فرم کاملاً ری‌ست و رندر بشه
        name="images"
        title="انتخاب تصاویر"
        defaultValues={defaultValu}
        // responseHnadler={(file: any) => {
        //   console.log('# 9784 on change file:', file)
        //   updatePage(selectedBlock?.id as string, 'content', [
        //     ...selectedBlock?.content,
        //     file,
        //   ])
        // }}
        updateFileDetailsHnadler={(files) => {
          updatePage(selectedBlock?.id as string, 'content', files)
        }}
        deleteFileHnadler={(fileId) => {
          updatePage(
            selectedBlock?.id as string,
            'content',
            selectedBlock?.content.filter((img) => img.id !== fileId)
          )
          requestAnimationFrame(() => {
            savePage?.()
          })
        }}
        showDeleteButton={true}
      />
    </>
  )
}
