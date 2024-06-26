import { Role } from './interface';

class controller {
  getRoles(): Role[] {
    return [
      {
        title: 'مدیر کل',
        slug: 'admin',
        description:
          'این نقش اساساً برای صاحبان سایت است و به آنها امکان کنترل کامل سایت را می دهد.',
        acceptTicket: true,
        titleInTicket: 'مدیریت',
      },
      {
        title: 'ویرایشگر',
        slug: 'editor',
        description:
          'کاربران با نقش ویرایشگر کنترل کاملی بر بخش محتوای وب سایت شما دارند. آنها می توانند هر نوشته ای را از جمله مواردی که توسط دیگران نوشته شده اضافه، ویرایش، انتشار و حذف کنند. همچنین یک ویرایشگر می تواند نظرات را نیز تایید، ویرایش یا حذف کند. ویرایشگران دسترسی به تغییر تنظیمات سایت و اضافه کردن کاربر جدید را ندارند.',
        acceptTicket: false,
        titleInTicket: 'ویرایشگر',
      },
      {
        title: 'نویسنده',
        slug: 'auther',
        description:
          'می تواند پست های خود را بنویسد و آنها را ویرایش و منتشر کند. آنها همچنین می توانند پست های خود را حذف کنند. نقش نویسنده نمی توانند دسته بندی نوشته ها را ایجاد کنند و فقط می توانند از دسته بندی های موجود انتخاب کنند اما می توانند برچسب ها را به پست خود اضافه کنند. نویسندگان می توانند نظرات حتی کسانی که در انتظار بررسی و تأیید هستند را مشاهده کنند ولی نمی توانند نظری را تأیید یا حذف کنند.',
        acceptTicket: false,
        titleInTicket: 'نویسنده',
      },
      {
        title: 'مشارکت کننده',
        slug: 'contributor',
        description:
          'می توانند پست های جدید را اضافه کنند و فقط پست های خود را ویرایش کنند اما نمی توانند پستی را منتشر کنند حتی پست های خودشان را. هنگام نوشتن پست ها، نمی توانند دسته های جدیدی ایجاد کنند و باید از دسته های موجود انتخاب کنند با این حال آنها می توانند برچسب ها را نیز به پست های خود اضافه کنند.',
        acceptTicket: false,
        titleInTicket: 'مشارکت کننده',
      },
      {
        title: 'مشترک',
        slug: 'subscriber',
        description:
          ' می توانند در سایت وارد شوند و پروفایل کاربری خود را بروزرسانی کنند. آنها می توانند رمزهای عبورشان را تغییر دهند. این نقش پنل کاربری جداگانه ای دارد و نمی تواند وارد پیشخوان مدیریتی سایت شود. این نقش حداق نقش در میان نقش کاربران است.',
        acceptTicket: false,
        titleInTicket: '',
      },
      {
        title: 'مدیر فروشگاه',
        slug: 'shop_manager',
        description:
          'کنترل کاملی بر بخش فروشگاه وب سایت شما دارند. آنها می توانند تمام تراکنش ها و سفارش ها را بررسی، ویرایش و کنترل کنند و هر محصولی را از جمله محصولاتی که توسط دیگران ایجاد شده اضافه، ویرایش، انتشار و حذف کنند. مدیر فروش دسترسی به تغییر تنظیمات سایت و اضافه کردن کاربر جدید را ندارند.',
        acceptTicket: false,
        titleInTicket: '',
      },
      {
        title: 'مدیر فروش',
        slug: 'sales_manager',
        description:
          'کنترل کاملی بر بخش محصولات وب سایت شما دارند. آنها می توانند هر محصولی را از جمله محصولاتی که توسط دیگران ایجاد شده اضافه، ویرایش، انتشار و حذف کنند. مدیر فروش دسترسی به تغییر تنظیمات سایت و اضافه کردن کاربر جدید را ندارند.',
        acceptTicket: false,
        titleInTicket: 'مدیر فروش',
      },
      {
        title: 'فروشنده',
        slug: 'seller',
        description:
          'می تواند محصولات خود را ایجاد و آنها را ویرایش و منتشر کند. آنها همچنین می توانند محصولات خود را حذف کنند. نقش فروشنده نمی تواند دسته بندی محصولات را ایجاد کنند و فقط می توانند از دسته بندی های موجود انتخاب کنند، اما می توانند برچسب ها را به محصول خود اضافه کنند. فروشنده گان می توانند نظرات حتی کسانی که در انتظار بررسی و تأیید هستند را مشاهده کنند ولی نمی توانند نظری را تأیید یا حذف کنند.    ',
        acceptTicket: false,
        titleInTicket: 'فروشنده',
      },
      {
        title: 'کمک فروشنده',
        slug: 'seller_assistance',
        description:
          'کمک فروشنده ها می توانند محصولات جدید را اضافه کنند و فقط محصولات خود را ویرایش کنند. اما نمی توانند محصولی را منتشر کنند، حتی محصولات خودشان را. هنگام افزودن محصولات، نمی توانند دسته های جدیدی ایجاد کنند و باید از دسته های موجود انتخاب کنند با این حال آنها می توانند برچسب ها را نیز به محصولات خود اضافه کنند.',
        acceptTicket: false,
        titleInTicket: 'کمک فروشنده',
      },
    ];
  }
}

const roleCtrl = new controller();

export default roleCtrl;
