// رندر کردن بلاک‌ها از روی JSON

import React from 'react'
import { blockRegistry } from '@/components/page-builder/registry/blockRegistry'
import type { PageBlock } from '@/components/page-builder/types'
import { useBuilderStore } from '../store/useBuilderStore'

type Props = {
  block: PageBlock
}

export const BlockRenderer = ({ block }: Props) => {
  const selectBlock = useBuilderStore((s) => s.selectBlock)

  const BlockDef = blockRegistry[block.type]
  if (!BlockDef) return <div>بلاک ناشناخته: {block.type}</div>

  const Component = BlockDef.Renderer

  return (
    <div style={block.styles}>
      <Component
        settings={block.settings}
        onClick={(e) => {
          e.stopPropagation() // جلوگیری از propagate شدن به document
          alert('hi')
          selectBlock(block)
        }}
      />
      {/* {block.children?.length > 0 &&
        block.children.map((child) => (
          <BlockRenderer key={child.id} block={child} />
        ))} */}
    </div>
  )
}
