import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { PageRow } from '../types'
import { GripVertical } from 'lucide-react'
import DroppableColumn from './DroppableColumn'
import { useBuilderStore } from '../store/useBuilderStore'

export default function SortableRow({ row }: { row: PageRow }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: row.id,
    })

  const { addColumn } = useBuilderStore()

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      style={style}
      key={row.id}
      className="p-4 border bg-white rounded"
    >
      <GripVertical
        className="h-5 w-5 ml-2 text-gray-400 cursor-pointer"
        {...listeners}
        key={row.id}
      />
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">ردیف</h3>
        <button
          type="button"
          onClick={() => addColumn(row.id)}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          افزودن ستون
        </button>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {row.columns.map((col) => (
          <DroppableColumn key={col.id} rowId={row.id} col={col} />
        ))}
      </div>
    </div>
  )
}
