'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

/**
 * A reusable component that renders clickable items which update a specific query parameter in the URL.
 *
 * ✅ Features:
 * - Updates the URL query string without reloading the page
 * - Keeps the current scroll position
 * - Can be used for filters, tags, categories, etc.
 *
 * @example
 * ```tsx
 * <QueryParamLinks
 *   paramKey="tag"
 *   items={[
 *     { label: 'React', slug: 'react' },
 *     { label: 'Next.js', slug: 'nextjs' },
 *   ]}
 * />
 * ```
 *
 * @param {Object} props
 * @param {string} props.paramKey - The name of the query parameter to set (e.g. "tag", "filter", "ls")
 * @param {Array<{label: string, slug: string}>} props.items - List of items to render as clickable badges
 * @param {string} [props.className] - Optional extra classes for the container
 */
export function QueryParamLinks({
  paramKey = 'param',
  items,
  className = '',
  onChangeSelectedTab,
}: {
  paramKey?: string
  items: { label: string; slug: string }[]
  className?: string
  onChangeSelectedTab?: (slug: string) => {}
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedTag = searchParams.get(paramKey) || ''

  const handleClick = (slug: string) => {
    onChangeSelectedTab?.(slug)
    const params = new URLSearchParams(searchParams)

    // اگر دوباره روی همان مقدار کلیک شود حذف شود
    if (slug == '') {
      params.delete(paramKey)
    } else {
      params.set(paramKey, slug)
    }

    router.replace(`?${params.toString()}`, { scroll: false })
  }

  let selectedTagExistInItems = items.some((item) => item.slug === selectedTag)

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {items?.map((item, index) => (
        <button
          key={item.slug}
          onClick={() => handleClick(item.slug)}
          className="focus:outline-none"
        >
          <Badge
            variant="outline"
            className={cn(
              'p-2 text-xs text-gray-600 dark:text-gray-100 font-normal cursor-pointer px-4',
              {
                'bg-primary text-white':
                  (selectedTagExistInItems && item.slug === selectedTag) ||
                  (!selectedTagExistInItems && index == 0),
              }
            )}
          >
            {item.label}
          </Badge>
        </button>
      ))}
    </div>
  )
}
