'use client'
import dynamic from 'next/dynamic'

// کاملاً خارج از باندل اولیه
const MobileMenu = dynamic(() => import('./MobileMenu'), {
  ssr: false, // هیچ SSR اتفاق نمی‌افتد
  loading: () => <div className="md:hidden">در حال بارگذاری...</div>,
})

export default function MobileMenuLazy(props) {
  return <MobileMenu {...props} />
}
