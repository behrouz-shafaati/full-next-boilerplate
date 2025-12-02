'use client'
import { Skeleton } from '@/components/ui/skeleton'
import dynamic from 'next/dynamic'

// کاملاً خارج از باندل اولیه
const PostListRow = dynamic(() => import('./PostListRow'), {
  ssr: false, // هیچ SSR اتفاق نمی‌افتد
  loading: () => (
    <div className="py-2">
      <Skeleton className="h-32 w-12 rounded-full" />
    </div>
  ),
})

export default function PostListRowLazy(props) {
  return <PostListRow {...props} />
}
