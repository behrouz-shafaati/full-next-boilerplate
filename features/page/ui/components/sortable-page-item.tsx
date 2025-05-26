import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { PageItem } from '../types/page'
import { usePageStore } from '../store/usePageStore'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { cn } from '@/lib/utils'
import { GripVertical } from 'lucide-react'

export default function SortableItem({
  item,
  depth,
  maxDepth,
}: {
  item: PageItem
  depth: number
  maxDepth?: number
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id })
  const { deleteItem, updateItem, addChild } = usePageStore()

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn(
        `p-3 cursor-default rounded  mr-${depth * 4}`,
        depth == 0 ? 'border' : ''
      )}
    >
      <div className="flex items-center space-x-2">
        <GripVertical
          className="h-5 w-5 ml-2 text-gray-400 cursor-pointer"
          {...listeners}
        />
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
        {(typeof maxDepth === 'undefined' || depth < maxDepth) && (
          <button
            type="button"
            onClick={() => addChild(item.id)}
            className="text-green-600"
          >
            + افزودن
          </button>
        )}
        <button
          type="button"
          onClick={() => deleteItem(item.id)}
          className="text-red-600"
        >
          🗑
        </button>
      </div>

      {item.children && item.children.length > 0 && (
        <div className="pr-6 space-y-2 mt-2">
          <SortableContext
            items={item.children.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            {item.children.map((child) => (
              <SortableItem
                key={child.id}
                item={child}
                depth={depth + 1}
                maxDepth={maxDepth}
              />
            ))}
          </SortableContext>
        </div>
      )}
    </div>
  )
}
