import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BlockSettingsForm } from '../settings-panel/BlockSettingsForm'
import { PublicStylesForm } from '../settings-panel/SharedStylesPanel'

export default function ToolsSectionBlock() {
  return (
    <Tabs defaultValue="special-settings" className=" rtl  ">
      <TabsList className="w-full">
        <TabsTrigger value="special-settings">اختصاصی</TabsTrigger>
        <TabsTrigger value="public-settings">عمومی</TabsTrigger>
      </TabsList>
      <TabsContent value="special-settings" className="p-2">
        <BlockSettingsForm />
      </TabsContent>
      <TabsContent value="public-settings">
        <PublicStylesForm />
      </TabsContent>
    </Tabs>
  )
}
