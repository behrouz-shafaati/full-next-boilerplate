// رندر کردن بلاک‌ها از روی JSON

import React from 'react'
import type { PageRow } from '@/components/page-builder/types'
import { computedStyles } from '../utils/styleUtils'
import RenderBlock from './RenderBlock'

type Props = {
  rows: PageRow[]
}

const RendererRows = ({ rows }: Props) => {
  return (
    <div>
      {rows.map((row) => {
        return (
          <div
            key={row.id}
            style={{ ...computedStyles(row.styles) }}
            className="grid grid-cols-12 gap-4"
          >
            {row.columns.map((col) => (
              <div key={col.id} className={`col-span-${col.width} `}>
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
