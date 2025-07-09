import { Icons } from '@/components/icons'
export type LanguageSlugs = 'fa' | 'en'
export type RoleSlugs = 'admin' | 'user'
export type guildSlug = 'laundry' | 'super_market'
export type Option = {
  value: string
  label: string
}
export type Place = {
  id: string
  name: string
}
export type Session = {
  user: {
    id: string
    name: string
    email: string
    roles: string[]
    image: string
  }
  expires: string
}

export interface NavItem {
  slug: string
  title: string
  href: string
  disabled?: boolean
  external?: boolean
  icon?: keyof typeof Icons
  label?: string
  description?: string
  authorized?: RoleSlugs[]
}

export interface SidebarNavItem extends NavItem {
  sub?: NavItem[]
}

export interface FooterItem {
  title: string
  items: {
    title: string
    href: string
    external?: boolean
  }[]
}

export type State = {
  errors?: {
    title?: string[]
  }
  message?: string | null
  success: boolean
}
