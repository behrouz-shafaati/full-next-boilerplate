// /app/archive/[[...filters]]/page.tsx

import ArchivePost from '@/components/archive'
import RendererRows from '@/components/builder-canvas/pageRenderer/RenderRows'
import templateCtrl from '@/features/template/controller'
import { extractFiltersFromParams } from '@/lib/utils'

export default async function ArchivePage({
  params,
}: {
  params: { filters?: string[] }
}) {
  const filters: Record<string, string[]> = extractFiltersFromParams(
    params.filters
  )
  const template = await templateCtrl.getTemplate({ slug: 'archive' })
  if (template) {
    return (
      <>
        <RendererRows
          rows={template.content.rows}
          editroMode={false}
          content_1={
            <ArchivePost
              categorySlugs={filters.categories}
              tagSlugs={filters.tags}
            />
          }
        />
      </>
    )
  }
  return (
    <ArchivePost categorySlugs={filters.categories} tagSlugs={filters.tags} />
  )
}
