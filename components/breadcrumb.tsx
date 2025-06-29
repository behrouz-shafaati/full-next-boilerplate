import { cn } from '@/lib/utils'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

type BreadCrumbType = {
  title: string
  link: string
}

type BreadCrumbPropsType = {
  items: BreadCrumbType[]
}

let index = 1
export function BreadCrumb({ items }: BreadCrumbPropsType) {
  return (
    <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
      {items?.map((item: BreadCrumbType, index: number) => (
        <React.Fragment key={`${item.title}-${index++}`}>
          <ChevronLeft className="h-4 w-4" />
          <Link
            href={item.link}
            className={cn(
              'font-medium',
              index === items.length - 1
                ? 'text-foreground pointer-events-none'
                : 'text-muted-foreground'
            )}
          >
            {item.title}
          </Link>
        </React.Fragment>
      ))}
    </div>
  )
}
