'use client';

import { Fragment, useState, useEffect } from 'react';
import MultipleSelectorInput, {
  Option as O,
} from '../ui/multiple-selector-input';

export interface Option extends O {
  value: string;
  label: string;
}

type MultiSelect = {
  title: string;
  name: string;
  defaultValues?: string[];
  defaultOptions: Option[];
  options?: Option[];
  placeholder?: string;
  icon?: any;
  state?: any;
};
export default function MultiSelect({
  title,
  name,
  defaultValues,
  defaultOptions,
  options,
  placeholder,
  icon,
  state,
}: MultiSelect) {
  const InputIcon = icon;
  const defaultSelected = [];
  const defaultSelectedKeys = [];
  options = options ?? defaultOptions;
  if (defaultValues)
    for (let i = 0; i < defaultValues.length; i++) {
      for (let j = 0; j < options.length; j++) {
        if (defaultValues[i] === options[j].value) {
          defaultSelected.push(options[j]);
          defaultSelectedKeys.push(options[j].value);
        }
      }
    }
  const [selectedOptions, setSelectedOptions] = useState(defaultSelected);
  const [selectedValues, setSelectedKeys] = useState(
    JSON.stringify(defaultSelectedKeys)
  );
  const errorMessages = state?.errors?.[name] ?? [];
  const hasError = state?.errors?.[name]?.length > 0;

  useEffect(() => {
    let keys = selectedOptions.map((option) => option.value);
    setSelectedKeys(JSON.stringify(keys));
  }, [selectedOptions]);
  return (
    <div className="mb-4">
      <label htmlFor={name} className="mb-2 block text-sm font-medium">
        {title}
      </label>
      <div className="relative">
        <input type="hidden" name={name} value={selectedValues} />
        <div className=" top-16">
          <MultipleSelectorInput
            placeholder={placeholder || 'انتخاب کنید'}
            defaultOptions={options}
            value={selectedOptions}
            hidePlaceholderWhenSelected
            onChange={setSelectedOptions}
            emptyIndicator={
              <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                چیزی پیدا نشد
              </p>
            }
          />
        </div>
        {icon && (
          <InputIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
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
  );
}
