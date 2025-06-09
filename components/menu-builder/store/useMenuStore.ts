import { create } from 'zustand'
import { MenuItem } from '../types/menu'
import { v4 as uuidv4 } from 'uuid'

interface MenuStore {
  items: MenuItem[]
  addItem: () => void
  addChild: (parentId: string) => void
  deleteItem: (id: string) => void
  updateItem: (id: string, data: Partial<MenuItem>) => void
  moveItem: (
    sourceId: string,
    destinationId: string | null,
    level: number
  ) => void
  reorderItems: (sourceId: string, destinationId: string) => void
  setItems: (items: MenuItem[]) => void
  getJson: () => string
}

export const useMenuStore = create<MenuStore>((set, get) => ({
  items: [],

  addItem: () => {
    const newItem: MenuItem = {
      id: uuidv4(),
      title: 'New Item',
      url: '#',
      children: [],
    }
    set((state) => ({ items: [...state.items, newItem] }))
  },

  addChild: (parentId: string) => {
    set((state) => {
      const addChildRecursive = (items: MenuItem[]): MenuItem[] =>
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
    const deleteRecursive = (items: MenuItem[]): MenuItem[] =>
      items
        .filter((item) => item.id !== id)
        .map((item) => ({
          ...item,
          children: item.children ? deleteRecursive(item.children) : [],
        }))

    set((state) => ({ items: deleteRecursive(state.items) }))
  },

  updateItem: (id: string, data: Partial<MenuItem>) => {
    const updateRecursive = (items: MenuItem[]): MenuItem[] =>
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

    const insertInto = (items: MenuItem[]): MenuItem[] => {
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
    const reorderRecursive = (items: MenuItem[]): MenuItem[] => {
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

  setItems: (items: MenuItem[]) => set({ items }),

  getJson: () => JSON.stringify(get().items, null, 2),
}))

const findAndRemove = (
  items: MenuItem[],
  id: string
): [MenuItem | null, MenuItem[]] => {
  let removed: MenuItem | null = null

  const recursiveRemove = (list: MenuItem[]): MenuItem[] => {
    return list.reduce<MenuItem[]>((acc, item) => {
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
