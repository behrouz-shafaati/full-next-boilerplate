// رندر کردن بلاک‌ها از روی JSON

import React from 'react'
import type { Row } from '@/components/builder-canvas/types'
import { computedStyles, getVisibilityClass } from '../utils/styleUtils'
import RenderBlock from './RenderBlock'

type Props = {
  rows: Row[]
}

const RendererRows = ({ rows }: Props) => {
  return (
    <>
      {rows.map((row) => {
        const visibility = row.styles?.visibility
        const className = getVisibilityClass(visibility, { display: 'grid' })
        let stickyClass = ''
        if (row?.settings?.sticky || false) stickyClass = 'sticky top-0 z-50'
        return (
          <div
            key={row.id}
            style={{ ...computedStyles(row.styles) }}
            className={`grid grid-cols-12 gap-4 ${className} ${stickyClass}`}
          >
            {row.columns.map((col) => (
              <div
                key={col.id}
                className={`flex relative col-span-${col.width} `}
                style={{
                  ...computedStyles(col.styles),
                  ...computedStyles(col.settings),
                }}
              >
                {col.blocks.map((el: any, index: number) => (
                  <RenderBlock key={el.id} item={el} />
                ))}
              </div>
            ))}
          </div>
        )
      })}
    </>
  )
}
export default RendererRows
