import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { HeadingIcon } from 'lucide-react'
import Text from '@/components/form-fields/text'
import { PageContent } from '../types'
import { BlockPalette } from './BlockPalette'

type ToolsSectionProp = {
  page: PageContent | null
}

export default function ToolsSectionPage({ page }: ToolsSectionProp) {
  return (
    <Tabs defaultValue="page-settings" className=" rtl  ">
      <TabsList className="w-full">
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
        />
      </TabsContent>
      <TabsContent value="blocks">
        <BlockPalette />
      </TabsContent>
    </Tabs>
  )
}
