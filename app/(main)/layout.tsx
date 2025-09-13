import { ScrollArea } from '@/components/ui/scroll-area'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>

  // این قسمت غیر فعال بمونه چون روی سرور باعث سرریزی عرض و عدم تناسب میشد
  return (
    <>
      <ScrollArea className="h-screen">{children}</ScrollArea>
    </>
  )
}
