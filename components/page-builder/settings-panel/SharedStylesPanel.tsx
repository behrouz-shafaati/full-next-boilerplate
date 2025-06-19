// پنل تنظیمات عمومی مثل padding, margin
import Form from '@rjsf/core'
import validator from '@rjsf/validator-ajv8'
import { useBuilderStore } from '../store/useBuilderStore'
import { useDebouncedCallback } from 'use-debounce'

export const publicStylesSchema = {
  type: 'object',
  properties: {
    padding: { type: 'string', title: 'Padding', default: '0px' },
    margin: { type: 'string', title: 'Margin', default: '0px' },
    backgroundColor: {
      type: 'string',
      title: 'Background color',
      default: '#ffffff',
    },
    'box-shadow': { type: 'string', title: 'Box shadow', default: '' },
    border: {
      type: 'string',
      title: 'Border',
      enum: [
        'none',
        'solid',
        'dashed',
        'dotted',
        'double',
        'inset',
        'groove',
        'outset',
        'ridge',
      ],
      default: 'none',
    },
    borderRadius: { type: 'string', title: 'Border radius', default: '0px' },
  },
}

export const PublicStylesForm = () => {
  const { selectedBlock, updatePage } = useBuilderStore()
  const debouncedUpdate = useDebouncedCallback(
    (id, key, form) => updatePage(id, key, form),
    400
  )

  if (!selectedBlock) return null

  return (
    <>
      <Form
        schema={publicStylesSchema}
        formData={selectedBlock.styles}
        validator={validator}
        onChange={(e) =>
          debouncedUpdate(selectedBlock.id, 'styles', e.formData)
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
