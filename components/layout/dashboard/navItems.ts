import { Icons } from '@/components/icons';
import { NavItem, SidebarNavItem } from '@/types';

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: 'dashboard',
    label: 'Dashboard',
  },
  {
    title: 'Users',
    href: '/dashboard/users',
    icon: 'user',
    label: 'users',
  },
  {
    title: 'Employee',
    href: '/dashboard/employee',
    icon: 'employee',
    label: 'employee',
  },
  {
    title: 'Profile',
    href: '/dashboard/profile',
    icon: 'profile',
    label: 'profile',
  },
  {
    title: 'Kanban',
    href: '/dashboard/kanban',
    icon: 'kanban',
    label: 'kanban',
  },
  {
    title: 'Login',
    href: '/',
    icon: 'login',
    label: 'login',
  },
];
