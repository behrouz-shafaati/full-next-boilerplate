'use client'

import React from 'react'
import { CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react'
import { Row } from '@tanstack/react-table'

// نوع وضعیت‌ها
type StatusType = 'active' | 'deactive' | 'published' | 'draft'

interface StatusProps<T> {
  row: Row<T>
  accessorKey?: string // پیش‌فرض 'status'
}

export const Status = <T,>({ row, accessorKey = 'status' }: StatusProps<T>) => {
  const status = row.getValue<StatusType>(accessorKey)
  const isActive = status === 'active' || status === 'published'

  let icon, label

  switch (status) {
    case 'active':
    case 'published':
      icon = <CheckCircle className="w-4 h-4" />
      label = status === 'active' ? 'فعال' : 'منتشر شده'
      break
    case 'deactive':
    case 'draft':
      icon = <XCircle className="w-4 h-4" />
      label = status === 'deactive' ? 'غیرفعال' : 'پیش‌نویس'
      break
    default:
      icon = <XCircle className="w-4 h-4" />
      label = 'نامشخص'
  }

  const bgGradient = isActive
    ? 'bg-gradient-to-r from-green-400 to-green-600 dark:from-green-500 dark:to-green-700 hover:from-green-500 hover:to-green-700'
    : 'bg-gradient-to-r from-red-400 to-red-600 dark:from-red-500 dark:to-red-700 hover:from-red-500 hover:to-red-700'

  return (
    <div
      className={`
        flex items-center gap-2 px-3 py-1.5 rounded-full font-medium shadow-lg
        text-white transition-all duration-300 transform
        cursor-default select-none
        ${bgGradient}
        hover:scale-105
      `}
    >
      <span className="flex items-center justify-center w-5 h-5">{icon}</span>
      <span className="text-sm">{label}</span>
    </div>
  )
}
