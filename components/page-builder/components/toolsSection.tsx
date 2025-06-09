import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import DraggableTextBlock from './blocks/DraggableTextBlock'
import { HeadingIcon } from 'lucide-react'
import Text from '@/components/form-fields/text'
import { PageContent } from '../types'

type ToolsSectionProp = {
  page: PageContent | null
}

export default function ToolsSection({ page }: ToolsSectionProp) {
  return (
    <Tabs defaultValue="page-settings" className=" rtl  ">
      <TabsList>
        <TabsTrigger value="page-settings">تنظیمات برگه</TabsTrigger>
        <TabsTrigger value="blocks">بلوک ها</TabsTrigger>
      </TabsList>
      <TabsContent value="page-settings" className="p-2">
        <Text
          title=""
          name="title"
          defaultValue={page?.title || ''}
          placeholder="عنوان"
          icon={<HeadingIcon className="w-4 h-4" />}
          className=""
        />
      </TabsContent>
      <TabsContent value="blocks" className="p-2">
        <DraggableTextBlock />
      </TabsContent>
    </Tabs>
  )
}
