import Authorization from '@/components/HOC/authorization'
import Header from '@/components/layout/dashboard/header'
import Sidebar from '@/components/layout/dashboard/sidebar'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Next Shadcn Dashboard Starter',
  description: 'Basic dashboard with Next.js and Shadcn',
}

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <ScrollArea className="h-full">
        <main className="w-full pt-16">{children}</main>
      </ScrollArea>
    </>
  )
}
