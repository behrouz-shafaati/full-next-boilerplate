export const PostListBlockSchema = {
  title: '',
  type: 'object',
  properties: {
    countOfPosts: {
      type: 'number',
      title: 'تعداد مطالب',
      default: 8,
      minimum: 1,
    },
    listDesign: {
      type: 'string',
      title: 'طرح لیست',
      // enum: ['column', 'row', 'hero', 'spotlight'],
      oneOf: [
        { const: 'row', title: 'ردیفی' },
        { const: 'column', title: 'ستونی' },
        { const: 'heroVertical', title: 'قهرمان عمودی ' },
        { const: 'heroHorizontal', title: 'قهرمان افقی' },
        { const: 'spotlight', title: 'برجسته' },
      ],
      default: 'row',
    },

    showExcerpt: {
      type: 'boolean',
      title: 'نمایش گزیده',
      default: true,
    },
  },
  required: ['listDesign'],
  allOf: [
    {
      if: {
        properties: { listDesign: { enum: ['column', 'row'] } },
      },
      then: {
        properties: {
          cardDesign: {
            type: 'string',
            title: 'طرح کارت',
            enum: ['image-card', 'overly-card', 'horizontal-card'],
            default: 'image-card',
          },
          showNewest: {
            type: 'boolean',
            title: 'نمایش تازه‌ها',
            default: true,
          },
          advertisingAfter: {
            type: 'number',
            title: 'تبلیغ پس از چند مطلب (aspect: 4/1)',
            default: 0,
            minimum: 0,
            description: `aspect: 4/1`,
          },
        },
      },
      else: {
        properties: {
          // cardDesign: { type: 'null' },
          // showExcerpt: { type: 'null' },
          // showNewest: { type: 'null' },
          // advertisingAfter: { type: 'null' },
        },
      },
    },
  ],
}
