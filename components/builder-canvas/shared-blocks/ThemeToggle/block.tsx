'use client'
import React, { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')

  useEffect(() => {
    // read persisted theme
    const stored =
      (typeof window !== 'undefined' && localStorage.getItem('theme')) || null
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored)
    } else {
      setTheme('system')
    }
  }, [])

  function applyTheme(next: 'light' | 'dark' | 'system') {
    if (next === 'system') {
      localStorage.removeItem('theme')
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches
      document.documentElement.classList.toggle('dark', prefersDark)
      document.documentElement.classList.toggle('light', !prefersDark)
    } else {
      localStorage.setItem('theme', next)
      document.documentElement.classList.toggle('dark', next === 'dark')
      document.documentElement.classList.toggle('light', next === 'light')
    }
    setTheme(next)
  }

  return (
    <div className="inline-flex items-center gap-2">
      <button
        onClick={() => applyTheme('light')}
        aria-pressed={theme === 'light'}
      >
        روشن
      </button>
      <button
        onClick={() => applyTheme('dark')}
        aria-pressed={theme === 'dark'}
      >
        تاریک
      </button>
      <button
        onClick={() => applyTheme('system')}
        aria-pressed={theme === 'system'}
      >
        سیستمی
      </button>
    </div>
  )
}
