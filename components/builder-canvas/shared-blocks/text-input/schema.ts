export const SettingsSchema = {
  title: '',
  type: 'object',
  properties: {
    title: {
      title: 'عنوان',
      type: 'string',
    },
    defaultValue: {
      title: 'مقدار پیش فرض',
      type: 'string',
    },
    description: {
      title: 'توضیح',
      type: 'string',
    },

    placeholder: {
      title: 'جایگذار',
      type: 'string',
    },
    icon: {
      type: 'string',
      title: 'آیکون',
      default: undefined,
    },
    readOnly: {
      title: 'مقدار ثابت',
      type: 'boolean',
      default: false,
    },
    required: {
      title: 'ضروری',
      type: 'boolean',
      default: false,
    },
  },
}
