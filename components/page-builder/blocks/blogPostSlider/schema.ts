export const BlogPostSliderBlockSchema = {
  title: 'تنظیمات اسلایدر تصویر ',
  type: 'object',
  properties: {
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
