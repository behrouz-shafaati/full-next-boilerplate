'use client'

import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Option } from '../form-fields/combobox'
import Text from '../form-fields/text'

type CheckBoxInputProp = {
  title: string
  placeholder?: string
  value: string
  options: Option[]
  disabled: boolean
  onChange: (option: Option) => void
}

export default function ComboboxInput({
  options,
  placeholder = 'یک گزینه را انتخاب کنید',
  value,
  disabled = false,
  onChange,
}: CheckBoxInputProp) {
  const [open, setOpen] = React.useState(false)
  if (disabled)
    return (
      <Text
        title=""
        name="templateFor"
        disabled
        value={
          value
            ? options.find((option) => option.value === value)?.label
            : placeholder
        }
      />
    )
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-start"
        >
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          {value
            ? options.find((option) => option.value === value)?.label
            : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={`جستجوی ${placeholder}...`} />
          <CommandList>
            <CommandEmpty> موردی یافت نشد </CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  // اینجا value رو برابر label می‌ذاریم تا سرچ بر اساس label باشه
                  value={option.label}
                  onSelect={(currentValue) => {
                    onChange?.(option)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === option.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
