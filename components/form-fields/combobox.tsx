'use client';

import { Fragment, useState, useEffect } from 'react';
import ComboboxInput from '../ui/combobox-input';

export type Option = {
  value: string;
  label: string;
};

type ComboboxProps = {
  title: string;
  name: string;
  defaultValue?: string;
  options: Option[];
  placeholder?: string;
  icon?: any;
  state?: any;
};
export default function Combobox({
  title,
  name,
  defaultValue,
  options,
  placeholder,
  icon,
  state,
}: ComboboxProps) {
  const errorMessages = state?.errors?.[name] ?? [];
  const hasError = state?.errors?.[name]?.length > 0;
  const InputIcon = typeof icon === 'object' ? () => icon : icon;
  let defaultSelectedOption: Option = {
    value: '',
    label: '',
  };
  options = options;
  if (defaultValue)
    for (let j = 0; j < options.length; j++) {
      if (defaultValue === options[j].value) {
        defaultSelectedOption = options[j];
      }
    }
  const [selectedOption, setSelectedOption] = useState(defaultSelectedOption);

  useEffect(() => {
    let value = selectedOption.value;
  }, [selectedOption]);
  return (
    <div className="mb-4">
      <label htmlFor={name} className="mb-2 block text-sm font-medium">
        {title}
      </label>
      <div className="relative">
        <input type="hidden" name={name} value={selectedOption.value} />
        <div className=" top-16">
          <ComboboxInput
            title={title}
            placeholder={placeholder || 'انتخاب کنید'}
            options={options}
            value={selectedOption.value}
            onChange={setSelectedOption}
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
  );
}
