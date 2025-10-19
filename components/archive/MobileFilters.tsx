'use client'
import { buildUrlFromFilters, getTranslation } from '@/lib/utils'
import { Filter } from '../Filter'
import { use, useEffect, useState } from 'react'
import { Option } from '@/types'
import { useRouter } from 'next/navigation'
import { DrawerWidget } from '../DrawerWidget'
import { Badge } from '../ui/badge'

type Props = {
  allCategories: any
  allTags: any
  defaultSelectedCategories?: Option[]
  defaultSelectedTags?: Option[]
}

export function MobileFilters({
  allCategories,
  allTags,
  defaultSelectedCategories,
  defaultSelectedTags,
}: Props) {
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
  const categoryTriggerLabel = (
    <div className="flex flex-row gap-2">
      <span>فیلتر دسته</span>
      {selectedCategory.length > 0 && (
        <Badge variant="default">{selectedCategory.length}</Badge>
      )}
    </div>
  )
  const tagTriggerLabel = (
    <div className="flex flex-row gap-2">
      <span>فیلتر برچسب</span>
      {selectedTag.length > 0 && (
        <Badge variant="default">{selectedTag.length}</Badge>
      )}
    </div>
  )
  return (
    <div className="flex flex-row gap-2">
      <DrawerWidget
        triggerLabel={categoryTriggerLabel}
        content={
          <Filter
            options={categoryOptions}
            defaultValue={selectedCategory}
            placeholder="جستجو در دسته"
            className="mt-4"
            onChange={(cats) => setSelectedCategory(cats)}
            approveChangeWithButton={true}
          />
        }
      />

      <DrawerWidget
        triggerLabel={tagTriggerLabel}
        content={
          <Filter
            options={tagOptions}
            defaultValue={selectedTag}
            placeholder="جستجو در برچسب"
            className="mt-4"
            onChange={(tags) => setSelectedTag(tags)}
            approveChangeWithButton={true}
          />
        }
      />
    </div>
  )
}
