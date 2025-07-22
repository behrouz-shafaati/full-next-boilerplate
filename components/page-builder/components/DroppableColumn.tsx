'use client'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import SortableItem from './SortableItem'
import { PageColumn } from '../types'

export default function DroppableColumn({
  rowId,
  col,
}: {
  rowId: string
  col: PageColumn
}) {
  const { isOver, setNodeRef } = useDroppable({ id: col.id })

  return (
    // <SortableContext
    //   items={col.blocks.map((el: any) => el.id)}
    //   strategy={rectSortingStrategy}
    // >
    <div
      ref={setNodeRef}
      className={`border  col-span-${
        col.width
      } rounded min-h-[100px] transition-all ${
        isOver ? 'bg-green-100' : 'bg-white'
      } group/column`}
    >
      {col.blocks.map((el: any, index: number) => (
        <SortableItem key={el.id} item={el} index={index} colId={col.id} />
      ))}
    </div>
    // </SortableContext>
  )
}
