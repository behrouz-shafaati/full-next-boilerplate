'use client'

import { useState } from 'react'
import MultipleSelectorInput, {
  Option as O,
} from '../ui/multiple-selector-input'

export interface Option extends O {
  value: string
  label: string
}

type MultiSelect = {
  title: string
  name: string
  defaultValues?: Option[]
  defaultSuggestions?: Option[]
  maxSelected?: number
  placeholder?: string
  icon?: any
  state?: any
  onChange?: (values: Option[]) => void
  onSearch?: (query: string) => Promise<Option[]>
}
export default function MultiSelect({
  title,
  name,
  defaultValues,
  defaultSuggestions = [],
  maxSelected,
  placeholder,
  icon,
  state,
  onChange,
  onSearch,
}: MultiSelect) {
  const [values, setValues] = useState<Option[]>(defaultValues || [])
  const [defaultOptions, setDefaultOptions] = useState<Option[]>(
    defaultSuggestions || []
  )

  const errorMessages = state?.errors?.[name] ?? []
  const hasError = state?.errors?.[name]?.length > 0
  const InputIcon = typeof icon === 'object' ? () => icon : icon
  return (
    <div className="mb-4">
      <input
        type="hidden"
        readOnly
        name={name}
        value={JSON.stringify(values)}
      />
      <label htmlFor={name} className="mb-2 block text-sm font-medium">
        {title}
      </label>
      <div className="relative">
        <input type="hidden" name={name} value={JSON.stringify(values)} />
        <div className=" top-16">
          <MultipleSelectorInput
            placeholder={placeholder || 'انتخاب کنید'}
            defaultOptions={defaultOptions || []}
            value={values}
            hidePlaceholderWhenSelected
            onChange={(options) => {
              const selectedOptions = defaultOptions.filter((o) =>
                options.some((opt) => opt.value === o.value)
              )
              setValues(selectedOptions)
              onChange?.(selectedOptions)
            }}
            emptyIndicator={
              <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                چیزی پیدا نشد
              </p>
            }
            {...(onSearch ? { onSearch: onSearch } : {})}
            {...(maxSelected ? { maxSelected } : {})}
          />
        </div>
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500">
            <InputIcon />
          </span>
        )}
      </div>
      {hasError && (
        <div id={`${name}-error`} aria-live="polite" aria-atomic="true">
          {errorMessages.map((error: string) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
              {error}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}
