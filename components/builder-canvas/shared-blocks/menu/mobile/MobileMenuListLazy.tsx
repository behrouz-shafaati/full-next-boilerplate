'use client'
import dynamic from 'next/dynamic'

// کاملاً خارج از باندل اولیه
const MobileMenuList = dynamic(() => import('./MobileMenuList'), {
  ssr: false, // هیچ SSR اتفاق نمی‌افتد
  loading: () => <div>در حال بارگذاری...</div>,
})

export default function MobileMenuListLazy(props) {
  return <MobileMenuList {...props} />
}
