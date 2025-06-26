import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BlockSettingsForm } from '../settings-panel/BlockSettingsForm'
import { PublicStylesForm } from '../settings-panel/SharedStylesPanel'

export default function ToolsSectionBlock() {
  return (
    <Tabs defaultValue="special-settings" className="rtl relative min-h-screen">
      <TabsList className="sticky top-0 w-full z-10">
        <TabsTrigger value="special-settings">اختصاصی</TabsTrigger>
        <TabsTrigger value="public-settings">عمومی</TabsTrigger>
      </TabsList>
      <TabsContent value="special-settings" className="p-4">
        <BlockSettingsForm />
      </TabsContent>
      <TabsContent value="public-settings" className="p-4">
        <PublicStylesForm />
      </TabsContent>
    </Tabs>
  )
}
