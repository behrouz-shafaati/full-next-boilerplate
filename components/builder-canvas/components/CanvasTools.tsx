import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BlockPalette } from './BlockPalette'
import { v4 as uuidv4 } from 'uuid'
import { useEffect, useState } from 'react'

type ToolsSectionProp = {
  settingsPanel: React.ReactNode
  newBlocks: any
}

export default function CanvasTools({
  settingsPanel: SettingsPanel,
  newBlocks = [],
}: ToolsSectionProp) {
  const [tabKey, SetTabKey] = useState<String>('')
  useEffect(() => SetTabKey(uuidv4()), [])

  return (
    <Tabs
      key={tabKey as string}
      defaultValue="page-settings"
      className=" rtl relative min-h-screen"
    >
      <TabsList className="sticky top-0 w-full z-10">
        <TabsTrigger value="page-settings">تنظیمات</TabsTrigger>
        <TabsTrigger value="blocks">بلوک ها</TabsTrigger>
      </TabsList>
      <TabsContent value="page-settings" className="p-2">
        {SettingsPanel}
      </TabsContent>
      <TabsContent value="blocks">
        <BlockPalette newBlocks={newBlocks} />
      </TabsContent>
    </Tabs>
  )
}
