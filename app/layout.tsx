import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/layout/theme-toggle/theme-provider';

import localFont from 'next/font/local';
import { Toaster } from '@/components/ui/toaster';
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
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log('@@@*** render');
  return (
    <html lang="fa" dir="rtl">
      <body className={iransans.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main>{children}</main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
