'use client'
import dynamic from 'next/dynamic'

// کاملاً خارج از باندل اولیه
const Search = dynamic(() => import('./Block'), {
  ssr: false, // هیچ SSR اتفاق نمی‌افتد
  loading: () => <div>load search</div>,
})

export default function SearchLazy(props) {
  return <Search {...props} />
}
