import { blockRegistry } from '../registry/blockRegistry'
import DraggableWrapper from './DraggableWrapper'

type BlockPaletteProp = {
  newBlocks: any
}
export const BlockPalette = ({ newBlocks }: BlockPaletteProp) => {
  const allBlocks = { ...blockRegistry, ...newBlocks }
  return (
    <div className="flex flex-col gap-2 p-2">
      {Object.entries(allBlocks).map(([key, block]) => {
        if (block.showInBlocksList)
          return <DraggableWrapper key={key} type={key} label={block.label} />
      })}
    </div>
  )
}
