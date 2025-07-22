import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { blockRegistry } from '@/components/page-builder/registry/blockRegistry'
import { PageBlock } from '../types'
import { GripHorizontal, Trash } from 'lucide-react'
import { useBuilderStore } from '../store/useBuilderStore'
import { Button } from '@/components/ui/button'

type SortableItemProp = {
  item: PageBlock
  index: number
  colId: string
}
export default function SortableItem({ item, index, colId }: SortableItemProp) {
  const { selectBlock, deleteItem, selectedBlock } = useBuilderStore()
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: item.id,
      data: { type: item.type },
    })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }
  const block = blockRegistry[item.type]
  const Component = block.Renderer

  let activeClass = ''
  if (selectedBlock?.id == item.id)
    activeClass = ' border-2 border-fuchsia-500 border-opacity-30'
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      style={style}
      className={`mb-2 relative group/item ${activeClass}`}
    >
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 p-1 z-10 opacity-0 group-hover/item:opacity-100 transition-opacity flex flex-row">
        <div {...listeners}>
          <GripHorizontal className="h-5 w-5 ml-2 text-gray-400 cursor-grab" />
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-4"
          onClick={() => deleteItem(item.id)}
        >
          <Trash className="h-5 w-5 text-gray-500" />
        </Button>
      </div>
      <div className="block-wrapper [&_a]:pointer-events-none [&_a]:cursor-default [&_a]:text-muted-foreground">
        <Component
          blockData={item}
          onClick={(e) => {
            e.stopPropagation() // جلوگیری از propagate شدن به document
            selectBlock(item)
          }}
        />
      </div>
    </div>
  )
}
