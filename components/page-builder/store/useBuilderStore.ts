// store/useBuilderStore.ts
import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'

type ElementType = {
  id: string
  type: 'text' | 'image'
  content?: string
}

type ColumnType = {
  id: string
  elements: ElementType[]
}

type RowType = {
  id: string
  columns: ColumnType[]
}

type State = {
  activeElement: ElementType | null
  setActiveElement: (el: ElementType | null) => void
  rows: RowType[]
  addRow: () => void
  addColumn: (rowId: string) => void
  addElementToColumn: (colId: string, element: ElementType) => void
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
}

export const useBuilderStore = create<State>((set) => ({
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
              columns: [...row.columns, { id: uuidv4(), elements: [] }],
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
                  c.id === colId
                    ? { ...c, elements: [...c.elements, element] }
                    : c
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

          const updated = [...col.elements]
          const [moved] = updated.splice(oldIndex, 1)
          updated.splice(newIndex, 0, moved)

          return { ...col, elements: updated }
        }),
      }))

      return { rows: newRows }
    }),

  moveElementBetweenColumns: (sourceColId, targetColId, elementId, newIndex) =>
    set((state) => {
      let movedElement: ElementType | undefined

      const updatedRows = state.rows.map((row) => {
        return {
          ...row,
          columns: row.columns.map((col) => {
            // حذف از ستون مبدا
            if (col.id === sourceColId) {
              const filtered = col.elements.filter((el) => {
                if (el.id === elementId) {
                  movedElement = el
                  return false
                }
                return true
              })
              return { ...col, elements: filtered }
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
              const updated = [...col.elements]
              updated.splice(newIndex, 0, movedElement)
              return { ...col, elements: updated }
            }
            return col
          }),
        }
      })

      return { rows: finalRows }
    }),
}))
