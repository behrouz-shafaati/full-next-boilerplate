'use client'
import { Skeleton } from '@/components/ui/skeleton'
import dynamic from 'next/dynamic'

// کاملاً خارج از باندل اولیه
const ThemeModeSwitch = dynamic(() => import('./ThemeModeSwitch'), {
  ssr: false, // هیچ SSR اتفاق نمی‌افتد
  loading: () => <Skeleton className="h-6 w-6 my-2 rounded-full" />,
})

export default function ThemeModeSwitchLazy(props) {
  return <ThemeModeSwitch {...props} />
}
