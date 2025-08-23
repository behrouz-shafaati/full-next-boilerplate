// پنل تنظیمات عمومی مثل padding, margin
import validator from '@rjsf/validator-ajv8'
import { useBuilderStore } from '../store/useBuilderStore'
import { useDebouncedCallback } from 'use-debounce'
import { TailwindForm } from '../../rjsf/shadcn-theme'
import { uiSchema } from '../../rjsf/uiSchema'
import { title } from 'process'

export const publicClassNamesSchema = {
  type: 'object',
  title: 'کلاس‌‌ها',
  properties: {
    manualInputs: {
      type: 'string',
      title: 'tailwind classes',
      default: '',
    },
    backgroundColor: {
      type: 'string',
      title: 'Background color',
      default: '',
    },
  },
}

export const publicStylesSchema = {
  type: 'object',
  title: 'استایل‌ها',
  properties: {
    width: {
      type: 'number',
      title: 'عرض',
      default: '',
    },
    height: {
      type: 'number',
      title: 'ارتفاع',
      default: '',
    },
    // display: {
    //   type: 'string',
    //   title: 'display',
    //   enum: ['inline-block', 'grid', 'block'],
    //   default: 'inline-block',
    // },
    padding: {
      type: 'object',
      title: 'Padding',
      properties: {
        top: { type: 'number', title: 'بالا', default: 0 },
        right: { type: 'number', title: 'راست', default: 0 },
        bottom: { type: 'number', title: 'پایین', default: 0 },
        left: { type: 'number', title: 'چپ', default: 0 },
      },
    },
    margin: {
      type: 'object',
      title: 'Margin',
      properties: {
        top: { type: 'number', title: 'بالا', default: 0 },
        right: { type: 'number', title: 'راست', default: 0 },
        bottom: { type: 'number', title: 'پایین', default: 0 },
        left: { type: 'number', title: 'چپ', default: 0 },
      },
    },
    boxShadow: {
      type: 'object',
      title: 'سایه (Box Shadow)',
      properties: {
        color: {
          type: 'string',
          title: 'رنگ',
          default: '#000000',
        },
        x: {
          type: 'number',
          title: 'افقی (X)',
          default: 0,
        },
        y: {
          type: 'number',
          title: 'عمودی (Y)',
          default: 0,
        },
        blur: {
          type: 'number',
          title: 'محو شدگی (Blur)',
          default: 0,
        },
        spread: {
          type: 'number',
          title: 'گستردگی (Spread)',
          default: 0,
        },
        inset: {
          type: 'boolean',
          title: 'درونی باشد؟',
          default: false,
        },
      },
      required: ['color', 'x', 'y', 'blur', 'spread', 'inset'],
    },
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
    opacity: {
      type: 'number',
      title: 'Opacity',
      default: 100,
      minimum: 0,
      maximum: 100,
      multipleOf: 1,
    },
    visibility: {
      type: 'object',
      title: 'نمایش در دستگاه‌ها',
      properties: {
        desktop: { type: 'boolean', title: 'نمایش در دسکتاپ', default: true },
        tablet: { type: 'boolean', title: 'نمایش در تبلت', default: true },
        mobile: { type: 'boolean', title: 'نمایش در موبایل', default: true },
      },
    },
  },
}

export const PublicStylesForm = () => {
  const { selectedBlock, update } = useBuilderStore()

  const debouncedUpdate = useDebouncedCallback(
    (id, key, form) => update(id, key, form),
    400
  )

  if (!selectedBlock) return null

  return (
    <>
      <TailwindForm
        key={`shared-classNames-block-${selectedBlock.id}`} //  باعث میشه فرم کاملاً ری‌ست و رندر بشه
        schema={publicClassNamesSchema}
        uiSchema={uiSchema}
        formData={selectedBlock.classNames}
        validator={validator}
        onChange={(e) =>
          debouncedUpdate(selectedBlock.id, 'classNames', e.formData)
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
      <TailwindForm
        key={`shared-styles-block-${selectedBlock.id}`} //  باعث میشه فرم کاملاً ری‌ست و رندر بشه
        schema={publicStylesSchema}
        uiSchema={uiSchema}
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
