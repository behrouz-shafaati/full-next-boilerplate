// کامپوننت نمایشی بلاک
'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { Block } from '../../types'
import Menu from './Menu'
import { getMenus } from '@/features/menu/actions'

type MenuBlockProps = {
  blockData: {
    content: { menuId: string }
    type: 'menu'
    settings: {}
  } & Block
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const MenuBlockEditor = ({ blockData, ...props }: MenuBlockProps) => {
  const [menu, setMenu] = useState({})
  const { content } = blockData

  useEffect(() => {
    const fetchData = async () => {
      const [result] = await Promise.all([
        getMenus({
          filters: { id: content.menuId },
        }),
      ])
      const menus = result.data
      setMenu(menus[0])
      console.log('#89782345 menus:', menus)
    }

    fetchData()
  }, [content])
  return <Menu menu={menu} {...props} />
}
