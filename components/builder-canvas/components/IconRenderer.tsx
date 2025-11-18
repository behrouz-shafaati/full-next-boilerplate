'use client'

// import dynamic from 'next/dynamic'
import React from 'react'

interface IconRendererProps {
  name?: string
  className?: string
  size?: number
}

/**
 * آیکون را فقط یکبار با dynamic import بارگذاری می‌کند
 * و با تغییر نام آیکون دوباره فقط یکبار لود می‌شود.
 */
export function IconRenderer({
  name,
  className,
  size = 20,
}: IconRendererProps) {
  const [IconComp, setIconComp] =
    React.useState<React.ComponentType<any> | null>(null)

  React.useEffect(() => {
    let active = true

    async function loadIcon() {
      if (!name) {
        setIconComp(null)
        return
      }
      try {
        const mod = await import('lucide-react')
        const Icon = mod[name as keyof typeof mod] as React.ComponentType<any>
        if (active) {
          setIconComp(() => Icon || null)
        }
      } catch (err) {
        console.warn(`Icon "${name}" not found in lucide-react`)
        if (active) setIconComp(null)
      }
    }

    loadIcon()
    return () => {
      active = false
    }
  }, [name])

  if (!IconComp) return null
  return <IconComp className={className} size={size} />
}
