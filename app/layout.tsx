import './initial-load'
import type { Metadata } from 'next'
import './globals.css'
import localFont from 'next/font/local'
import { Providers } from './providers'
import { getSettings } from '@/features/settings/controller'
import { Settings } from '@/features/settings/interface'
import { getTranslation } from '@/lib/utils'

const iransans = localFont({
  src: [
    {
      path: '../public/fonts/IRANSansX-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/IRANSansX-Medium.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/IRANSansX-DemiBold.woff2',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-iransans',
})

export async function generateMetadata(): Promise<Metadata> {
  // اطلاعات رو از دیتابیس می‌گیریم
  const settings = (await getSettings()) as Settings
  const info = getTranslation({
    translations: settings?.infoTranslations || [],
  })
  return {
    title: `${info?.site_title} | ${info?.site_introduction}` || 'ALBA CMS',
    description: info?.site_introduction || 'Default Description',
    icons: {
      icon: [
        {
          media: '(prefers-color-scheme: light)',
          url: settings?.favicon?.srcSmall || '/alba-black.svg',
          href: settings?.favicon?.srcSmall || '/alba-black.svg',
          sizes: '16x16',
          type: 'image/x-icon',
          rel: 'icon',
        },
        {
          media: '(prefers-color-scheme: dark)',
          url: settings?.favicon?.srcSmall || '/alba-white.svg',
          href: settings?.favicon?.srcSmall || '/alba-white.svg',
          sizes: '16x16',
          type: 'image/x-icon',
          rel: 'icon',
        },
      ],
    },
  }
}

;<link rel="icon" href="/alba-white.svg" sizes="any" />

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className={iransans.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
