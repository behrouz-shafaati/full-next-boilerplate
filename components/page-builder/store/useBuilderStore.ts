// store/useBuilderStore.ts
import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import { PageBlock, PageRow } from '../types'

type State = {
  activeElement: PageBlock | null
  setActiveElement: (el: PageBlock | null) => void
  rows: PageRow[]
  addRow: () => void
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
}

export const useBuilderStore = create<State>((set, get) => ({
  rows: [],
  activeElement: null,
  setActiveElement: (el) => set(() => ({ activeElement: el })),
  addRow: () =>
    set((state) => ({
      rows: [...state.rows, { id: uuidv4(), columns: [] }],
    })),

  addColumn: (rowId) =>
    set((state) => ({
      rows: state.rows.map((row) =>
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
    })),

  addElementToColumn: (colId, element) =>
    set((state) => {
      const row = state.rows.find((r) => r.columns.find((c) => c.id === colId))
      if (!row) return state

      return {
        rows: state.rows.map((r) =>
          r.id === row.id
            ? {
                ...r,
                columns: r.columns.map((c) =>
                  c.id === colId ? { ...c, blocks: [...c.blocks, element] } : c
                ),
              }
            : r
        ),
      }
    }),

  moveElementWithinColumn: (colId, oldIndex, newIndex) =>
    set((state) => {
      const newRows = state.rows.map((row) => ({
        ...row,
        columns: row.columns.map((col) => {
          if (col.id !== colId) return col

          const updated = [...col.blocks]
          const [moved] = updated.splice(oldIndex, 1)
          updated.splice(newIndex, 0, moved)

          return { ...col, blocks: updated }
        }),
      }))

      return { rows: newRows }
    }),

  moveElementBetweenColumns: (sourceColId, targetColId, elementId, newIndex) =>
    set((state) => {
      let movedElement: PageBlock | undefined

      const updatedRows = state.rows.map((row) => {
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

      return { rows: finalRows }
    }),
  /**
   *
   * @param sourceId Row ID to change location
   * @param destinationId
   */
  reorderRows: (sourceId, destinationId) =>
    set((state) => {
      const indexFrom = state.rows.findIndex((row) => row.id == sourceId)
      const indexTo = state.rows.findIndex((row) => row.id === destinationId)
      const updated = [...state.rows]
      const [moved] = updated.splice(indexFrom, 1)
      updated.splice(indexTo + (indexFrom < indexTo ? 0 : 0), 0, moved)
      return { ...state, rows: updated }
    }),

  getJson: () => JSON.stringify(get().rows, null, 2),
}))
