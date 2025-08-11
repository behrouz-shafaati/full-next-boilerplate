export const BlogPostSliderBlockSchema = {
  title: '',
  type: 'object',
  properties: {
    showMoreLink: {
      type: 'boolean',
      title: 'نمایش دکمه بیشتر',
      default: true,
    },
    moreLink: {
      type: 'string',
      title: 'لینک دکمه بیشتر',
      default: '',
    },
    autoplay: {
      type: 'boolean',
      title: 'پخش خودکار (Autoplay)',
      default: true,
    },
    autoplayDelay: {
      type: 'number',
      title: 'فاصله زمانی بین اسلایدها (ثانیه)',
      default: 3,
      minimum: 1,
    },
    loop: {
      type: 'boolean',
      title: 'چرخش بی‌نهایت (Loop)',
      default: true,
    },
    showArrows: {
      type: 'boolean',
      title: 'نمایش دکمه‌های ناوبری',
      default: true,
    },
    showDots: {
      type: 'boolean',
      title: 'نمایش نقطه‌های ناوبری',
      default: true,
    },
    rtl: {
      type: 'boolean',
      title: 'راست‌چین (RTL)',
      default: true,
    },
    className: {
      type: 'string',
      title: 'کلاس سفارشی CSS',
      default: '',
    },
  },
  required: ['slidesToShow'],
}
