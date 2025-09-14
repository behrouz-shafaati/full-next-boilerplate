type ClassNames = Record<string, string | undefined | null>

export function combineClassNames(classNames: ClassNames): string {
  return Object.values(classNames)
    .filter(Boolean) // حذف null و undefined و ''
    .map((str) => str.trim())
    .join(' ')
    .trim()
}

export const computedStyles = (
  styles?: Record<string, string>
): Record<string, string | number> => {
  const safeStyles = styles ?? {}
  const result: Record<string, string | number> = {}

  for (const [key, value] of Object.entries(safeStyles)) {
    if (value)
      if (key === 'opacity') {
        const num = parseFloat(value)
        result.opacity = isNaN(num) ? 1 : Math.min(Math.max(num / 100, 0), 1)
      } else if (key === 'padding') {
        result.padding = `${value?.top || 0}px ${value?.right || 0}px ${
          value?.bottom || 0
        }px ${value?.left || 0}px`
      } else if (key === 'margin') {
        result.margin = `${value?.top || 0}px ${value?.right || 0}px ${
          value?.bottom || 0
        }px ${value?.left || 0}px`
      } else if (key === 'borderRadius') {
        result.borderRadius = `${value?.top || 0}px ${value?.right || 0}px ${
          value?.bottom || 0
        }px ${value?.left || 0}px`
      } else if (key === 'boxShadow') {
        result['boxShadow'] = `${value?.inset ? 'inset ' : ''}${
          value?.x || 0
        }px ${value?.y || 0}px ${value?.blur || 0}px ${value?.spread || 0}px ${
          value?.color || ''
        }`
      } else if (key === 'fontSize') {
        result.fontSize = `${value}px `
      } else {
        result[key] = value
      }
  }

  return result
}

export const getVisibilityClass = (
  visibility: {
    mobile?: boolean
    tablet?: boolean
    desktop?: boolean
  },
  options?: { display?: string }
) => {
  const { mobile = true, tablet = true, desktop = true } = visibility || {}

  //مقدار پیش فرض زیر گرید بود که باعث میشد صفحه از عرض سریز کنه برای همین block‌ جایگزین آن شد
  const display = options?.display || 'block' // پیش‌فرض نمایش همه جا block

  const classList: string[] = []

  // موبایل: پایه‌ای‌ترین حالت (پیش‌فرض Tailwind)
  if (mobile === false) {
    classList.push('hidden')
  } else {
    classList.push(display)
  }

  // تبلت
  if (tablet === false) {
    classList.push('md:hidden')
  } else {
    classList.push(`md:${display}`)
  }

  // دسکتاپ
  if (desktop === false) {
    classList.push('lg:hidden')
  } else {
    classList.push(`lg:${display}`)
  }

  return classList.join(' ')
}

export function extractColorClasses(className: string): string {
  return className
    .split(/\s+/) // تبدیل استرینگ به آرایه کلاس‌ها
    .filter((cls) =>
      /^(dark:)?(bg-|text-|border-|shadow-|placeholder-|ring-)/.test(cls)
    )
    .join(' ')
}
