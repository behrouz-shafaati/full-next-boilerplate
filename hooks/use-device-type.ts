import { useEffect, useState } from 'react'

export function useDeviceType() {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>(
    'desktop'
  )

  useEffect(() => {
    const update = () => {
      if (window.matchMedia('(max-width: 640px)').matches) setDevice('mobile')
      else if (window.matchMedia('(max-width: 1024px)').matches)
        setDevice('tablet')
      else setDevice('desktop')
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return device
}
