'use client'
import { useBuilderStore } from '../store/useBuilderStore'
import { DragEndEvent, useDroppable } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import SortableItem from './SortableItem'

export default function DroppableColumn({
  rowId,
  col,
}: {
  rowId: string
  col: any
}) {
  const { isOver, setNodeRef } = useDroppable({ id: col.id })
  const { moveElementWithinColumn } = useBuilderStore()

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!active || !over || active.id === over.id) return

    const oldIndex = col.elements.findIndex((el: any) => el.id === active.id)
    const newIndex = col.elements.findIndex((el: any) => el.id === over.id)

    if (oldIndex !== -1 && newIndex !== -1) {
      moveElementWithinColumn(col.id, oldIndex, newIndex)
    }
  }

  return (
    <SortableContext
      items={col.elements.map((el: any) => el.id)}
      strategy={rectSortingStrategy}
    >
      <div
        ref={setNodeRef}
        className={`border  col-span-4 rounded p-3 min-h-[100px] transition-all ${
          isOver ? 'bg-green-100' : 'bg-white'
        }`}
      >
        {col.elements.map((el: any, index: number) => (
          <SortableItem key={el.id} item={el} index={index} colId={col.id} />
        ))}
      </div>
    </SortableContext>
  )
}
