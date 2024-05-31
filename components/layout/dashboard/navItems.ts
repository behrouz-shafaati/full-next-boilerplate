import { Icons } from '@/components/icons';
import { NavItem, SidebarNavItem } from '@/types';

export const navItems: NavItem[] = [
  {
    slug: 'dashboard',
    title: 'داشبورد',
    href: '/dashboard',
    icon: 'dashboard',
    label: 'داشبورد',
    authorized: ['admin'],
  },
  {
    slug: 'user',
    title: 'کاربران',
    href: '/dashboard/users',
    icon: 'user',
    label: 'کاربران',
    authorized: ['admin'],
  },

  {
    slug: 'logout',
    title: 'خروج',
    href: '/',
    icon: 'login',
    label: 'خروج',
  },
];
