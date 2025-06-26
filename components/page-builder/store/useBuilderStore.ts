// store/useBuilderStore.ts
import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import { PageBlock, PageColumn, PageContent, PageRow } from '../types'

const defaultColumn = () => ({
  id: uuidv4(),
  width: 4,
  blocks: [],
})

type State = {
  activeElement: PageBlock | null
  setActiveElement: (el: PageBlock | null) => void
  content: PageContent
  addRow: () => void
  deleteRow: (rowId: string) => void
  addColumn: (rowId: string) => void
  addElementToColumn: (colId: string, element: PageBlock) => void
  moveElementWithinColumn: (
    colId: string,
    oldIndex: number,
    newIndex: number
  ) => void
  moveElementBetweenColumns: (
    sourceColId: string,
    targetColId: string,
    elementId: string,
    newIndex: number
  ) => void
  getJson: () => string
  reorderRows: (sourceId: string, destinationId: string) => void
  updateRowColumns: (rowId: string, layout: string) => void
  updatePage: (itemId: string | null, key: string, value: any) => void
  selectedBlock: PageBlock | null
  selectBlock: (block: PageBlock) => void
  deselectBlock: () => void
}

export const useBuilderStore = create<State>((set, get) => ({
  content: {
    title: '',
    rows: [],
  },
  rows: [],
  activeElement: null,
  setActiveElement: (el) => set(() => ({ activeElement: el })),
  addRow: () =>
    set((state) => ({
      content: {
        ...state.content,
        rows: [
          ...state.content.rows,
          {
            id: uuidv4(),
            type: 'row',
            styles: {},
            settings: { rowColumns: '4-4-4' },
            columns: [defaultColumn(), defaultColumn(), defaultColumn()],
          },
        ],
      },
    })),
  deleteRow: (rowId) =>
    set((state) => ({
      content: {
        ...state.content,
        rows: state.content.rows.filter((row) => row.id != rowId),
      },
    })),
  addColumn: (rowId) =>
    set((state) => ({
      content: {
        ...state.content,
        rows: state.content.rows.map((row) =>
          row.id === rowId
            ? {
                ...row,
                columns: [
                  ...row.columns,
                  { id: uuidv4(), width: 12, blocks: [] },
                ],
              }
            : row
        ),
      },
    })),

  addElementToColumn: (colId, element) =>
    set((state) => {
      const row = state.content.rows.find((r) =>
        r.columns.find((c) => c.id === colId)
      )
      if (!row) return state

      return {
        content: {
          ...state.content,
          rows: state.content.rows.map((r) =>
            r.id === row.id
              ? {
                  ...r,
                  columns: r.columns.map((c) =>
                    c.id === colId
                      ? { ...c, blocks: [...c.blocks, element] }
                      : c
                  ),
                }
              : r
          ),
        },
      }
    }),

  moveElementWithinColumn: (colId, oldIndex, newIndex) =>
    set((state) => {
      const newRows = state.content.rows.map((row) => ({
        ...row,
        columns: row.columns.map((col) => {
          if (col.id !== colId) return col

          const updated = [...col.blocks]
          const [moved] = updated.splice(oldIndex, 1)
          updated.splice(newIndex, 0, moved)

          return { ...col, blocks: updated }
        }),
      }))

      return { content: { ...state.content, rows: newRows } }
    }),

  moveElementBetweenColumns: (sourceColId, targetColId, elementId, newIndex) =>
    set((state) => {
      let movedElement: PageBlock | undefined

      const updatedRows = state.content.rows.map((row) => {
        return {
          ...row,
          columns: row.columns.map((col) => {
            // حذف از ستون مبدا
            if (col.id === sourceColId) {
              const filtered = col.blocks.filter((el) => {
                if (el.id === elementId) {
                  movedElement = el
                  return false
                }
                return true
              })
              return { ...col, blocks: filtered }
            }
            return col
          }),
        }
      })

      const finalRows = updatedRows.map((row) => {
        return {
          ...row,
          columns: row.columns.map((col) => {
            // اضافه به ستون مقصد
            if (col.id === targetColId && movedElement) {
              const updated = [...col.blocks]
              updated.splice(newIndex, 0, movedElement)
              return { ...col, blocks: updated }
            }
            return col
          }),
        }
      })

      return { content: { ...state.content, rows: finalRows } }
    }),
  /**
   *
   * @param sourceId Row ID to change location
   * @param destinationId
   */
  reorderRows: (sourceId, destinationId) =>
    set((state) => {
      const indexFrom = state.content.rows.findIndex(
        (row) => row.id == sourceId
      )
      const indexTo = state.content.rows.findIndex(
        (row) => row.id === destinationId
      )
      const updated = [...state.content.rows]
      const [moved] = updated.splice(indexFrom, 1)
      updated.splice(indexTo + (indexFrom < indexTo ? 0 : 0), 0, moved)
      return { ...state, content: { ...state.content, rows: updated } }
    }),

  /**
   *
   * @param rowId
   * @param layout
   */
  updateRowColumns: (rowId, layout) => {
    const widths = layout.split('-').map(Number)

    set((state) => ({
      content: {
        ...state.content,
        rows: state.content.rows.map((row) => {
          if (row.id !== rowId) return row

          let index = -1
          // ساخت ستون‌های جدید
          const newColumns: PageColumn[] = widths.map((width) => {
            index++
            return {
              id: uuidv4(),
              width,
              blocks: row.columns[index]?.blocks || [], // اگه وجود نداشت، آرایه‌ی خالی
            }
          })

          return {
            ...row,
            columns: newColumns,
          }
        }),
      },
    }))
  },

  /**
   *
   * @param itemId
   * @param key
   * @param value
   */
  updatePage: (itemId, key, value) =>
    set((state) => {
      if (itemId == null) {
        console.log(key, ':', value)
        return {
          content: { ...state.content, [key]: value },
        }
      }
      const updatedRows = state.content.rows.map((row) => {
        let updatedRow = row
        if (row.id === itemId) {
          updatedRow = { ...row, [key]: value }
          state.selectBlock(updatedRow)
          return updatedRow
        }

        const updatedColumns = row.columns.map((column) => {
          let updatedColumn = column
          if (column.id === itemId) {
            // آپدیت ستون
            updatedColumn = { ...column, [key]: value }
            state.selectBlock(updatedColumn)
            return updatedColumn
          }

          const updatedBlocks = column.blocks.map((block) => {
            let updatedBlock = block
            if (block.id === itemId) {
              // آپدیت محتوا
              if (key === 'content') {
                updatedBlock = {
                  ...block,
                  content: value,
                }
              }
              // آپدیت استایل
              if (key === 'styles' && typeof value === 'object') {
                updatedBlock = {
                  ...block,
                  styles: value,
                }
              }
              // آپدیت تنظمیات بلاک
              if (key === 'settings' && typeof value === 'object') {
                updatedBlock = {
                  ...block,
                  settings: value,
                }
              }
              state.selectBlock(updatedBlock)
            }
            return updatedBlock
          })

          return { ...column, blocks: updatedBlocks }
        })

        return { ...row, columns: updatedColumns }
      })

      return {
        content: { ...state.content, rows: updatedRows },
      }
    }),
  getJson: () => JSON.stringify(get().content, null, 2),
  selectedBlock: null,
  selectBlock: (block) => {
    set({ selectedBlock: block })
  },
  deselectBlock: () => set({ selectedBlock: null }),
}))
