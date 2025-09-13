export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import { Session } from '@/types'
import { getSession } from '@/lib/auth'
import { SessionProvider } from '@/components/context/SessionContext'

export const metadata: Metadata = {
  title: 'داشبورد',
  description: 'داشنبودر',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = (await getSession()) as Session
  // console.log('#23409798 session:', session)
  return <SessionProvider session={session}>{children}</SessionProvider>
}
