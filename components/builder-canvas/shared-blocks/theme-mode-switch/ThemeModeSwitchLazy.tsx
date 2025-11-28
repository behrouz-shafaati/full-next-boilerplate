'use client'
import dynamic from 'next/dynamic'

// کاملاً خارج از باندل اولیه
const ThemeModeSwitch = dynamic(() => import('./ThemeModeSwitch'), {
  ssr: false, // هیچ SSR اتفاق نمی‌افتد
  loading: () => <div>در حال بارگذاری...</div>,
})

export default function ThemeModeSwitchLazy(props) {
  return <ThemeModeSwitch {...props} />
}
