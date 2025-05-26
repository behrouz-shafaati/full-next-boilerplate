import { create } from 'zustand'
import { PageItem } from '../types/page'
import { v4 as uuidv4 } from 'uuid'

interface PageStore {
  items: PageItem[]
  addItem: () => void
  addChild: (parentId: string) => void
  deleteItem: (id: string) => void
  updateItem: (id: string, data: Partial<PageItem>) => void
  moveItem: (
    sourceId: string,
    destinationId: string | null,
    level: number
  ) => void
  reorderItems: (sourceId: string, destinationId: string) => void
  setItems: (items: PageItem[]) => void
  getJson: () => string
}

export const usePageStore = create<PageStore>((set, get) => ({
  items: [],

  addItem: () => {
    const newItem: PageItem = {
      id: uuidv4(),
      title: 'New Item',
      url: '#',
      children: [],
    }
    set((state) => ({ items: [...state.items, newItem] }))
  },

  addChild: (parentId: string) => {
    set((state) => {
      const addChildRecursive = (items: PageItem[]): PageItem[] =>
        items.map((item) => {
          if (item.id === parentId) {
            return {
              ...item,
              children: [
                ...(item.children || []),
                {
                  id: uuidv4(),
                  title: 'Sub Item',
                  url: '#',
                },
              ],
            }
          }
          return {
            ...item,
            children: item.children ? addChildRecursive(item.children) : [],
          }
        })

      return { items: addChildRecursive(state.items) }
    })
  },

  deleteItem: (id: string) => {
    const deleteRecursive = (items: PageItem[]): PageItem[] =>
      items
        .filter((item) => item.id !== id)
        .map((item) => ({
          ...item,
          children: item.children ? deleteRecursive(item.children) : [],
        }))

    set((state) => ({ items: deleteRecursive(state.items) }))
  },

  updateItem: (id: string, data: Partial<PageItem>) => {
    const updateRecursive = (items: PageItem[]): PageItem[] =>
      items.map((item) =>
        item.id === id
          ? { ...item, ...data }
          : {
              ...item,
              children: item.children ? updateRecursive(item.children) : [],
            }
      )

    set((state) => ({ items: updateRecursive(state.items) }))
  },

  moveItem: (sourceId, destinationId, level) => {
    if (sourceId === destinationId) return

    const [sourceItem, updatedItems] = findAndRemove(get().items, sourceId)
    if (!sourceItem) return

    const insertInto = (items: PageItem[]): PageItem[] => {
      return items.map((item) => {
        if (item.id === destinationId) {
          return {
            ...item,
            children: [...(item.children || []), sourceItem],
          }
        }
        return {
          ...item,
          children: item.children ? insertInto(item.children) : [],
        }
      })
    }

    if (destinationId) {
      set({ items: insertInto(updatedItems) })
    } else {
      set({ items: [...updatedItems, sourceItem] })
    }
  },

  reorderItems: (sourceId, destinationId) => {
    const reorderRecursive = (items: PageItem[]): PageItem[] => {
      const indexFrom = items.findIndex((i) => i.id === sourceId)
      const indexTo = items.findIndex((i) => i.id === destinationId)
      if (indexFrom === -1 || indexTo === -1) {
        return items.map((item) => ({
          ...item,
          children: item.children ? reorderRecursive(item.children) : [],
        }))
      }
      const updated = [...items]
      const [moved] = updated.splice(indexFrom, 1)
      updated.splice(indexTo + (indexFrom < indexTo ? 0 : 0), 0, moved)
      return updated
    }

    set((state) => ({ items: reorderRecursive(state.items) }))
  },

  setItems: (items: PageItem[]) => set({ items }),

  getJson: () => JSON.stringify(get().items, null, 2),
}))

const findAndRemove = (
  items: PageItem[],
  id: string
): [PageItem | null, PageItem[]] => {
  let removed: PageItem | null = null

  const recursiveRemove = (list: PageItem[]): PageItem[] => {
    return list.reduce<PageItem[]>((acc, item) => {
      if (item.id === id) {
        removed = item
        return acc
      }

      const [childRemoved, newChildren] = item.children
        ? findAndRemove(item.children, id)
        : [null, []]

      if (childRemoved) removed = childRemoved

      acc.push({
        ...item,
        children: item.children ? newChildren : undefined,
      })

      return acc
    }, [])
  }

  const newItems = recursiveRemove(items)
  return [removed, newItems]
}
