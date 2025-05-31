import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export default function SortableItem({
  item,
  index,
  colId,
}: {
  item: any
  index: number
  colId: string
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: item.id,
    })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="mb-2"
    >
      {item.type === 'text' && (
        <input
          className="w-full p-1 border rounded"
          value={item.content}
          readOnly
        />
      )}
    </div>
  )
}
