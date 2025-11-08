export const SettingsSchema = {
  title: '',
  type: 'object',
  properties: {
    title: {
      title: 'عنوان',
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
    rows: {
      type: 'number',
      title: 'تعداد خط',
      default: 4,
    },
    required: {
      title: 'ضروری',
      type: 'boolean',
      default: false,
    },
  },
}
