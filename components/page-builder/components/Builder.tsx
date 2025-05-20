'use client'
import { useBuilderStore } from '../store/useBuilderStore'
import { v4 as uuidv4 } from 'uuid'
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core'
import DraggableTextBlock from './DraggableTextBlock'
import DroppableColumn from './DroppableColumn'
import { useEffect } from 'react'

export default function PageBuilder() {
  const {
    rows,
    addRow,
    addColumn,
    addElementToColumn,
    moveElementWithinColumn,
    moveElementBetweenColumns,
    setActiveElement,
    activeElement,
  } = useBuilderStore()

  const findColumnContainingElement = (elementId: string) => {
    return rows
      .flatMap((row) => row.columns)
      .find((col) => col.elements.some((el) => el.id === elementId))
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    if (!active) return

    // set the dragged item in state
    const elementType = active.data.current?.type as 'text' | 'image'
    const id = active.id as string
    if (elementType) {
      setActiveElement({
        id,
        type: elementType,
        content: elementType === 'text' ? 'بلوک متن' : undefined,
      })
    }
  }
  const handleDragEnd = (event: DragEndEvent) => {
    console.log('#87 drag end')
    const { active, over } = event
    if (!over) return

    console.log('#88 active:', active, ' | #9 overId:', over)

    const activeId = active.id
    const overId = over.id

    const sourceCol = findColumnContainingElement(activeId)

    // حالت 1: کشیدن آیتم جدید از نوار ابزار (text-block)
    if (activeId === 'text-block') {
      // اگر روی ستون خالی انداختیم
      const column = rows.flatMap((r) => r.columns).find((c) => c.id === overId)
      console.log('#939 empty Col in new el:', column)
      if (column) {
        addElementToColumn(column.id, {
          id: uuidv4(),
          type: 'text',
          content: 'متن جدید',
        })
      }

      // یا روی یک آیتم درون ستون انداختیم
      const targetCol = findColumnContainingElement(overId)
      console.log('#939 full Col in new el:', targetCol)
      if (targetCol) {
        addElementToColumn(targetCol.id, {
          id: uuidv4(),
          type: 'text',
          content: 'متن جدید',
        })
      }

      return
    }

    // حالت 2: جابجایی آیتم بین ستون‌ها یا درون یک ستون
    const column =
      findColumnContainingElement(overId) ??
      rows.flatMap((r) => r.columns).find((col) => col.id === overId)
    console.log('@94 sourceCol:', sourceCol, ' | column:', column)
    if (!sourceCol || !column) return

    const oldIndex = sourceCol.elements.findIndex((el) => el.id === activeId)
    const newIndex = column.elements.findIndex((el) => el.id === overId)
    console.log('@94 oldIndex:', oldIndex, ' | newIndex:', newIndex)

    if (sourceCol.id === column.id) {
      // جابجایی در همان ستون
      if (oldIndex !== -1 && newIndex !== -1) {
        moveElementWithinColumn(sourceCol.id, oldIndex, newIndex)
      }
    } else {
      // جابجایی بین دو ستون
      moveElementBetweenColumns(
        sourceCol.id,
        column.id,
        activeId,
        newIndex === -1 ? column.elements.length : newIndex
      )
    }
  }

  useEffect(() => {
    console.log('#665 rows:', rows)
  }, [rows])

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
    >
      <div className="p-4 flex space-x-4">
        {/* نوار ابزار */}
        <div className="w-1/4 p-2 bg-gray-100 rounded">
          <h4 className="mb-2 font-bold">بلوک‌ها</h4>
          <DraggableTextBlock />
          <button
            onClick={addRow}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
          >
            افزودن ردیف
          </button>
        </div>

        {/* ناحیه ساخت صفحه */}
        <div className="w-3/4 space-y-4">
          {rows.map((row) => (
            <div key={row.id} className="p-4 border bg-white rounded">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold">ردیف</h3>
                <button
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
          ))}
        </div>
      </div>
    </DndContext>
  )
}
