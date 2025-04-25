import { Extension } from '@tiptap/core'
import { NodeSelection } from 'prosemirror-state'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    deleteImageWithKey: {
      /**
       * حذف عکس وقتی انتخاب شده و کاربر کلید delete/backspace می‌زنه
       */
      deleteSelectedImage: () => ReturnType
    }
  }
}

const DeleteImageWithKey = Extension.create({
  name: 'deleteImageWithKey',
  addOptions() {
    return {
      deleteFileHandler: undefined,
    }
  },
  addKeyboardShortcuts() {
    return {
      Delete: () => this.editor.commands.deleteSelectedImage(),
      Backspace: () => this.editor.commands.deleteSelectedImage(),
      ' ': () => this.editor.commands.deleteSelectedImage(),
    }
  },

  addCommands() {
    return {
      deleteSelectedImage:
        () =>
        ({ state, dispatch }) => {
          const { selection } = state

          if (
            selection instanceof NodeSelection &&
            selection.node.type.name === 'image'
          ) {
            const imageSrc = selection.node.attrs.src

            // صدا زدن تابع حذف فایل اگه موجود باشه
            if (this.options.deleteFileHandler) {
              this.options.deleteFileHandler(imageSrc)
            }

            console.log('#234 imageSrc:', imageSrc)

            // حذف عکس از داکیومنت
            dispatch(state.tr.deleteSelection())
            return true
          }

          return false
        },
    }
  },
})

export default DeleteImageWithKey
