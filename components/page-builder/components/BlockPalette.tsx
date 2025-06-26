import { blockRegistry } from '@/components/page-builder/registry/blockRegistry'
import DraggableWrapper from './DraggableWrapper'

export const BlockPalette = () => {
  return (
    <div className="flex flex-col gap-2 p-2">
      {Object.entries(blockRegistry).map(([key, block]) => {
        if (block.showInBlocksList)
          return <DraggableWrapper key={key} type={key} label={block.label} />
      })}
    </div>
  )
}
