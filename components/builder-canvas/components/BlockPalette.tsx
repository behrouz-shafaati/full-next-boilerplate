import { getTemplateFor } from '@/lib/utils'
import { blockRegistry } from '../registry/blockRegistry'
import { useBuilderStore } from '../store/useBuilderStore'
import DraggableWrapper from './DraggableWrapper'

type BlockPaletteProp = {
  newBlocks: any
}
export const BlockPalette = ({ newBlocks }: BlockPaletteProp) => {
  const { getJson } = useBuilderStore()
  const documnet = JSON.parse(getJson())
  const allBlocks = { ...blockRegistry, ...newBlocks }
  return (
    <div className="flex flex-col gap-2 p-2">
      {Object.entries(allBlocks).map(([key, block]) => {
        let visibleBlock = true
        if (
          (documnet.type === 'page' || documnet.type === 'templatePart') &&
          !!block?.inTemplateFor
        )
          visibleBlock = false
        else if (documnet.type === 'template' && !!block?.inTemplateFor) {
          const templateFor = getTemplateFor(documnet.templateFor)
          const prefix = templateFor.split('-')[0]
          if (!block.inTemplateFor.includes(prefix)) visibleBlock = false
        }
        if (block.showInBlocksList && visibleBlock)
          return <DraggableWrapper key={key} type={key} label={block.label} />
      })}
    </div>
  )
}
