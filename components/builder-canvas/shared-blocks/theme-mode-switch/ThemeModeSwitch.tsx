'use client'

import * as React from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { computedStyles } from '../../utils/styleUtils'
import { Block } from '../../types'

type props = {
  widgetName: string
  blockData: {
    content: {}
    type: 'themeModeSwitch'
    settings: {}
  } & Block
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export default function ThemeModeSwitch({
  widgetName,
  blockData,
  ...props
}: props) {
  const { setTheme } = useTheme()

  return (
    <div
      style={{
        ...computedStyles(blockData?.styles || {}),
      }}
      {...props}
    >
      <DropdownMenu dir="rtl">
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            {/* <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" /> */}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme('light')}>
            روشن
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme('dark')}>
            تیره
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme('system')}>
            سیستم
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
