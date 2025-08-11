const blockSchema = {
  // title: 'تنظیمات ردیف',
  type: 'object',
  properties: {
    flexDirection: {
      type: 'string',
      title: 'flex-direction',
      enum: ['row', 'row-reverse', 'column', 'column-reverse'],
      default: 'row',
    },
    justifyContent: {
      type: 'string',
      title: 'justify-content',
      enum: [
        'start',
        'end',
        'center',
        'space-between',
        'space-around',
        'space-evenly',
      ],
      default: 'start',
    },

    alignItems: {
      type: 'string',
      title: 'align-items',
      enum: ['stretch', 'center', 'start', 'end'],
      default: 'stretch',
    },
    justifyItems: {
      type: 'string',
      title: 'justify-items',
      enum: ['stretch', 'center', 'start', 'end'],
      default: 'stretch',
    },
  },
}

export default blockSchema
