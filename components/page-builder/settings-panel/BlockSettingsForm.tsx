import Form from '@rjsf/core'
import validator from '@rjsf/validator-ajv8'
import { useBuilderStore } from '../store/useBuilderStore'
import { blockRegistry } from '../registry/blockRegistry'
import { useDebouncedCallback } from 'use-debounce'
import { TailwindForm } from '../../rjsf/shadcn-theme'
import { uiSchema } from '../../rjsf/uiSchema'

export const BlockSettingsForm = () => {
  const { selectedBlock, updatePage } = useBuilderStore()

  const debouncedUpdate = useDebouncedCallback(
    (id, key, form) => updatePage(id, key, form),
    400
  )

  if (!selectedBlock) return null

  const schema = blockRegistry[selectedBlock.type]?.settingsSchema
  const ContentEditor = blockRegistry[selectedBlock.type]?.ContentEditor
  if (!schema && !ContentEditor)
    return <div>تنظیماتی برای این بلاک وجود ندارد.</div>

  return (
    <>
      {ContentEditor && (
        <ContentEditor
          key={`content-block-${selectedBlock.id}`} //  باعث میشه فرم کاملاً ری‌ست و رندر بشه
        />
      )}
      <TailwindForm
        key={`settings-${selectedBlock.id}`} //  باعث میشه فرم کاملاً ری‌ست و رندر بشه
        schema={schema}
        uiSchema={uiSchema}
        formData={selectedBlock.settings}
        validator={validator}
        onChange={(e) =>
          debouncedUpdate(selectedBlock.id, 'settings', e.formData)
        }
        showErrorList={false}
        omitExtraData
        noHtml5Validate
        liveValidate
        widgets={{}} // می‌تونی در آینده کاستوم‌سازی کنی
        templates={{
          //  حذف دکمه Submit
          ButtonTemplates: {
            SubmitButton: () => null,
          },
        }}
      />
    </>
  )
}
