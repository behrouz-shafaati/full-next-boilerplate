// import { File } from '@/lib/entity/file/interface'
// import { getTranslation } from '@/lib/utils'
// import Image from 'next/image'

// type ImageAlbaProps = {
//   src?: string
//   file: File
//   showCaption?: boolean
//   zoomable?: boolean
// }
// export function ImageAlba({
//   src = '',
//   file,
//   showCaption = true,
//   zoomable = true,
//   ...restProps
// }: ImageAlbaProps) {
//   const { id, translations, srcLarge, srcMedium, srcSmall, width, height } =
//     file
//   const aspectRatio = width && height ? width / height : 16 / 9
//   src = src != '' ? src : srcMedium
//   if (!src) return null
//   const translation = getTranslation({
//     translations: translations,
//   })
//   return (
//     <figure
//       style={{ aspectRatio }}
//       className="relative rounded-xl overflow-hidden my-4"
//     >
//       <Image
//         src={src}
//         data-srclarge={srcLarge || ''}
//         alt={translation?.alt || translation?.title || ''}
//         title={translation?.title || ''}
//         fill
//         className="object-cover "
//         quality={70}
//         sizes="(max-width: 640px) 100vw,
//            (max-width: 1024px) 80vw,
//            (max-width: 1536px) 1080px,
//            1920px"
//       />
//       {/* Caption */}
//       {showCaption && translation?.description && (
//         <div className=" flex flex-row justify-center absolute bottom-2 w-full  text-center text-white dark:text-gray-900 text-sm md:text-base font-medium ">
//           <figcaption className="bg-black/20 dark:bg-white/20 backdrop-blur-md w-fit px-4 py-3 rounded-xl">
//             {translation.description}
//           </figcaption>
//         </div>
//       )}
//     </figure>
//   )
// }

'use client'

import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, Download, X } from 'lucide-react'
import { getTranslation } from '@/lib/utils'
import type { File as FileType } from '@/lib/entity/file/interface' // adjust path if needed
import { Skeleton } from './ui/skeleton'

type ImageAlbaProps = {
  src?: string
  file: FileType
  showCaption?: boolean
  zoomable?: boolean
}

/**
 * ImageAlba
 * - displays a responsive image (srcMedium / srcSmall fallback)
 * - opens a portal modal with high-res (srcLarge) on click (if zoomable)
 * - supports: buttons for zoom in/out, download, close
 * - supports: mouse wheel zoom (Ctrl+wheel recommended), two-finger pinch on touch, drag/pan when zoomed
 * - closes when clicking outside the image (overlay).
 */
export function ImageAlba({
  src = '',
  file,
  showCaption = true,
  zoomable = true,
}: ImageAlbaProps) {
  // --- file props (expected)
  const { srcLarge, srcMedium, srcSmall, width, height, translations } = file
  const translation = getTranslation({ translations })
  const displaySrc = src !== '' ? src : srcMedium || srcSmall
  if (!displaySrc) return null

  // --- local state
  const [mounted, setMounted] = useState(false) // SSR guard
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1) // 1..max
  const [pos, setPos] = useState({ x: 0, y: 0 }) // pan offset in px
  const [isDragging, setIsDragging] = useState(false)
  const [startPointer, setStartPointer] = useState<{
    x: number
    y: number
  } | null>(null)

  // pinch-to-zoom state
  const pinchRef = useRef<{ startDist: number; startZoom: number } | null>(null)

  // refs
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const imgWrapperRef = useRef<HTMLDivElement | null>(null)

  // aspect
  const aspectRatio = width && height ? width / height : 16 / 9

  // constants
  const MIN_ZOOM = 1
  const MAX_ZOOM = 4
  const ZOOM_STEP = 0.2

  // SSR mount
  useEffect(() => setMounted(true), [])

  // reset when closing
  useEffect(() => {
    if (!isZoomed) {
      setZoomLevel(1)
      setPos({ x: 0, y: 0 })
      pinchRef.current = null
    }
  }, [isZoomed])

  // global ESC listener to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsZoomed(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // wheel zoom (when overlay is open)
  useEffect(() => {
    if (!isZoomed) return
    const container = overlayRef.current
    if (!container) return

    const onWheel = (e: WheelEvent) => {
      // allow normal scroll if not holding ctrl (but for convenience we zoom on wheel as well)
      // prefer: Ctrl + wheel or wheel on overlay to zoom
      // prevent default to avoid page scroll when zooming/panning
      if (e.ctrlKey || e.deltaY !== 0) {
        e.preventDefault()
        const delta = -e.deltaY // wheel down positive deltaY
        const change = delta > 0 ? ZOOM_STEP : -ZOOM_STEP
        setZoomLevel((z) =>
          Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, +(z + change).toFixed(2)))
        )
      }
    }

    container.addEventListener('wheel', onWheel as EventListener, {
      passive: false,
    })
    return () =>
      container.removeEventListener('wheel', onWheel as EventListener)
  }, [isZoomed])

  // pointer drag handlers (works for mouse & touch via pointer events)
  useEffect(() => {
    const wrapper = imgWrapperRef.current
    if (!wrapper) return

    const onPointerDown = (e: PointerEvent) => {
      if (zoomLevel <= 1) return
      ;(e.target as Element).setPointerCapture?.(e.pointerId)
      setIsDragging(true)
      setStartPointer({ x: e.clientX - pos.x, y: e.clientY - pos.y })
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging || !startPointer) return
      // calculate new pos
      const nx = e.clientX - startPointer.x
      const ny = e.clientY - startPointer.y
      setPos({ x: nx, y: ny })
    }

    const onPointerUp = (e: PointerEvent) => {
      setIsDragging(false)
      setStartPointer(null)
    }

    wrapper.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)

    return () => {
      wrapper.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [isDragging, startPointer, pos.x, pos.y, zoomLevel])

  // touch pinch handlers (for mobile two-finger zoom)
  useEffect(() => {
    if (!isZoomed) return
    const overlay = overlayRef.current
    if (!overlay) return

    const getDist = (t1: Touch, t2: Touch) => {
      const dx = t2.clientX - t1.clientX
      const dy = t2.clientY - t1.clientY
      return Math.hypot(dx, dy)
    }

    let ongoing = false

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        ongoing = true
        const d = getDist(e.touches[0], e.touches[1])
        pinchRef.current = { startDist: d, startZoom: zoomLevel }
      }
    }

    const onTouchMove = (e: TouchEvent) => {
      if (!ongoing || !pinchRef.current || e.touches.length !== 2) return
      e.preventDefault()
      const d = getDist(e.touches[0], e.touches[1])
      const ratio = d / pinchRef.current.startDist
      const newZoom = Math.max(
        MIN_ZOOM,
        Math.min(MAX_ZOOM, +(pinchRef.current.startZoom * ratio).toFixed(2))
      )
      setZoomLevel(newZoom)
    }

    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) {
        ongoing = false
        pinchRef.current = null
      }
    }

    overlay.addEventListener('touchstart', onTouchStart, { passive: false })
    overlay.addEventListener('touchmove', onTouchMove, { passive: false })
    overlay.addEventListener('touchend', onTouchEnd)
    overlay.addEventListener('touchcancel', onTouchEnd)

    return () => {
      overlay.removeEventListener('touchstart', onTouchStart)
      overlay.removeEventListener('touchmove', onTouchMove)
      overlay.removeEventListener('touchend', onTouchEnd)
      overlay.removeEventListener('touchcancel', onTouchEnd)
    }
  }, [isZoomed, zoomLevel])

  // download handler
  const handleDownload = () => {
    const href = srcLarge || displaySrc
    const a = document.createElement('a')
    a.href = href
    a.download = translation?.title || 'image'
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  const openZoom = () => {
    if (!zoomable) return
    setIsZoomed(true)
  }

  const closeZoom = () => {
    setIsZoomed(false)
    setZoomLevel(1)
    setPos({ x: 0, y: 0 })
  }

  // helper: stop clicks inside image wrapper from closing overlay
  const onOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      closeZoom()
    }
  }

  if (!mounted)
    return (
      <Skeleton
        style={{ aspectRatio }}
        className="relative rounded-xl overflow-hidden my-4"
      />
    )

  // Portal modal content
  const modal = (
    <AnimatePresence>
      {isZoomed && (
        <motion.div
          key="image-zoom-portal"
          ref={overlayRef}
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onOverlayClick}
        >
          <motion.div
            initial={{ scale: 0.92 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 140, damping: 18 }}
            className="relative"
            style={{ touchAction: 'none' }}
          >
            <div
              ref={imgWrapperRef}
              // transform includes both scale and translate; we apply translate in px
              style={{
                transform: `translate(${pos.x}px, ${pos.y}px) scale(${zoomLevel})`,
                transition: isDragging ? 'none' : 'transform 0.22s ease',
                maxWidth: '90vw',
                maxHeight: '90vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor:
                  zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'auto',
                borderRadius: 12,
              }}
              // prevent overlay click from firing when interacting the image
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              <Image
                src={srcLarge || displaySrc}
                alt={translation?.alt || translation?.title || ''}
                width={width || 1280}
                height={height || 720}
                className="object-contain select-none rounded-lg shadow-2xl"
                draggable={false}
              />
            </div>
          </motion.div>

          {/* controls (bottom center) */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-[100000]">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setZoomLevel((z) =>
                  Math.max(MIN_ZOOM, +(z - ZOOM_STEP).toFixed(2))
                )
              }}
              className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-md"
              title="Zoom out"
            >
              <Minus size={18} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                setZoomLevel((z) =>
                  Math.min(MAX_ZOOM, +(z + ZOOM_STEP).toFixed(2))
                )
              }}
              className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-md"
              title="Zoom in"
            >
              <Plus size={18} />
            </button>

            <a
              href={srcLarge || displaySrc}
              download
              onClick={(e) => e.stopPropagation()}
              className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-md flex items-center justify-center"
              title="Download image"
            >
              <Download size={18} />
            </a>

            <button
              onClick={(e) => {
                e.stopPropagation()
                closeZoom()
              }}
              className="bg-red-500/80 hover:bg-red-600 text-white p-3 rounded-full backdrop-blur-md"
              title="Close"
            >
              <X size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <>
      {/* normal inline image with aspect ratio */}
      <figure
        style={{ aspectRatio }}
        className="relative rounded-xl overflow-hidden my-4"
      >
        <Image
          src={displaySrc}
          alt={translation?.alt || translation?.title || ''}
          title={translation?.title || ''}
          fill
          className={`object-cover transition-transform duration-200 ${
            zoomable ? 'cursor-zoom-in' : ''
          }`}
          quality={70}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, (max-width: 1536px) 1080px, 1920px"
          onClick={openZoom}
        />

        {/* top-right small controls in inline view */}
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 hover:opacity-100 transition-opacity duration-200">
          {zoomable && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                openZoom()
              }}
              className="p-2 rounded-md bg-black/40 text-white backdrop-blur-md"
              title="Open zoom"
            >
              <Plus size={16} />
            </button>
          )}
          <a
            href={srcLarge || displaySrc}
            download
            onClick={(e) => e.stopPropagation()}
            className="p-2 rounded-md bg-black/40 text-white backdrop-blur-md"
            title="Download"
          >
            <Download size={16} />
          </a>
        </div>

        {/* caption */}
        {showCaption && translation?.description && (
          <figcaption className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md text-white px-4 py-2 rounded-lg text-sm">
            {translation.description}
          </figcaption>
        )}
      </figure>

      {/* portal mount */}
      {ReactDOM.createPortal(modal, document.body)}
    </>
  )
}

export default ImageAlba
