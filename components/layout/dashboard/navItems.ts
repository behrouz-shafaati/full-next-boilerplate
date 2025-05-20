import { Icons } from '@/components/icons'
import { NavItem, SidebarNavItem } from '@/types'

export const navItems: SidebarNavItem[] = [
  {
    slug: 'dashboard',
    title: 'داشبورد',
    href: '/dashboard',
    icon: 'dashboard',
    label: '',
    authorized: ['admin'],
  },
  {
    slug: 'post',
    title: 'مطالب',
    href: '/dashboard/posts',
    icon: 'user',
    label: '',
    authorized: ['admin'],
  },
  {
    slug: 'user',
    title: 'کاربران',
    href: '/dashboard/users',
    icon: 'user',
    label: '',
    authorized: ['admin'],
    // sub: [
    //   {
    //     slug: 'employee',
    //     title: 'کارمندان',
    //     href: '/dashboard/users/employees',
    //     icon: 'employee',
    //     label: '',
    //     authorized: ['admin'],
    //   },
    //   {
    //     slug: 'employee',
    //     title: 'کارمندان',
    //     href: '/dashboard/users/employees',
    //     icon: 'employee',
    //     label: '',
    //     authorized: ['admin'],
    //   },
    // ],
  },
  {
    slug: 'category',
    title: 'دسته بندی ها',
    href: '/dashboard/categories',
    icon: 'category',
    label: '',
    authorized: ['admin'],
  },
  {
    slug: 'menu',
    title: 'فهرست ها',
    href: '/dashboard/menus',
    icon: 'squareMenu',
    label: '',
    authorized: ['admin'],
  },

  {
    slug: 'logout',
    title: 'خروج',
    href: '/',
    icon: 'login',
    label: '',
  },
]
