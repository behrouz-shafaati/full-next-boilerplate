// پنل تنظیمات برای این بلاک
'use client'
import React, { useEffect, useState } from 'react'
import { useBuilderStore } from '@/components/builder-canvas/store/useBuilderStore'
import { getAllMenus } from '@/features/menu/actions'
import { Option } from '@/types'
import { Menu } from '@/features/menu/interface'
import Combobox from '@/components/form-fields/combobox'

type Props = {
  initialData: any
  savePage: () => void
}

export const ContentEditor = ({ initialData, savePage }: Props) => {
  const { selectedBlock, update } = useBuilderStore()
  const [menuOptions, setMenuOptions] = useState<Option[]>([])
  useEffect(() => {
    const fetchData = async () => {
      const [allMenus] = await Promise.all([getAllMenus()])
      const menuOptions: Option[] = allMenus.data.map((menu: Menu) => ({
        value: String(menu.id),
        label: menu.title,
      }))
      setMenuOptions(menuOptions)
    }

    fetchData()
  }, [])
  console.log(
    '#selectedBlock?.content?.menuIdwsr :',
    selectedBlock?.content?.menuId
  )
  return (
    <>
      <Combobox
        key={`menu-block-${menuOptions.length}`} //  باعث میشه فرم کاملاً ری‌ست و رندر بشه
        title="فهرست"
        name="menuId"
        defaultValue={selectedBlock?.content?.menuId || ''}
        options={menuOptions}
        placeholder="انتخاب فهرست"
        onChange={(e) =>
          update(selectedBlock?.id as string, 'content', {
            ...selectedBlock?.content,
            menuId: e.target.value,
          })
        }
      />
    </>
  )
}
