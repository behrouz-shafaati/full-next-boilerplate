'use client'

import * as React from 'react'
import { icons } from 'lucide-react' //  نسخه جدیدتر
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Label } from '../ui/label'

type Props = {
  name: string
  title?: string
  defaultValue?: string
  onChange?: (value: string) => void
}

export function IconPicker({
  name,
  title = '',
  defaultValue = '',
  onChange,
}: Props) {
  const [value, setValue] = React.useState(defaultValue)
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')

  const iconEntries = Object.entries(icons).filter(([name]) =>
    name.toLowerCase().includes(search.toLowerCase())
  )

  const SelectedIcon =
    (value && icons[value as keyof typeof icons]) || icons.Circle

  return (
    <div className="flex flex-col gap-2">
      <input type="hidden" name={name} value={value || ''} />
      <Label htmlFor={name} className="mb-2 block text-sm font-medium">
        {title}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full flex justify-between"
          >
            <span className="flex items-center gap-2">
              <SelectedIcon className="w-5 h-5" />
              <span>{value || 'انتخاب آیکون'}</span>
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 h-96 p-2 overflow-y-auto">
          <Input
            placeholder="جستجوی آیکون..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-2"
          />
          <div className="grid grid-cols-6 gap-2">
            {iconEntries.map(([name, IconComp]) => (
              <button
                key={name}
                type="button"
                onClick={() => {
                  setValue(name)
                  onChange?.(name)
                  setOpen(false)
                }}
                className={cn(
                  'flex flex-col items-center p-2 rounded-md border hover:bg-muted transition',
                  value === name && 'bg-muted border-primary'
                )}
                title={name}
              >
                <IconComp className="w-5 h-5" />
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
