'use client'

import * as React from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Smile } from 'lucide-react'
import { Button } from '@/components/ui/button'

// ایمپورت درست
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'

interface EmojiPickerProps {
  onSelect: (emoji: string) => void
}

export function EmojiPicker({ onSelect }: EmojiPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="icon" variant="ghost">
          <Smile className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[320px] h-[400px]">
        <Picker
          data={data}
          onEmojiSelect={(emoji: any) => onSelect(emoji.native)}
          theme={
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-color-scheme: dark)').matches
              ? 'dark'
              : 'light'
          }
        />
      </PopoverContent>
    </Popover>
  )
}
