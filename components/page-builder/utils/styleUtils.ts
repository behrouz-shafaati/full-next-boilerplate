export const computedStyles = (
  styles?: Record<string, string>
): Record<string, string | number> => {
  const safeStyles = styles ?? {}
  const result: Record<string, string | number> = {}

  for (const [key, value] of Object.entries(safeStyles)) {
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

  const classList: string[] = []

  // موبایل: پایه‌ای‌ترین حالت (پیش‌فرض Tailwind)
  if (mobile === false) {
    classList.push('hidden')
  } else {
    classList.push('block')
  }

  // تبلت
  if (tablet === false) {
    classList.push('md:hidden')
  } else {
    classList.push(`md:${options?.display || 'block'}`)
  }

  // دسکتاپ
  if (desktop === false) {
    classList.push('lg:hidden')
  } else {
    classList.push(`lg:${options?.display || 'block'}`)
  }

  return classList.join(' ')
}
