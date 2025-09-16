import { Category } from './interface'

export function buildCategoryHref(category: Category, href: string = '') {
  if (!category) return `/category/${href}`
  return buildCategoryHref(
    category?.parent,
    (href = `${category.slug}/${href}`)
  )
}
