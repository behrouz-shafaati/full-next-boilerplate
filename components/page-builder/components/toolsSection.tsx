import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { HeadingIcon } from 'lucide-react'
import Text from '@/components/form-fields/text'
import { PageContent } from '../types'
import { BlockPalette } from './BlockPalette'
import { useBuilderStore } from '../store/useBuilderStore'
import ToolsSectionPage from './toolsSectionPage'
import ToolsSectionBlock from './toolsSectionBlock'

type ToolsSectionProp = {
  page: PageContent | null
}

export default function ToolsSection({ page }: ToolsSectionProp) {
  const selectedBlock = useBuilderStore((s) => s.selectedBlock)
  if (selectedBlock == null) return <ToolsSectionPage page={page} />
  return <ToolsSectionBlock />
}
