'use client'

import { ThemeProvider } from '@/components/layout/theme-toggle/theme-provider'
import { SessionProvider } from '@/components/context/SessionContext'
import { Toaster } from '@/components/ui/toaster'

interface ProvidersProps {
  children: React.ReactNode
  session: any
}

export function Providers({ children, session }: ProvidersProps) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <main>{children}</main>
        <Toaster />
      </ThemeProvider>
    </SessionProvider>
  )
}
