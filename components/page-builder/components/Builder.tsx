'use client'
import { useBuilderStore } from '../store/useBuilderStore'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'next/navigation'
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core'
import { useEffect } from 'react'
import { PageContent } from '../types'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import SortableRow from './SortableRow'
import ToolsSection from './toolsSection'
import { Button } from '@/components/ui/button'
import { blockRegistry } from '../registry/blockRegistry'

type props = {
  initialContent?: PageContent
}

export default function PageBuilder({ initialContent }: props) {
  const router = useRouter()
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
    deselectBlock,
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

    const activeData = active.data.current as {
      type:
        | 'text'
        | 'image'
        | 'video'
        | 'gallery'
        | 'form'
        | 'product'
        | 'custom'
    }

    const sourceCol = findColumnContainingElement(activeId)
    // اگر جابجایی مربوط به ردیف بود
    if (rows.find((r) => r.id === activeId)) {
      reorderRows(activeId, overId)
      return
    }

    // حالت 1: کشیدن آیتم جدید از نوار ابزار (text-block)
    if (activeId === 'text-block') {
      const block = blockRegistry[activeData.type]
      // اگر روی ستون خالی انداختیم
      const column = rows.flatMap((r) => r.columns).find((c) => c.id === overId)
      console.log('#939 empty Col in new el:', column)
      if (column) {
        addElementToColumn(column.id, {
          id: uuidv4(),
          type: activeData.type,
          ...block.defaultSettings,
        })
      }

      // یا روی یک آیتم درون ستون انداختیم
      const targetCol = findColumnContainingElement(overId)
      console.log('#939 full Col in new el:', targetCol)
      if (targetCol) {
        addElementToColumn(targetCol.id, {
          id: uuidv4(),
          type: activeData.type,
          ...block.defaultSettings,
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
        <div className="flex  h-screen w-full overflow-hidden">
          {/* نوار ابزار */}
          <aside className="relative h-screen w-80 shrink-0 bg-slate-50">
            <ToolsSection page={initialContent || null} />
            <div className="absolute bottom-0 flex w-full flex-row gap-2 bg-slate-100 p-2">
              <Button>ذخیره</Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.back()}
              >
                بازگشت
              </Button>
            </div>
          </aside>
          {/* ناحیه ساخت صفحه */}
          <div
            className="h-screen flex-1 overflow-y-auto overflow-x-hidden p-2"
            onClick={() => {
              deselectBlock()
            }}
          >
            <SortableContext
              items={rows.map((row) => row.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {rows.map((row) => (
                  <SortableRow key={row.id} row={row} />
                ))}
              </div>
            </SortableContext>

            <Button
              type="button"
              onClick={addRow}
              className="mt-4 w-full rounded px-4 py-2 text-white"
            >
              افزودن ردیف
            </Button>

            <pre className="mt-4 bg-gray-100 p-4">
              <code>{getJson()}</code>
            </pre>
          </div>
        </div>
      </DndContext>
    </>
  )
}
