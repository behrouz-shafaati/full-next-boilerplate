// رندر کردن بلاک‌ها از روی JSON

import React from 'react'
import type { PageRow } from '@/components/page-builder/types'
import { computedStyles, getVisibilityClass } from '../utils/styleUtils'
import RenderBlock from './RenderBlock'

type Props = {
  rows: PageRow[]
}

const RendererRows = ({ rows }: Props) => {
  return (
    <div>
      {rows.map((row) => {
        const visibility = row.styles?.visibility
        const className = getVisibilityClass(visibility, { display: 'grid' })
        return (
          <div
            key={row.id}
            style={{ ...computedStyles(row.styles) }}
            className={`grid grid-cols-12 gap-4 ${className}`}
          >
            {row.columns.map((col) => (
              <div key={col.id} className={`col-span-${col.width} relative`}>
                {col.blocks.map((el: any, index: number) => (
                  <RenderBlock key={el.id} item={el} />
                ))}
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
export default RendererRows
