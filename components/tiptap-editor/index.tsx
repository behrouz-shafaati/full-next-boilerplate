'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Direction from './extensions/extension-direction'
import { Underline } from '@tiptap/extension-underline'
import { Heading } from '@tiptap/extension-heading'
import TextAlign from '@tiptap/extension-text-align'
import FileUpload, { FileUploadRef } from '../form-fields/file-upload'
import { FileDetails } from '@/lib/entity/file/interface'
import DeleteImageWithKey from './extensions/image-delete'
import { useRef, useState } from 'react'

import styles from './editor.module.css'
import MenuBar from './menu-bar'

interface TiptapEditor {
  name: string
  defaultContent?: string
  onChange?: (content: string) => void
}

export default function TiptapEditor({
  name,
  defaultContent = '',
  onChange,
}: TiptapEditor) {
  const fileUploadRef = useRef<FileUploadRef>(null)
  const [content, SetContent] = useState(JSON.stringify(defaultContent))
  const editor: any = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false, // 👈 اینجا heading داخل StarterKit رو خاموش کن
      }),
      Image,
      Link.configure({
        openOnClick: false,
        validate: (href) => /^https?:\/\//.test(href),
      }),
      Direction,
      Underline,
      Heading.configure({
        levels: [1, 2, 3, 4], // میتونی مشخص کنی چه level هایی رو ساپورت کنه
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      DeleteImageWithKey.configure({
        deleteFileHandler: (id: string) => {
          console.log('🗑 حذف از سرور:', id)
          fileUploadRef.current?.removeFileById(id)
        },
      }),
    ],
    content: defaultContent,
    onUpdate({ editor }) {
      const json = editor?.getJSON()
      const text = JSON.stringify({
        contentJson: json,
      })
      SetContent(text)
      onChange?.(text)
    },
  })

  const responseFileUploadHandler = (fileDetails: FileDetails) => {
    const { state, view } = editor
    const pos = state.selection.from
    editor
      ?.chain()
      .focus()
      .insertContentAt(pos, {
        type: 'image',
        attrs: {
          src: fileDetails.url,
          alt: fileDetails.alt,
          title: String(fileDetails.id),
          id: String(fileDetails.id),
        },
      })
      .setTextSelection(pos)
      .focus()
      .run()
  }

  // useEffect(() => {
  //   if (!editor) return

  //   const updateSelectionInfo = () => {
  //     const { state, view } = editor
  //     const selection = state.selection
  //     const doc = state.doc

  //     const info = {
  //       from: selection.from,
  //       to: selection.to,
  //       empty: selection.empty,
  //       isNodeSelection: selection instanceof NodeSelection,
  //       selectedNodeType:
  //         selection instanceof NodeSelection
  //           ? selection.node?.type?.name
  //           : null,
  //       selectedNodeContent:
  //         selection instanceof NodeSelection ? selection.node?.content : null,
  //       focus: view.hasFocus(),
  //       docType: doc.type,
  //     }

  //     // console.log('🟡 Selection Info:', info)
  //   }

  //   editor.on('selectionUpdate', updateSelectionInfo)
  //   editor.on('focus', updateSelectionInfo)
  //   editor.on('blur', updateSelectionInfo)

  //   // initial load
  //   updateSelectionInfo()

  //   return () => {
  //     editor.off('selectionUpdate', updateSelectionInfo)
  //     editor.off('focus', updateSelectionInfo)
  //     editor.off('blur', updateSelectionInfo)
  //   }
  // }, [editor])
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-10">
        <textarea
          value={content}
          name={name}
          className="w-full ltr"
          read-only="true"
          onChange={() => {}}
        />
        <MenuBar editor={editor} />
        <div className={styles.editor}>
          <EditorContent
            editor={editor}
            autoFocus
            className="prose prose-sm max-w-full outline-none focus:outline-none focus:ring-0 focus:border-transparent focus-within:[&>div]:outline-none focus-within:[&>div]:ring-0 border p-4 rounded-lg bg-white dark:bg-neutral-900"
          />
        </div>
      </div>
      <div className="col-span-2">
        <FileUpload
          name="tiptapfiles"
          title="رسانه های مطلب"
          responseHnadler={responseFileUploadHandler}
          ref={fileUploadRef}
          showDeleteButton={false}
        />
      </div>
    </div>
  )
}
