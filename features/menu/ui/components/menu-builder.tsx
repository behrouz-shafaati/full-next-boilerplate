'use client'

import { useMenuStore } from '../store/useMenuStore'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import SortableItem from './sortable-menu-item'
import { useState } from 'react'
import { MenuItem } from '../types/menu'

export default function MenuBuilder() {
  const { items, addItem, getJson, reorderItems } = useMenuStore()
  const [activeItem, setActiveItem] = useState<MenuItem | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  )

  const findItemById = (items: MenuItem[], id: string): MenuItem | null => {
    for (const item of items) {
      if (item.id === id) return item
      if (item.children) {
        const found = findItemById(item.children, id)
        if (found) return found
      }
    }
    return null
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveItem(null)
    if (!over || active.id === over.id) return
    reorderItems(active.id as string, over.id as string)
  }

  return (
    <div className="p-4 space-y-4">
      <button
        onClick={addItem}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        + Add Item
      </button>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={(event) => {
          const item = findItemById(items, event.active.id as string)
          if (item) setActiveItem(item)
        }}
      >
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {items.map((item) => (
              <SortableItem key={item.id} item={item} depth={0} />
            ))}
          </div>
        </SortableContext>
        <DragOverlay>
          {activeItem ? (
            <div className="border p-2 bg-white shadow rounded">
              {activeItem.title}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <pre className="bg-gray-100 p-4 mt-4">
        <code>{getJson()}</code>
      </pre>
    </div>
  )
}
