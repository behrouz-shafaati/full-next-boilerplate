import { Icons } from '@/components/icons';
import { NavItem, SidebarNavItem } from '@/types';

export const navItems: NavItem[] = [
  {
    title: 'داشبورد',
    href: '/dashboard',
    icon: 'dashboard',
    label: 'داشبورد',
  },
  {
    title: 'کاربران',
    href: '/dashboard/users',
    icon: 'user',
    label: 'کاربران',
  },

  {
    title: 'خروج',
    href: '/',
    icon: 'login',
    label: 'خروج',
  },
];
