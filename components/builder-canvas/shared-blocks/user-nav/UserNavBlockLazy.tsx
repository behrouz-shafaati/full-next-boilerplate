'use client'
import dynamic from 'next/dynamic'

const UserNavClientWrapper = dynamic(
  () =>
    import('./UserNavBlock').then((mod) => {
      return mod.UserNavBlock
    }),
  {
    ssr: false,
    loading: () => null,
  }
)

export default UserNavClientWrapper
