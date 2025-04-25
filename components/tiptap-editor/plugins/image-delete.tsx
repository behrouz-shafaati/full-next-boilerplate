import { NodeSelection, Plugin, PluginKey } from 'prosemirror-state'

const ImageDeletePlugin = (callback: (src: string) => void) => {
  return new Plugin({
    key: new PluginKey('imageDeletePlugin'),
    props: {
      handleKeyDown(view, event) {
        const { state } = view
        const { selection } = state
        if (selection instanceof NodeSelection) {
          const node = selection.node
          console.log('#009 event.key:', event.key)
          if (
            node?.type.name === 'image' &&
            (event.key === 'Delete' || event.key === ' ')
          ) {
            const src = node.attrs.src
            callback(src) // send to server
            const tr = state.tr.deleteSelection()
            view.dispatch(tr)
            return true
          }
        }

        return false
      },
    },
  })
}

export default ImageDeletePlugin
