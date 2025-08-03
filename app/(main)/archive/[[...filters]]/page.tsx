// /app/archive/[[...filters]]/page.tsx

import ArchivePost from '@/components/archive'
import postCtrl from '@/features/post/controller'
import { extractFiltersFromParams } from '@/lib/utils'

export default async function ArchivePage({
  params,
}: {
  params: { filters?: string[] }
}) {
  const filters: Record<string, string[]> = extractFiltersFromParams(
    params.filters
  )
  return (
    <ArchivePost categorySlugs={filters.categories} tagSlugs={filters.tags} />
  )
}
