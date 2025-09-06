import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import AdSlotView from '../node-view/AdSlotNodeView'

export const AdSlot = Node.create({
  name: 'adSlot',
  group: 'block',
  atom: true, // یعنی خودش یک بلاک مستقل هست و محتوا نداره

  addAttributes() {
    return {
      slotId: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-slot-id'),
        renderHTML: (attributes) => {
          if (!attributes.slotId) return {}
          return { 'data-slot-id': attributes.slotId }
        },
      },
    }
  },

  parseHTML() {
    return [{ tag: 'ad-slot' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['ad-slot', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return ReactNodeViewRenderer(AdSlotView)
  },
})
