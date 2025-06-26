import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { HeadingIcon } from 'lucide-react'
import Text from '@/components/form-fields/text'
import { PageContent } from '../types'
import { BlockPalette } from './BlockPalette'
import { useBuilderStore } from '../store/useBuilderStore'
import { useDebouncedCallback } from 'use-debounce'

type ToolsSectionProp = {
  page: PageContent | null
}

export default function ToolsSectionPage({ page }: ToolsSectionProp) {
  const { updatePage } = useBuilderStore()
  const debouncedUpdate = useDebouncedCallback(
    (id, key, form) => updatePage(id, key, form),
    400
  )
  return (
    <Tabs defaultValue="page-settings" className=" rtl relative min-h-screen">
      <TabsList className="sticky top-0 w-full z-10">
        <TabsTrigger value="page-settings">تنظیمات برگه</TabsTrigger>
        <TabsTrigger value="blocks">بلوک ها</TabsTrigger>
      </TabsList>
      <TabsContent value="page-settings" className="p-2">
        <Text
          title=""
          name="title"
          defaultValue={page?.title || ''}
          placeholder="عنوان"
          icon={<HeadingIcon className="h-4 w-4" />}
          className=""
          onChange={(e) => debouncedUpdate(null, 'title', e.target.value)}
        />
      </TabsContent>
      <TabsContent value="blocks">
        <BlockPalette />
      </TabsContent>
    </Tabs>
  )
}
