'use client'
import { buildUrlFromFilters, getTranslation } from '@/lib/utils'
import { Filter } from '../Filter'
import { use, useEffect, useState } from 'react'
import { Option } from '@/types'
import { useRouter } from 'next/navigation'
import { Settings } from '@/features/settings/interface'

type Props = {
  siteSettings: Settings
  allCategories: any
  allTags: any
  defaultSelectedCategories?: Option[]
  defaultSelectedTags?: Option[]
}

export function DesktopFilters({
  siteSettings,
  allCategories,
  allTags,
  defaultSelectedCategories,
  defaultSelectedTags,
}: Props) {
  console.log(
    '#24 /////////////////siteSettings:',
    siteSettings?.desktopHeaderHeight
  )
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<Option[]>(
    defaultSelectedCategories || []
  )
  const [selectedTag, setSelectedTag] = useState<Option[]>(
    defaultSelectedTags || []
  )

  const categoryOptions = allCategories.data.map((cat: any) => {
    const t = getTranslation({ translations: cat.translations })
    return {
      value: cat.slug,
      label: t?.title,
    }
  })

  const tagOptions = allTags.data.map((tag: any) => {
    const t = getTranslation({ translations: tag.translations })
    return {
      value: tag.slug,
      label: t?.title,
    }
  })

  useEffect(() => {
    let showMoreHref = '/archive'
    showMoreHref =
      selectedTag.length != 0 || selectedCategory.length != 0
        ? showMoreHref +
          '/' +
          buildUrlFromFilters({
            tags: selectedTag.map((tag) => tag.value),
            categories: selectedCategory.map((cat) => cat.value),
          })
        : showMoreHref
    router.replace(showMoreHref, { scroll: false })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [selectedTag, selectedCategory, router])

  return (
    <div
      className="sticky py-2"
      style={{ top: `${siteSettings?.desktopHeaderHeight}px` }}
    >
      <Filter
        options={categoryOptions}
        defaultValue={selectedCategory}
        placeholder="جستجو در دسته"
        className="mt-4"
        onChange={(cats) => setSelectedCategory(cats)}
      />
      <Filter
        options={tagOptions}
        defaultValue={selectedTag}
        placeholder="جستجو در برچسب"
        className="mt-4"
        onChange={(tags) => setSelectedTag(tags)}
      />
    </div>
  )
}
