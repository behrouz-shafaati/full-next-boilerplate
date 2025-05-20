'use client'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

export default function DraggableTextBlock() {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'text-block',
  })

  const style = {
    transform: CSS.Translate.toString(transform),
  }

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="cursor-grab bg-blue-100 p-2 rounded text-center"
    >
      بلوک متن
    </div>
  )
}
