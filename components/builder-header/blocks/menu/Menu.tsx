import { Menu as MenuType, MenuItem } from '@/features/menu/interface'
import Link from 'next/link'
import {
  AlignJustify as MenuIcon,
  ChevronDown,
  ChevronLeft,
} from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface MainMenuProps {
  menu: MenuType
}

function Menu({ menu, ...props }: MainMenuProps) {
  const items = menu.items
  return (
    <nav {...props}>
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* دسکتاپ */}
        <nav className="hidden md:flex gap-6">
          {items?.map((item) => (
            <MenuItemDesktop key={item.id} item={item} />
          ))}
        </nav>

        {/* موبایل */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <MenuIcon className="h-5 w-5" />
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

export function MenuItemDesktop({ item }: { item: MenuItem }) {
  const hasSubMenu = item.subMenu && item.subMenu.length > 0

  if (!hasSubMenu) {
    return (
      <Link href={item.url} className="hover:text-blue-600 px-2 py-1 block">
        {item.label}
      </Link>
    )
  }

  return (
    <div className="relative group transition-all">
      <Link
        href={item.url}
        className="flex items-center gap-1 hover:text-blue-600 px-2 py-1"
      >
        {item.label}
        <ChevronDown className="h-4 w-4" />
      </Link>

      {/* زیرمنو با hidden و group-hover:block */}
      <div className="absolute right-0 top-full hidden group-hover:block bg-white shadow-md min-w-[180px] z-50 transition-all">
        <div className="flex flex-col">
          {item.subMenu!.map((sub) => (
            <Link
              key={sub.id}
              href={sub.url}
              className="px-4 py-2 hover:bg-gray-100 whitespace-nowrap block"
            >
              {sub.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
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

  return (
    <div>
      <div className="flex items-center justify-between">
        <Link href={item.url} className="font-medium">
          {item.label}
        </Link>
        {hasSubMenu && (
          <button
            className="text-sm text-gray-500"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronLeft className="h-3 w-3" />
            )}
          </button>
        )}
      </div>
      {hasSubMenu && open && (
        <div className="ml-4 mt-1 flex flex-col gap-1">
          <MobileMenuList items={item.subMenu!} />
        </div>
      )}
    </div>
  )
}

export default Menu
