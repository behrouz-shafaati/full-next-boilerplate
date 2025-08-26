// رندر کردن بلاک‌ها از روی JSON

import React from 'react'
import type { Row } from '@/components/builder-canvas/types'
import {
  combineClassNames,
  computedStyles,
  getVisibilityClass,
} from '../utils/styleUtils'
import RenderBlock from './RenderBlock'

type Props = {
  editroMode: boolean
  rows: Row[]
  [key: string]: any // اجازه props داینامیک مثل content_1, content_2
}

const RendererRows = ({ editroMode = false, rows, ...rest }: Props) => {
  // فیلتر کردن propsهایی که content_ شروع میشن
  const contents = Object.entries(rest)
    .filter(([key]) => key.startsWith('content_'))
    .map(([key, value]) => ({
      key, // مثل "content_main" یا "content_title"
      node: value as React.ReactNode,
    }))
  const contentProps = contents.reduce((acc, { key, node }) => {
    acc[key] = node
    return acc
  }, {} as Record<string, React.ReactNode>)
  return (
    <>
      {rows?.map((row) => {
        const visibility = row.styles?.visibility
        const className = getVisibilityClass(visibility, { display: 'grid' })
        let stickyClass = ''
        if (row?.settings?.sticky || false) stickyClass = 'sticky top-0 z-50'
        return (
          <div
            key={row.id}
            style={{ ...computedStyles(row.styles) }}
            className={`grid grid-cols-12 gap-4 ${combineClassNames(
              row.classNames || {}
            )} ${className} ${stickyClass}`}
          >
            {row.columns.map((col) => {
              const responsiveDesign = row?.settings?.responsiveDesign ?? true
              if (!responsiveDesign) console.log('#288dsfklhj :', row)
              const classBaseOnResponsiveDesign = responsiveDesign
                ? `col-span-12 md:col-span-${col.width}`
                : `col-span-${col.width} md:col-span-${col.width}`
              return (
                <div
                  key={col.id}
                  className={`flex relative ${classBaseOnResponsiveDesign} ${combineClassNames(
                    col.classNames || {}
                  )} `}
                  style={{
                    ...computedStyles(col.styles),
                    ...computedStyles(col.settings),
                  }}
                >
                  {col.blocks.map((el: any, index: number) => (
                    <RenderBlock
                      key={el.id}
                      item={el}
                      editroMode={editroMode}
                      {...contentProps}
                    />
                  ))}
                </div>
              )
            })}
          </div>
        )
      })}
    </>
  )
}
export default RendererRows
