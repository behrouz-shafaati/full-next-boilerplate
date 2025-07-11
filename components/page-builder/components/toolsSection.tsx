import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { HeadingIcon } from 'lucide-react'
import Text from '@/components/form-fields/text'
import { PageContent } from '../types'
import { BlockPalette } from './BlockPalette'
import { useBuilderStore } from '../store/useBuilderStore'
import ToolsSectionPage from './pageSettings/toolsSectionPage'
import ToolsSectionBlock from './toolsSectionBlock'
import { Category } from '@/features/category/interface'

type ToolsSectionProp = {
  page: PageContent | null
  allTemplates: PageContent[]
  allCategories: Category[]
}

export default function ToolsSection({
  page,
  allTemplates,
  allCategories,
}: ToolsSectionProp) {
  const selectedBlock = useBuilderStore((s) => s.selectedBlock)
  if (selectedBlock == null)
    return (
      <ToolsSectionPage
        page={page}
        allTemplates={allTemplates}
        allCategories={allCategories}
      />
    )
  return <ToolsSectionBlock />
}
