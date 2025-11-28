'use client'
import dynamic from 'next/dynamic'

// کاملاً خارج از باندل اولیه
const UserNavBlock = dynamic(() => import('./UserNavBlock'), {
  ssr: false, // هیچ SSR اتفاق نمی‌افتد
  loading: () => <div>در حال بارگذاری...</div>,
})

export default function UserNavBlockLazy(props) {
  return <UserNavBlock {...props} />
}
