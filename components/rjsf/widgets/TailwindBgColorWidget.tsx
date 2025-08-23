'use client'
import { tailwindBgColors } from '@/lib/tailwindBgColors'
import Combobox from '@/components/form-fields/combobox'

export function TailwindBgColorWidget({ value, onChange }: any) {
  const patternTypeOptions = Object.entries(tailwindBgColors).map(
    ([name, className]) => ({
      label: (
        <div className="flex items-center gap-2">
          <span className={`w-4 h-4 rounded ${className}`} />
          <span>{name}</span>
        </div>
      ),
      value: className,
    })
  )
  return (
    <Combobox
      title=""
      name=""
      defaultValue={value}
      options={patternTypeOptions}
      placeholder=""
      onChange={(e) => onChange(e.target.value)}
    />
  )
}
