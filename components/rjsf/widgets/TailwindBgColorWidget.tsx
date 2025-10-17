// 'use client'

// import * as React from 'react'
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from '@/components/ui/popover'
// import { Button } from '@/components/ui/button'
// import { cn } from '@/lib/utils'
// import { WidgetProps } from '@rjsf/utils'

// // تمام رنگ‌های پایه Tailwind
// const TAILWIND_COLORS = [
//   'gray',
//   'neutral',
//   'zinc',
//   'stone',
//   'slate',
//   'red',
//   'orange',
//   'amber',
//   'yellow',
//   'lime',
//   'green',
//   'emerald',
//   'teal',
//   'cyan',
//   'sky',
//   'blue',
//   'indigo',
//   'violet',
//   'purple',
//   'fuchsia',
//   'pink',
//   'rose',
// ]

// // درجات Tailwind
// const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

// export function TailwindBgColorWidget({ value, onChange }: WidgetProps) {
//   const [open, setOpen] = React.useState(false)

//   // رنگ انتخاب‌شده را به دو بخش تقسیم می‌کنیم: base + shade
//   const [selected, setSelected] = React.useState<string | null>(value || null)

//   const handleSelect = (base: string, shade: number) => {
//     const newColor = `bg-${base}-${shade} dark:bg-${base}-${1000 - shade}` // مثلاً text-gray-900 dark:text-gray-100

//     setSelected(newColor)
//     onChange(newColor)
//     setOpen(false)
//   }

//   return (
//     <div className="flex flex-col gap-2">
//       <Popover open={open} onOpenChange={setOpen}>
//         <PopoverTrigger asChild>
//           <Button
//             type="button"
//             variant="outline"
//             className="flex justify-between items-center w-full"
//           >
//             <span>انتخاب رنگ </span>
//             {selected && (
//               <span
//                 className={cn(
//                   'w-6 h-6 rounded-full border ml-2',
//                   selected.split(' ')[0] // فقط قسمت روشن رو برای دمو
//                 )}
//               />
//             )}
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="max-h-[400px] overflow-y-auto w-[380px]">
//           {TAILWIND_COLORS.map((color) => (
//             <div key={color} className="mb-2">
//               <div className="font-medium mb-1 capitalize">{color}</div>
//               <div className="grid grid-cols-11 gap-1">
//                 {SHADES.map((shade) => {
//                   const bg = `bg-${color}-${shade}`
//                   const textClass = `text-${color}-${shade}`
//                   return (
//                     <button
//                       key={shade}
//                       type="button"
//                       className={cn(
//                         'w-6 h-6 rounded-md border',
//                         bg,
//                         value?.includes(textClass) && 'ring-2 ring-primary'
//                       )}
//                       onClick={() => handleSelect(color, shade)}
//                       title={`${color}-${shade}`}
//                     />
//                   )
//                 })}
//               </div>
//             </div>
//           ))}
//         </PopoverContent>
//       </Popover>
//     </div>
//   )
// }

'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

type StateType = 'default' | 'hover' | 'focus' | 'active'

interface BackgroundColorPickerProps {
  value?: Record<StateType, string>
  onChange: (value: Record<StateType, string>) => void
}

const tailwindBaseColors = [
  'gray',
  'neutral',
  'zinc',
  'stone',
  'slate',
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
]

const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]

export function TailwindBgColorWidget({
  value = { default: '' },
  onChange,
}: BackgroundColorPickerProps) {
  const [selectedState, setSelectedState] = React.useState<StateType>('default')
  const [open, setOpen] = React.useState(false)

  const handleSelectColor = (base: string, shade: number) => {
    const newColor = `bg-${base}-${shade} dark:bg-${base}-${1000 - shade}` // مثلاً text-gray-900 dark:text-gray-100
    onChange({
      ...value,
      [selectedState]:
        selectedState === 'default'
          ? newColor
          : `${selectedState}:bg-${base}-${shade} dark:${selectedState}:bg-${base}-${
              1000 - shade
            }`,
    })
    setOpen(false)
  }

  const currentValue = value[selectedState] || ''

  return (
    <div className="flex flex-col gap-3">
      {/* انتخاب حالت‌ها */}
      <Tabs
        defaultValue="default"
        value={selectedState}
        onValueChange={(v) => setSelectedState(v as StateType)}
      >
        <TabsList className="grid grid-cols-4 mb-2">
          <TabsTrigger value="default">Default</TabsTrigger>
          <TabsTrigger value="hover">Hover</TabsTrigger>
          {/* <TabsTrigger value="focus">Focus</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger> */}
        </TabsList>
      </Tabs>

      {/* دکمه باز کردن پاپ‌اور */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn('w-full justify-between', currentValue)}
          >
            {currentValue || 'انتخاب رنگ'}
            <div
              className={cn(
                'w-5 h-5 rounded-md border ml-2',
                currentValue || 'bg-gray-200'
              )}
            />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          side="bottom"
          className="w-[320px] max-h-[350px] overflow-auto"
        >
          <div className="grid grid-cols-10 gap-2">
            {tailwindBaseColors.map((base) =>
              shades.map((shade) => {
                const color = `bg-${base}-${shade}`
                return (
                  <button
                    key={`${base}-${shade}`}
                    type="button"
                    onClick={() => handleSelectColor(base, shade)}
                    className={cn(
                      'w-6 h-6 rounded-full border',
                      color,
                      currentValue.includes(color)
                        ? 'border-primary scale-110'
                        : 'border-transparent'
                    )}
                  />
                )
              })
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* پیش‌نمایش */}
      {/* <div
        className={cn(
          'h-12 flex items-center justify-center rounded-md border transition-all text-sm font-medium',
          value.default || 'bg-gray-100',
          value.hover || '',
          value.focus || '',
          value.active || ''
        )}
      >
        پیش‌نمایش دکمه
      </div> */}
    </div>
  )
}
