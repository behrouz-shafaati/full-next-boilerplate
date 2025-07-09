'use client'
import { useBuilderStore } from '../store/useBuilderStore'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'next/navigation'
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  MeasuringStrategy,
  pointerWithin,
} from '@dnd-kit/core'
import { useEffect } from 'react'
import { PageContent } from '../types'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import SortableRow from '../blocks/row/SortableRow'
import ToolsSection from './toolsSection'
import { Button } from '@/components/ui/button'
import { blockRegistry } from '../registry/blockRegistry'
import { SubmitButton } from '@/components/form-fields/submit-button'
import { Category } from '@/features/category/interface'

type props = {
  name: string
  submitFormHandler: any
  initialContent?: PageContent
  allTemplates: PageContent[]
  allCategories: Category[]
}

export default function PageBuilder({
  initialContent,
  name,
  submitFormHandler,
  allTemplates,
  allCategories,
}: props) {
  const router = useRouter()
  const {
    content,

    addRow,
    getJson,
    addElementToColumn,
    moveElementWithinColumn,
    moveElementBetweenColumns,
    setActiveElement,
    activeElement,
    reorderRows,
    deselectBlock,
    setContent,
    resetContent,
  } = useBuilderStore()

  const findColumnContainingElement = (elementId: string) => {
    return content.rows
      .flatMap((row) => row.columns)
      .find((col) => col.blocks.some((el) => el.id === elementId))
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    if (!active) return

    // set the dragged item in state
    const elementType = active.data.current?.type as 'text' | 'image'
    const id = active.id as string
    console.log('#000999 elementType: ', active.data.current)
    if (elementType) {
      setActiveElement({
        id,
        type: elementType,
        data: { content: elementType === 'text' ? 'بلوک متن' : undefined },
      })
    }
  }
  const handleDragEnd = (event: DragEndEvent) => {
    setActiveElement(null)
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
    if (content.rows.find((r) => r.id === activeId)) {
      reorderRows(activeId, overId)
      return
    }

    // حالت 1: کشیدن آیتم جدید از نوار ابزار (text-block)
    if (activeId === 'text-block') {
      const block = blockRegistry[activeData.type]
      // اگر روی ستون خالی انداختیم
      const column = content.rows
        .flatMap((r) => r.columns)
        .find((c) => c.id === overId)
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
      content.rows.flatMap((r) => r.columns).find((col) => col.id === overId)
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

  useEffect(() => {}, [content])

  useEffect(() => {
    if (initialContent) setContent(initialContent)
    else resetContent()
  }, [initialContent])
  return (
    <>
      <DndContext
        onDragEnd={handleDragEnd}
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
      >
        <div className="flex  h-screen w-full ">
          {/* نوار ابزار */}
          <aside className="relative h-screen w-80 shrink-0 bg-slate-50 overflow-y-auto overflow-x-hidden ">
            <ToolsSection
              page={content || null}
              allTemplates={allTemplates}
              allCategories={allCategories}
            />
            <div className="sticky bottom-0 flex w-full flex-row gap-2 bg-slate-100 p-2">
              <form action={submitFormHandler}>
                <textarea readOnly name={name} value={getJson()} />
                <SubmitButton />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.back()}
                >
                  بازگشت
                </Button>
              </form>
            </div>
          </aside>
          {/* ناحیه ساخت صفحه */}
          <div className="h-screen w-0 -z-50"></div>
          <div
            className="h-screen flex-1 overflow-y-auto rtl:pr-10 ltr:pl-10 "
            onClick={() => {
              deselectBlock()
            }}
          >
            <SortableContext
              items={content.rows.map((row) => row.id)}
              strategy={verticalListSortingStrategy}
            >
              <div>
                {content.rows.map((row) => (
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
          </div>
        </div>
      </DndContext>
    </>
  )
}
