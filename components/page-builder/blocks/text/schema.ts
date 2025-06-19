export const textBlockSchema = {
  title: 'تنظیمات متن',
  type: 'object',
  properties: {
    fontSize: { type: 'string', title: 'اندازه فونت', default: '16px' },
    fontWeight: {
      type: 'string',
      title: 'ضخامت فونت',
      enum: ['normal', 'bold', 'lighter', 'bolder'],
      default: 'normal',
    },
    textAlign: {
      type: 'string',
      title: 'چینش',
      enum: ['left', 'center', 'right', 'justify'],
      default: 'center',
    },
    color: { type: 'string', title: 'رنگ', default: '#000000' },
  },
}
