import { Icons } from '@/components/icons';

export type Roles = 'admin' | 'user';
export type Session = {
  user: {
    id: string;
    name: string;
    email: string;
    roles: string[];
    image: string;
  };
  expires: string;
};

export interface NavItem {
  slug: string;
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  authorized?: Roles[];
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;
