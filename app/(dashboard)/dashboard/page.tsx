import HelloUser from '@/components/HelloUser'
import PageBuilder from '@/components/page-builder'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function page() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <HelloUser />
      </div>
    </ScrollArea>
  )
}
