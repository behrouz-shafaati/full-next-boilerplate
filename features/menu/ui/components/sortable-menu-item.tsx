import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { MenuItem } from '../types/menu'
import { useMenuStore } from '../store/useMenuStore'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

export default function SortableItem({
  item,
  depth,
}: {
  item: MenuItem
  depth: number
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id })
  const { deleteItem, updateItem, addChild } = useMenuStore()

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`border p-3 rounded bg-white shadow ml-${depth * 4}`}
    >
      <div className="flex items-center space-x-2" {...listeners}>
        <input
          className="border px-2 py-1"
          value={item.title}
          onChange={(e) => updateItem(item.id, { title: e.target.value })}
        />
        <input
          className="border px-2 py-1"
          value={item.url}
          onChange={(e) => updateItem(item.id, { url: e.target.value })}
        />
        <button onClick={() => addChild(item.id)} className="text-green-600">
          +Sub
        </button>
        <button onClick={() => deleteItem(item.id)} className="text-red-600">
          🗑
        </button>
      </div>

      {item.children && item.children.length > 0 && (
        <div className="pl-6 space-y-2 mt-2">
          <SortableContext
            items={item.children.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            {item.children.map((child) => (
              <SortableItem key={child.id} item={child} depth={depth + 1} />
            ))}
          </SortableContext>
        </div>
      )}
    </div>
  )
}
