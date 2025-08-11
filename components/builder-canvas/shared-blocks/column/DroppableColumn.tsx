import { Column } from '../../types'
import { Settings } from 'lucide-react'
import { useBuilderStore } from '../../store/useBuilderStore'
import { Button } from '@/components/ui/button'
import { useDroppable } from '@dnd-kit/core'
import SortableItem from '../../components/SortableItem'
import { computedStyles } from '../../utils/styleUtils'

type DroppableColumnProp = {
  rowId: string
  col: Column
  newBlocks: any
}

export default function DroppableColumn({
  rowId,
  col,
  newBlocks,
}: DroppableColumnProp) {
  const { isOver, setNodeRef } = useDroppable({
    id: col.id,
    data: {
      type: 'column',
    },
  })

  const { deleteItem, selectBlock, activeElement, selectedBlock } =
    useBuilderStore()

  let activeClass = ''
  if (selectedBlock?.id == col.id)
    activeClass = ' border-2 border-fuchsia-500 border-opacity-30'

  return (
    <div
      ref={setNodeRef}
      className={`flex relative border   col-span-${
        col.width
      } rounded min-h-[100px] transition-all ${
        isOver ? 'bg-green-100' : 'bg-white'
      } group/column ${activeClass}`}
      style={{ ...computedStyles(col.styles), ...computedStyles(col.settings) }}
    >
      <div
        key={`div-${col.id}`}
        className="absolute w-full -bottom-9  flex flex-col align-middle items-center justify-between pl-2 gap-2 z-10 opacity-0 group-hover/column:opacity-100 transition-opacity"
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={(e) => {
            e.stopPropagation() // جلوگیری از propagate شدن به document
            selectBlock({
              id: col.id,
              type: 'column',
              styles: col.styles,
              settings: col.settings,
            })
          }}
        >
          <Settings className="h-5 w-5 text-gray-500" />
        </Button>
      </div>

      {col.blocks.map((el: any, index: number) => (
        <SortableItem
          key={el.id}
          item={el}
          index={index}
          colId={col.id}
          newBlocks={newBlocks}
        />
      ))}
    </div>
  )
}
