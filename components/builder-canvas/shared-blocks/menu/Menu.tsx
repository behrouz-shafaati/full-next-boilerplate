'use client'
import {
  Menu as MenuType,
  MenuItem,
  MenuTranslationSchema,
} from '@/features/menu/interface'
import Link from 'next/link'
import {
  AlignJustify as MenuIcon,
  ChevronDown,
  ChevronLeft,
} from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { extractColorClasses } from '../../utils/styleUtils'

interface MainMenuProps {
  widgetName: string
  menu: MenuType
}

function Menu({ widgetName, menu, ...props }: MainMenuProps) {
  menu.translations = menu?.translations || []

  const locale = 'fa'
  const translation: MenuTranslationSchema =
    menu?.translations?.find((t: MenuTranslationSchema) => t.lang === locale) ||
    menu?.translations[0] ||
    {}
  const items = translation.items

  return (
    <nav {...props}>
      <div className="container flex items-center justify-between px-4 mx-auto">
        {/* دسکتاپ */}
        <nav className="hidden gap-6 md:flex">
          {items?.map((item) => {
            return (
              <MenuItemDesktop
                key={item.id || item._id}
                item={item}
                {...props}
              />
            )
          })}
        </nav>

        {/* موبایل */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <MenuIcon className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-4 overflow-y-auto">
              <MobileMenuList items={items} />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}

export function MenuItemDesktop({ item, ...props }: { item: MenuItem }) {
  const hasSubMenu = item.subMenu && item.subMenu.length > 0
  const { className } = props
  if (!hasSubMenu) {
    return item.url ? (
      <Link href={item.url} className="block px-2 py-1 hover:text-blue-600">
        {item.label}
      </Link>
    ) : (
      <></>
    )
  }

  return item.url ? (
    <div className={`relative group transition-all`}>
      <Link
        href={item.url}
        className="flex items-center gap-1 px-2 py-1 hover:text-blue-600"
      >
        {item.label}
        <ChevronDown className="w-4 h-4" />
      </Link>

      {/* زیرمنو با hidden و group-hover:block */}
      <div
        className={`absolute right-0 top-full hidden group-hover:block  shadow-md min-w-[180px] z-50 transition-all ${extractColorClasses(
          className
        )}`}
      >
        <div className="flex flex-col">
          {item.subMenu!.map((sub, index) =>
            sub?.url ? (
              <Link
                key={`Desktop${sub.id ?? index}`}
                href={sub.url}
                className="block px-4 py-2 hover:opacity-70 whitespace-nowrap"
              >
                {sub.label}
              </Link>
            ) : (
              <></>
            )
          )}
        </div>
      </div>
    </div>
  ) : (
    <></>
  )
}

function MobileMenuList({ items }: { items: MenuItem[] }) {
  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <MobileMenuItem key={item.id} item={item} />
      ))}
    </div>
  )
}

function MobileMenuItem({ item }: { item: MenuItem }) {
  const hasSubMenu = item.subMenu && item.subMenu.length > 0
  const [open, setOpen] = useState(false)

  return item?.url ? (
    <div>
      <div className="flex items-center justify-between">
        <Link href={item.url} className="font-medium">
          {item.label}
        </Link>
        {hasSubMenu && (
          <button
            className="text-sm hover:opacity-70"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronLeft className="w-3 h-3" />
            )}
          </button>
        )}
      </div>
      {hasSubMenu && open && (
        <div className="flex flex-col gap-1 mt-1 ml-4">
          <MobileMenuList items={item.subMenu!} />
        </div>
      )}
    </div>
  ) : (
    <></>
  )
}

export default Menu
