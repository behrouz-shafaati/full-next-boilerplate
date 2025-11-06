import { MenuItem } from '@/features/menu/interface'
import { ChevronDown, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function MobileMenuList({ items }: { items: MenuItem[] }) {
  return (
    <div className="flex flex-col gap-4">
      {(items || []).map((item, index) => (
        <MobileMenuItem key={index} item={item} />
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
        <Link href={item.url} className="font-thin text-sm">
          {item.label}
        </Link>
        {hasSubMenu && (
          <button className=" hover:opacity-70" onClick={() => setOpen(!open)}>
            {open ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronLeft className="w-3 h-3" />
            )}
          </button>
        )}
      </div>
      {hasSubMenu && open && (
        <div className="flex flex-col gap-1 mt-4 mr-4">
          <MobileMenuList items={item.subMenu!} />
        </div>
      )}
    </div>
  ) : (
    <></>
  )
}
