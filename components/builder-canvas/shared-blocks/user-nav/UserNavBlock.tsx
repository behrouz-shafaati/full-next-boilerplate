// کامپوننت نمایشی بلاک
'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { Block } from '../../types'
import { Session } from '@/types'
import { useSession } from '@/components/context/SessionContext'
import { UserNav } from './UserNav'

type props = {
  blockData: {
    content: {}
    type: 'userNav'
    settings: {}
  } & Block
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const UserNavBlock = ({ blockData, ...props }: props) => {
  const [session, setSession] = useState({})
  // const { user } = useSession()
  const { content } = blockData
  useEffect(() => {
    fetch('/api/session')
      .then((res) => res.json())
      .then((data) => setSession(data))
  }, [])
  console.log('#session:', session)
  if (!session) {
    return <button>ورود</button>
  }
  return <UserNav blockData={blockData} user={session?.user} {...props} />
}
