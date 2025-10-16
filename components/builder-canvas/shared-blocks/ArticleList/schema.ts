export const ArticleListBlockSchema = {
  title: '',
  type: 'object',
  properties: {
    countOfArticles: {
      type: 'number',
      title: 'تعداد مقالات',
      default: 8,
      minimum: 1,
    },
    listDesign: {
      type: 'string',
      title: 'طرح لیست',
      enum: ['column', 'row'],
      default: 'default',
    },
    cardDesign: {
      type: 'string',
      title: 'طرح کارت',
      enum: ['image-card', 'overly-card', 'horizontal-card'],
      default: 'default',
    },
    showExcerpt: {
      type: 'boolean',
      title: 'نمایش گزیده',
      default: true,
    },
    showNewest: {
      type: 'boolean',
      title: 'نمایش تازه‌ها',
      default: true,
    },
    advertisingAfter: {
      type: 'number',
      title: 'تبلیغ پس از چند مقاله',
      default: 0,
      minimum: 0,
    },
  },
  required: ['slidesToShow'],
}
