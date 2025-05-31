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
import { PageContent } from '../types'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import SortableRow from './SortableRow'

type props = {
  initialContent?: PageContent
}

export default function PageBuilder({ initialContent }: props) {
  const {
    rows,
    addRow,
    getJson,
    addElementToColumn,
    moveElementWithinColumn,
    moveElementBetweenColumns,
    setActiveElement,
    activeElement,
    reorderRows,
  } = useBuilderStore()

  const findColumnContainingElement = (elementId: string) => {
    return rows
      .flatMap((row) => row.columns)
      .find((col) => col.blocks.some((el) => el.id === elementId))
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
        data: { content: elementType === 'text' ? 'بلوک متن' : undefined },
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
    // اگر جابجایی مربوط به ردیف بود
    if (rows.find((r) => r.id === activeId)) {
      reorderRows(activeId, overId)
      return
    }

    // حالت 1: کشیدن آیتم جدید از نوار ابزار (text-block)
    if (activeId === 'text-block') {
      // اگر روی ستون خالی انداختیم
      const column = rows.flatMap((r) => r.columns).find((c) => c.id === overId)
      console.log('#939 empty Col in new el:', column)
      if (column) {
        addElementToColumn(column.id, {
          id: uuidv4(),
          type: 'text',
          data: { content: 'متن جدید' },
        })
      }

      // یا روی یک آیتم درون ستون انداختیم
      const targetCol = findColumnContainingElement(overId)
      console.log('#939 full Col in new el:', targetCol)
      if (targetCol) {
        addElementToColumn(targetCol.id, {
          id: uuidv4(),
          type: 'text',
          data: { content: 'متن جدید' },
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

    const oldIndex = sourceCol.blocks.findIndex((el) => el.id === activeId)
    const newIndex = column.blocks.findIndex((el) => el.id === overId)
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
        newIndex === -1 ? column.blocks.length : newIndex
      )
    }
  }

  useEffect(() => {
    console.log('#665 rows:', rows)
  }, [rows])

  return (
    <>
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
              type="button"
              onClick={addRow}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
            >
              افزودن ردیف
            </button>
          </div>

          {/* ناحیه ساخت صفحه */}
          <SortableContext
            items={rows.map((row) => row.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="w-3/4 space-y-4">
              {rows.map((row) => (
                <SortableRow key={row.id} row={row} />
              ))}
            </div>
          </SortableContext>
        </div>
      </DndContext>

      <pre className="bg-gray-100 p-4 mt-4">
        <code>{getJson()}</code>
      </pre>
    </>
  )
}
